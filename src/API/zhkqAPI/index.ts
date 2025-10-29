import {encrypt} from './crypto/crypto.ts';
import {generateInterfaceParams} from './Function/Function'
import {PairAPI, RollCallAPI} from './APIStarter/APIStarter';
import type {ZHKQ_CourseList, ZHKQ_SignInRespondingBody, ZHKQ_SignRecord, ZHKQ_UserInfo} from './type/RespondingBody'
import type {ZHKQ_SignInParams} from "@/API/zhkqAPI/type/RequestingBody.ts";


/**
 * 通用 API 调用方法（增强版）
 *
 * @async
 * @function apiCall
 * @param { string } func - 要调用的后端接口函数名（如 "Member_Login"）
 * @param { object } [options={}] - 可选参数配置
 * @param { Record<string, any> } [options.param=null] - 自定义参数对象
 * @param { string|null } [options.date=null] - 日期字符串
 * @param { string|null } [options.userid=null] - 用户ID
 * @param { string|null } [options.userpwd=null] - 用户加密密码
 * @param { string|null } [options.deviceId=null] - 设备唯一标识
 * @param { string|null } [options.client_local_id=null] - 客户端本地ID
 * @param { string|null } [options.userKey=null] - 用户会话密钥
 * @param { string|null } [options.group_id=null] - 班级/分组ID
 * @returns { Promise<any> } 返回后端响应数据
 * @throws { Error} 当请求失败时抛出异常
 */
export async function apiCall<T = any>(
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
        classpk?: string | null;
        source_code?: string | null;
        user_code?: string | null;
        start?: string | null;
        end?: string | null;
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
        endDate = null,
        source_code = null,
        user_code = null,
        start = null,
        end = null,

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
            ...(source_code ? {source_code} : {}),
            ...(user_code ? {user_code} : {}),
            ...(start ? {start} : {}),
            ...(end ? {end} : {})
        }
    };

    const formData = generateInterfaceParams(payload);

    try {
        const response = await RollCallAPI.post('', formData);
        return response.data as T;
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
 * @param { string } func - 要调用的后端函数名
 * @param { object } [options={}] - 参数对象
 * @param { Record<string, any> } [options.param=null] - 自定义参数对象
 * @param { string|null } [options.userKey=null] - 用户密钥
 * @param { string|null } [options.group_id=null] - 班级/分组 ID
 * @returns { Promise<any> } 返回后端响应数据
 */
export async function apiRollCall<T = any>(
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
        classpk?: string | null;
        start?: string | null;
        end?: string | null;
        source_code?: string | null;
        user_code?: string
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
        endDate = null,
        classpk = null,
        start = null,
        end = null,
        source_code = null,
        user_code = null
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
            ...(classpk ? {classpk} : {}),
            ...(start ? {start} : {}),
            ...(end ? {end} : {}),
            ...(source_code ? {source_code} : {}),
            ...(user_code ? {user_code} : {}),
        }
    };

    const formData = generateInterfaceParams(payload);

    try {
        const response = await PairAPI.post('', formData);
        return response.data as T;
    } catch (error) {
        console.error('API 调用失败:', error);
        throw error;
    }
}

/**
 * 用户登录接口
 * @async
 * @function ZHKQ_LOGIN
 * @param { string } username - 学号: `2****0`
 * @param { string } password - 明文密码: `Password`
 * @param { string } deviceId - 设备ID: `UUID`
 * @returns { Promise<ZHKQ_UserInfo> } 返回登录结果数据
 */
export async function ZHKQ_LOGIN(username: string, password: string, deviceId: string): Promise<ZHKQ_UserInfo> {
    return apiCall<ZHKQ_UserInfo>("Member_Login", {
        userid: username,           // 学号
        userpwd: encrypt(password), // 加密后的密码
        client_local_id: deviceId   // 设备ID
    });
}

/**
 * 获取当天课程列表
 * @function ZHKQ_GetDayCourseList
 * @param { string } date - 日期字符串: `YYYY-MM-DD`
 * @param { string } userKey - 用户密钥: `用户Token`
 * @returns { Promise<state,ZHKQ_CourseList >} 返回当天课程列表
 */
