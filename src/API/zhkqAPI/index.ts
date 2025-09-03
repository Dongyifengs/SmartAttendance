import axios from 'axios';
import {encrypt} from './crypto';
import {Buffer} from 'buffer';

/**
 * 创建配置好的 Axios 实例
 */
const api = axios.create({
    baseURL: 'https://rollcall.anlaxy.com.cn/SerApi/v02',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

/**
 * 生成接口参数（双重Base64编码）
 * @param data - 需要传输的数据对象
 * @returns 双重Base64编码后的参数字符串，格式为 "interface=编码后的数据"
 */
function generateInterfaceParams(data: object): string {
    const jsonStr = JSON.stringify(data);
    const firstEncode = Buffer.from(jsonStr).toString('base64');
    return `interface=${Buffer.from(firstEncode).toString('base64')}`;
}

/**
 * 通用API调用方法
 * @param func - 接口功能名称
 * @param param - 接口参数对象
 * @param userKey - 用户认证密钥，可选
 * @returns 返回接口响应数据
 * @throws 当请求失败时抛出错误
 */
export async function apiCall(
    func: string,
    param: Record<string, any>,
    userKey: string | null = null
): Promise<any> {
    // 构造请求负载
    const payload: Record<string, any> = {
        CommType: "function",  // 固定为"function"
        Comm: func,            // 接口功能名称
        Param: {
            ...param,          // 展开传入的参数
            Source_PlatForm: 2 // 固定为2，表示平台类型
        }
    };

    // 如果提供了userKey，添加到参数中
    if (userKey) {
        payload.Param.userKey = userKey;
    }

    // 生成双重Base64编码的表单数据
    const formData = generateInterfaceParams(payload);

    try {
        const response = await api.post('', formData);
        return response.data;
    } catch (error) {
        console.error('API调用失败:', error);
        throw error;
    }
}

/**
 * 用户登录接口
 * @param username - 用户名/学号
 * @param password - 密码（明文，内部会自动加密）
 * @param deviceId - 设备IMEI1
 * @returns 登录响应数据，包含用户信息和token等
 * @throws 登录失败时抛出错误
 */
export async function ZHKQ_LOGIN(
    username: string,
    password: string,
    deviceId: string
): Promise<any> {
    const encryptedPwd = encrypt(password); // 密码加密处理
    return apiCall("Member_Login", {
        userid: username,            // 用户名
        userpwd: encryptedPwd,       // 加密后的密码
        client_local_id: deviceId // 固定设备ID
    });
}

/**
 * 获取当天课程列表
 * @param date - 日期字符串，格式为YYYY-MM-DD
 * @param userKey - 用户认证密钥
 * @returns 返回当天课程列表数据
 * @throws 请求失败时抛出错误
 */
export async function getDayCourseList(
    date: string,
    userKey: string
): Promise<any> {
    return apiCall("RollCall_SourceListDay", {date}, userKey);
}

/**
 * 获取当天签到记录
 * @param date - 日期字符串，格式为YYYY-MM-DD
 * @param userKey - 用户认证密钥
 * @returns 返回当天签到记录数据
 * @throws 请求失败时抛出错误
 */
export async function getDaySignList(
    date: string,
    userKey: string
): Promise<any> {
    return apiCall("RollCall_SourceSignList", {date}, userKey);
}

/**
 * 课程签到接口
 * @param params - 签到参数对象
 * @param userKey - 用户认证密钥
 * @returns 返回签到结果
 * @throws 签到失败时抛出错误
 */
export interface SignInParams {
    pk_anlaxy_syllabus_user: string;
    sign_in_type: number;
    u_begin_time: string;
    late_time_length: number;
    late_num: number;
    ask_leave_num: number;
    in_longitude: number;
    in_latitude: number;
    phone_code: string;
}

export async function signIn(
    params: SignInParams,
    userKey: string
): Promise<any> {
    return apiCall("RollCall_SignInSource", params, userKey);
}

/**
 * 课程签退接口
 * @param params - 签退参数对象
 * @param userKey - 用户认证密钥
 * @returns 返回签退结果
 * @throws 签退失败时抛出错误
 */
export interface SignOutParams {
    pk_anlaxy_syllabus_user: string;
    phone_code: string;
    sign_out_type: number;
    u_end_time: string;
    lesson_change_list: string;
    lesson_change_type: string;
    ask_leave_num: number;
    out_longitude: number;
    out_latitude: number;
    reviewscore: string;
    reviewcontent: string;
}

export async function signOut(
    params: SignOutParams,
    userKey: string
): Promise<any> {
    return apiCall("RollCall_SignOutSource", params, userKey);
}

/**
 * 获取课程结束时间
 * @param lessonId - 课程ID
 * @param userKey - 用户认证密钥
 * @returns 返回课程结束时间信息
 * @throws 请求失败时抛出错误
 */
export async function getEndTime(
    lessonId: string,
    userKey: string
): Promise<any> {
    return apiCall(
        "RollCall_Get_Change_EndTime",
        {lesson_change_list: lessonId},
        userKey
    );
}