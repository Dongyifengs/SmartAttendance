import axios from 'axios';
import {encrypt} from './crypto';
import {Buffer} from 'buffer';

/**
 * @file RollCall API 模块
 * @description 封装点名系统相关接口的通用调用方法，包括登录、签到、签退、课程信息等。
 * @module RollCallAPI
 */

/**
 * 核心 Axios 实例 - RollCallAPI
 * 用于访问 rollcall.anlaxy.com.cn 主接口
 */
const RollCallAPI = axios.create({
    baseURL: 'https://rollcall.anlaxy.com.cn/SerApi/v02',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

/**
 * 次级 Axios 实例 - PairAPI
 * 用于访问 PairAPI 接口（本地代理）
 */
const PairAPI = axios.create({
    baseURL: '/PairAPI',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

/**
 * 生成接口参数（双重 Base64 编码）
 * @param {object} data - 需要进行编码的数据对象
 * @returns {string} 返回双重 Base64 编码后的参数字符串，例如：`interface=xxxxx`
 */
function generateInterfaceParams(data: object): string {
    const jsonStr = JSON.stringify(data);
    const firstEncode = Buffer.from(jsonStr).toString('base64');
    return `interface=${Buffer.from(firstEncode).toString('base64')}`;
}

/**
 * 通用 API 调用方法（增强版）
 *
 * @async
 * @function apiCall
 * @param {string} func - 要调用的后端接口函数名（如 "Member_Login"）
 * @param {object} [options={}] - 可选参数配置
 * @param {Record<string, any>} [options.param=null] - 自定义参数对象
 * @param {string|null} [options.date=null] - 日期字符串
 * @param {string|null} [options.userid=null] - 用户ID
 * @param {string|null} [options.userpwd=null] - 用户加密密码
 * @param {string|null} [options.deviceId=null] - 设备唯一标识
 * @param {string|null} [options.client_local_id=null] - 客户端本地ID
 * @param {string|null} [options.userKey=null] - 用户会话密钥
 * @param {string|null} [options.group_id=null] - 班级/分组ID
 * @returns {Promise<any>} 返回后端响应数据
 * @throws {Error} 当请求失败时抛出异常
 */
export async function apiCall(
    func: string,
    options: {
        param?: Record<string, any> | null;
        date?: string | null;
        userid?: string | null;
        userpwd?: string | null;
        deviceId?: string | null;
        client_local_id?: string | null;
        userKey?: string | null;
        group_id?: string | null;
        pk_user?: string | null;
        pk_class?: string | null;
        pk_lesson?: string | null;
        type?: string | null;
        startDate?: string | null;
        endDate?: string | null;
    } = {}
): Promise<any> {
    const {
        param = {},
        date = null,
        userid = null,
        userpwd = null,
        deviceId = null,
        client_local_id = null,
        userKey = null,
        group_id = null,
        pk_user = null,
        pk_class = null,
        pk_lesson = null,
        type = null,
        startDate = null,
        endDate = null

    } = options;

    const payload: Record<string, any> = {
        CommType: "function",
        Comm: func,
        Param: {
            ...param,
            Source_PlatForm: 2,
            ...(date ? {date} : {}),
            ...(userid ? {userid} : {}),
            ...(userpwd ? {userpwd} : {}),
            ...(deviceId ? {deviceId} : {}),
            ...(client_local_id ? {client_local_id} : {}),
            ...(userKey ? {userKey} : {}),
            ...(group_id ? {group_id} : {}),
            ...(pk_user ? {pk_user} : {}),
            ...(pk_class ? {pk_class} : {}),
            ...(pk_lesson ? {pk_lesson} : {}),
            ...(type ? {type} : {}),
            ...(startDate ? {startDate} : {}),
            ...(endDate ? {endDate} : {}),
        }
    };

    const formData = generateInterfaceParams(payload);

    try {
        const response = await RollCallAPI.post('', formData);
        return response.data;
    } catch (error) {
        console.error('API 调用失败:', error);
        throw error;
    }
}

/**
 * 通用 RollCall Pair API 调用器
 *
 * @async
 * @function apiRollCall
 * @param {string} func - 要调用的后端函数名
 * @param {object} [options={}] - 参数对象
 * @param {Record<string, any>} [options.param=null] - 自定义参数对象
 * @param {string|null} [options.userKey=null] - 用户密钥
 * @param {string|null} [options.group_id=null] - 班级/分组 ID
 * @returns {Promise<any>} 返回后端响应数据
 */
export async function apiRollCall(
    func: string,
    options: {
        param?: Record<string, any> | null;
        userKey?: string | null;
        group_id?: string | null;
        date?: string | null;
        userid?: string | null;
        userpwd?: string | null;
        deviceId?: string | null;
        client_local_id?: string | null;
        pk_user?: string | null;
        pk_class?: string | null;
        pk_lesson?: string | null;
        type?: string | null;
        startDate?: string | null;
        endDate?: string | null;

    } = {}
): Promise<any> {
    const {
        param = {},
        userKey = null,
        group_id = null,
        date = null,
        userid = null,
        userpwd = null,
        deviceId = null,
        client_local_id = null,
        pk_user = null,
        pk_class = null,
        pk_lesson = null,
        type = null,
        startDate = null,
        endDate = null

    } = options;

    const payload: Record<string, any> = {
        CommType: "function",
        Comm: func,
        Param: {
            ...param,
            Source_PlatForm: 2,
            ...(userKey ? {userKey} : {}),
            ...(group_id ? {group_id} : {}),
            ...(date ? {date} : {}),
            ...(userid ? {userid} : {}),
            ...(userpwd ? {userpwd} : {}),
            ...(deviceId ? {deviceId} : {}),
            ...(client_local_id ? {client_local_id} : {}),
            ...(pk_user ? {pk_user} : {}),
            ...(pk_class ? {pk_class} : {}),
            ...(pk_lesson ? {pk_lesson} : {}),
            ...(type ? {type} : {}),
            ...(startDate ? {startDate} : {}),
            ...(endDate ? {endDate} : {}),
        }
    };

    const formData = generateInterfaceParams(payload);

    try {
        const response = await PairAPI.post('', formData);
        return response.data;
    } catch (error) {
        console.error('API 调用失败:', error);
        throw error;
    }
}

/**
 * 用户登录接口
 *
 * @async
 * @function ZHKQ_LOGIN
 * @param {string} username - 用户名/账号
 * @param {string} password - 明文密码（将在函数内加密）
 * @param {string} deviceId - 设备唯一标识
 * @returns {Promise<any>} 返回登录结果数据
 */
export async function ZHKQ_LOGIN(
    username: string,
    password: string,
    deviceId: string
): Promise<any> {
    const encryptedPwd = encrypt(password);
    return apiCall("Member_Login", {
        userid: username,
        userpwd: encryptedPwd,
        client_local_id: deviceId
    });
}

/**
 * 获取当天课程列表
 *
 * @async
 * @function getDayCourseList
 * @param {string} date - 日期字符串（如 "2025-10-21"）
 * @param {string} userKey - 用户密钥
 * @returns {Promise<any>} 返回当天课程列表
 */
export async function getDayCourseList(
    date: string,
    userKey: string
): Promise<any> {
    return apiCall("RollCall_SourceListDay", {
        date,
        userKey
    });
}

/**
 * 获取当天签到记录
 *
 * @async
 * @function getDaySignList
 * @param {string} date - 日期字符串
 * @param {string} userKey - 用户密钥
 * @returns {Promise<any>} 返回签到记录数据
 */
export async function getDaySignList(
    date: string,
    userKey: string
): Promise<any> {
    return apiCall("RollCall_SourceSignList", {
        date,
        userKey
    });
}

/**
 * 课程签到参数接口定义
 * @property {string} pk_anlaxy_syllabus_user - 课程用户主键
 * @property {number} sign_in_type - 签到类型（0=正常，1=迟到等）
 * @property {string} u_begin_time - 签到时间
 * @property {number} late_time_length - 迟到时长（分钟）
 * @property {number} late_num - 迟到次数
 * @property {number} ask_leave_num - 请假次数
 * @property {number} in_longitude - 签到经度
 * @property {number} in_latitude - 签到纬度
 * @property {string} phone_code - 手机识别码
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

/**
 * 课程签到接口
 *
 * @async
 * @function signIn
 * @param {SignInParams} params - 签到参数对象
 * @param {string} userKey - 用户密钥
 * @returns {Promise<any>} 返回签到结果
 */
export async function signIn(
    params: SignInParams,
    userKey: string
): Promise<any> {
    return apiCall("RollCall_SignInSource", {
        param: params,
        userKey
    });
}

/**
 * 课程签退参数接口定义
 *
 * @property {string} pk_anlaxy_syllabus_user - 课程用户主键
 * @property {string} phone_code - 手机识别码
 * @property {number} sign_out_type - 签退类型（0=正常，1=早退等）
 * @property {string} u_end_time - 签退时间
 * @property {string} lesson_change_list - 课程调整列表
 * @property {string} lesson_change_type - 调整类型
 * @property {number} ask_leave_num - 请假次数
 * @property {number} out_longitude - 签退经度
 * @property {number} out_latitude - 签退纬度
 * @property {string} reviewscore - 评分
 * @property {string} reviewcontent - 评价内容
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

/**
 * 课程签退接口
 *
 * @async
 * @function signOut
 * @param {SignOutParams} params - 签退参数对象
 * @param {string} userKey - 用户密钥
 * @returns {Promise<any>} 返回签退结果
 */
export async function signOut(
    params: SignOutParams,
    userKey: string
): Promise<any> {
    return apiCall("RollCall_SignOutSource", {
        param: params,
        userKey
    });
}

/**
 * 获取课程结束时间
 *
 * @async
 * @function getEndTime
 * @param {string} lessonId - 课程ID
 * @param {string} userKey - 用户密钥
 * @returns {Promise<any>} 返回课程结束时间数据
 */
export async function getEndTime(
    lessonId: string,
    userKey: string
): Promise<any> {
    return apiCall("RollCall_Get_Change_EndTime", {
        param: {lesson_change_list: lessonId},
        userKey
    });
}

/**
 * 获取用户班级列表
 *
 * @async
 * @function getUserClass
 * @param {string} userKey - 用户密钥
 * @returns {Promise<any>} 返回班级列表数据
 */
export async function getUserClass(
    userKey: string
): Promise<any> {
    return apiRollCall("Member_Get_Class", {
        userKey
    });
}

/**
 * 获取班级学生列表
 *
 * @async
 * @function getClassStudent
 * @param {string} userKey - 用户密钥
 * @param {string} group_id - 班级ID
 * @returns {Promise<any>} 返回学生列表数据
 */
export async function getClassStudent(
    userKey: string,
    group_id: string
): Promise<any> {
    return apiRollCall("Member_Get_Group", {
        userKey,
        group_id
    });
}

/**
 * 获取课程状态
 */
export async function getCourseStatus(
    userKey: string,
    pk_user: string,
    pk_class: string,
    type: string,
    startDate: string,
    endDate: string
): Promise<any> {
    return apiRollCall("Supplement_Class_Anomaly", {
        userKey,
        pk_user,
        pk_class,
        "pk_lesson": "",
        type,
        startDate,
        endDate
    });
}

// 获取对应状态次数
export async function getStatusCount(
    userKey: string,
    pk_class: string,
    pk_lesson: string,
    pk_user: string,
    type: string,
    startDate: string,
    endDate: string
): Promise<any> {
    return apiRollCall("Supplement_Lesson_User", {
        userKey,
        pk_user,
        pk_class,
        pk_lesson,
        type,
        startDate,
        endDate
    });
}