export async function ZHKQ_GetDayCourseList(date: string, userKey: string): Promise<{
    state: string,
    sourcelist: ZHKQ_CourseList[]
}> {
    return apiCall("RollCall_SourceListDay", {
        date,
        userKey
    });
}


/**
 * 获取当天签到记录
 * @function getDaySignList
 * @param { string } date - 日期字符串: `YYYY-MM-DD`
 * @param { string } userKey - 用户密钥: `用户Token`
 * @returns { Promise<ZHKQ_SignRecord> } 返回签到记录数据
 */
export async function getDaySignList(date: string, userKey: string): Promise<{
    state: string,
    sign_record_list: ZHKQ_SignRecord[]
}> {
    return apiCall("RollCall_SourceSignList", {
        date,
        userKey
    });
}


/**
 * 课程签到接口
 * @function ZHKQ_SignIn
 * @param { ZHKQ_SignInParams } params - 签到参数对象
 * @returns { Promise<ZHKQ_SignInRespondingBody> } 返回签到结果
 */
export async function ZHKQ_SignIn(params: ZHKQ_SignInParams,): Promise<ZHKQ_SignInRespondingBody> {
    return apiCall("RollCall_SignInSource", {
        param: params
    });
}

/**
 * 课程签退参数接口定义
 *
 * @property { string } pk_anlaxy_syllabus_user - 课程用户主键
 * @property { string } phone_code - 手机识别码
 * @property { number } sign_out_type - 签退类型（0=正常，1=早退等）
 * @property { string } u_end_time - 签退时间
 * @property { string } lesson_change_list - 课程调整列表
 * @property { string } lesson_change_type - 调整类型
 * @property { number } ask_leave_num - 请假次数
 * @property { number } out_longitude - 签退经度
 * @property { number } out_latitude - 签退纬度
 * @property { string } reviewscore - 评分
 * @property { string } reviewcontent - 评价内容
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
 * @param { SignOutParams } params - 签退参数对象
 * @param { string } userKey - 用户密钥
 * @returns { Promise<any> } 返回签退结果
 */
export async function signOut(params: SignOutParams, userKey: string): Promise<any> {
    return apiCall("RollCall_SignOutSource", {
        param: params,
        userKey
    });
}

/**
 * 获取课程结束时间
 * @async
 * @function getEndTime
 * @param { string } lessonId - 课程ID
 * @param { string } userKey - 用户密钥
 * @returns { Promise<any> } 返回课程结束时间数据
 */
export async function getEndTime(lessonId: string, userKey: string): Promise<any> {
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
 * @param { string } userKey - 用户密钥
 * @returns { Promise<any> } 返回班级列表数据
 */
export async function getUserClass(userKey: string): Promise<any> {
    return apiRollCall("Member_Get_Class", {
        userKey
    });
}

/**
 * 获取班级学生列表
 *
 * @async
 * @function getClassStudent
 * @param { string } userKey - 用户密钥
 * @param { string } group_id - 班级ID
 * @returns { Promise<any> } 返回学生列表数据
 */
export async function getClassStudent(userKey: string, group_id: string): Promise<any> {
    return apiRollCall("Member_Get_Group", {
        userKey,
        group_id
    });
}

/**
 * 获取课程状态
 */
export async function getCourseStatus(userKey: string, pk_user: string, pk_class: string, type: string, startDate: string, endDate: string): Promise<any> {
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
export async function getStatusCount(userKey: string, pk_class: string, pk_lesson: string, pk_user: string, type: string, startDate: string, endDate: string): Promise<any> {
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

/**
 * 考勤状态日期查询
 */
export async function getAttendanceDates(userKey: string, classpk: string, source_code: string, user_code: string, type: string, start: string, end: string): Promise<any> {
    return apiCall("Supplement_LessonSignDetail", {
        userKey,
        classpk,
        source_code,
        user_code,
        type,
        start,
        end
    })
}

