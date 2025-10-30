import {generateInterfaceParams} from './Function/Function'
import {PairAPI, RollCallAPI} from './APIStarter/APIStarter';
import type {AxiosInstance} from 'axios';
// 响应体
import type {
    ZHKQ_RespondingBody_CourseList,
    ZHKQ_RespondingBody_GetDaySignList,
    ZHKQ_RespondingBody_SignIn,
    ZHKQ_RespondingBody_SignOut,
    ZHKQ_RespondingBody_UserInfo,
} from './type/RespondingBody'
// 请求体
import type {
    ZHKQ_RequestingBody_GetDayCourseList,
    ZHKQ_RequestingBody_GetDaySignList,
    ZHKQ_RequestingBody_Login,
    ZHKQ_RequestingBody_SignInParams,
    ZHKQ_RequestingBody_SignOutParams
} from "@/API/zhkqAPI/type/RequestingBody.ts";

/**
 * API 参数类型定义
 */
type ApiOptions = {
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
};

/**
 * 过滤掉 null 和 undefined 的辅助函数
 * @param obj - 要过滤的对象
 * @returns 过滤后的对象
 */
function filterNullish<T extends Record<string, any>>(obj: T): Record<string, any> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value != null) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, any>);
}

/**
 * 通用 API 调用核心方法
 * @param apiInstance - Axios 实例
 * @param func - 要调用的后端接口函数名
 * @param options - 可选参数配置
 * @returns 返回后端响应数据
 */
async function baseApiCall<T = any>(
    apiInstance: AxiosInstance,
    func: string,
    options: ApiOptions = {}
): Promise<T> {
    const { param = {}, ...restOptions } = options;

    // 构建 Param 对象，只包含非空值
    const filteredParams = filterNullish(restOptions);

    const payload: Record<string, any> = {
        CommType: "function",
        Comm: func,
        Param: {
            ...param,
            Source_PlatForm: 2,
            ...filteredParams
        }
    };

    const formData = generateInterfaceParams(payload);

    try {
        const response = await apiInstance.post('', formData);
        return response.data as T;
    } catch (error) {
        console.error('API 调用失败:', error);
        throw error;
    }
}

/**
 * 通用 API 调用方法（增强版）
 *
 * @async
 * @function apiCall
 * @param { string } func - 要调用的后端接口函数名（如 "Member_Login"）
 * @param { ApiOptions } [options={}] - 可选参数配置
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
    options: ApiOptions = {}
): Promise<T> {
    return baseApiCall<T>(RollCallAPI, func, options);
}

/**
 * 通用 RollCall Pair API 调用器
 *
 * @async
 * @function apiRollCall
 * @param { string } func - 要调用的后端函数名
 * @param { ApiOptions } [options={}] - 参数对象
 * @param { Record<string, any> } [options.param=null] - 自定义参数对象
 * @param { string|null } [options.userKey=null] - 用户密钥
 * @param { string|null } [options.group_id=null] - 班级/分组 ID
 * @returns { Promise<any> } 返回后端响应数据
 */
export async function apiRollCall<T = any>(
    func: string,
    options: ApiOptions = {}
): Promise<T> {
    return baseApiCall<T>(PairAPI, func, options);
}

/**
 * 用户登录接口
 * @function ZHKQ_Login
 * @param { ZHKQ_RequestingBody_Login } param - 登录参数对象
 * @param { string } param.userid - 用户名：`学号`
 * @param { string } param.userpwd - 用户密码：`<PASSWORD>`
 * @param { string } param.client_local_id - 客户端本地ID: `uuid_****`
 * @returns { Promise<ZHKQ_RespondingBody_UserInfo> } 返回登录结果数据
 */
export async function ZHKQ_Login(param: ZHKQ_RequestingBody_Login): Promise<ZHKQ_RespondingBody_UserInfo> {
    return apiCall("Member_Login", {
        param
    });
}

/**
 * 获取当天课程列表
 * @function ZHKQ_GetDayCourseList
 * @param { ZHKQ_RequestingBody_GetDayCourseList } param - 请求参数对象
 * @param { string } param.userKey - 用户密钥： `用户Token`
 * @param { string } param.date - 日期字符串：`YYYY-MM-DD`
 * @returns { Promise<state,ZHKQ_RespondingBody_CourseList >} 返回当天课程列表
 */
export async function ZHKQ_GetDayCourseList(param: ZHKQ_RequestingBody_GetDayCourseList): Promise<{
    state: string,
    sourcelist: ZHKQ_RespondingBody_CourseList[]
}> {
    return apiCall("RollCall_SourceListDay", {
        param
    });
}


/**
 * 获取当天签到记录
 * @function ZHKQ_GetDaySignList
 * @param { ZHKQ_RequestingBody_GetDaySignList } param - 请求参数对象
 * @param { string } param.date - 日期字符串：`YYYY-MM-DD`
 * @param { string } param.userKey - 用户密钥： `用户Token`
 * @returns { Promise<ZHKQ_RespondingBody_GetDaySignList> } 返回签到记录数据
 */
export async function ZHKQ_GetDaySignList(param: ZHKQ_RequestingBody_GetDaySignList): Promise<{
    state: string,
    sign_record_list: ZHKQ_RespondingBody_GetDaySignList[]
}> {
    return apiCall("RollCall_SourceSignList", {
        param
    });
}


/**
 * 课程签到接口
 * @function ZHKQ_SignIn
 * @param { ZHKQ_RequestingBody_SignInParams } params - 签到参数对象
 * @param { string } params.userKey - 用户密钥，例如 `"V0****0="`
 * @param { string } params.pk_anlaxy_syllabus_user - 课程用户主键，例如 `"56****AD"`
 * @param { string } params.sign_in_type - 签到类型，例如 `1迟到 | 2正常`
 * @param { string } params.u_begin_time - 签到时间，例如 `"YYYY-MM-dd HH:mm:ss"`
 * @param { string } params.late_time_length - 迟到时长，默认 `0`
 * @param { string } params.late_num - 迟到次数，默认 `0`
 * @param { string } params.ask_leave_num - 请假次数，默认 `0`
 * @param { string } params.in_longitude - 签到经度，默认 `0`
 * @param { string } params.in_latitude - 签到纬度，默认 `0`
 * @param { string } params.phone_code - 手机识别码，例如 `uuid_****,uuid_****`
 * @returns { Promise<ZHKQ_RespondingBody_SignIn> } 返回签到结果
 */
export async function ZHKQ_SignIn(params: ZHKQ_RequestingBody_SignInParams,): Promise<ZHKQ_RespondingBody_SignIn> {
    return apiCall("RollCall_SignInSource", {
        param: params
    });
}


/**
 * 课程签退接口
 * @function ZHKQ_SignOut
 * @param { ZHKQ_RequestingBody_SignOutParams } params - 签退参数对象
 * @param { string } params.userKey - 用户密钥，例如 `"V0****0="`
 * @param { string } params.pk_anlaxy_syllabus_user - 课程用户主键，例如 `"56****AD"`
 * @param { string } params.phone_code - 手机识别码，例如 `uuid_****,uuid_****`
 * @param { string } params.sign_out_type - 签退类型，例如 `1迟到 | 2正常`
 * @param { string } params.u_end_time - 签退时间，例如 `"HH:mm"`
 * @param { string } params.lesson_change_list - 课程变更列表，默认 `"DA****AD"`
 * @param { string } params.lesson_change_type - 课程变更类型，默认 `0`
 * @param { string } params.ask_leave_num - 请假次数，默认 `0`
 * @param { string } params.out_longitude - 签退经度，默认 `0`
 * @param { string } params.out_latitude - 签退纬度，默认  `0`
 * @param { string } params.in_longitude - 签到经度，默认 `""`
 * @param { string } params.in_latitude - 签到纬度，默认 `""`
 * @param { string } params.reviewscore - 课程评分，默认 `10`
 * @param { string } params.reviewcontent - 课程评价内容，默认 `""`
 * @param { string } params.sign_in_type - 签到类型，默认 `"2"`
 * @param { Date } params.u_begin_time - 签到时间，例如 `"YYYY-MM-dd HH:mm:ss"`
 * @param { string } params.before_class_over_time - 课前结束时间，例如 `"HH:mm"`
 * @param { string } params.late_time_length - 迟到时长，默认 `0`
 * @param { string } params.late_num - 迟到次数，默认 `0`
 *
 * @returns { Promise<ZHKQ_RespondingBody_SignOut> } 返回签退结果
 */
export async function ZHKQ_SignOut(params: ZHKQ_RequestingBody_SignOutParams): Promise<ZHKQ_RespondingBody_SignOut> {
    return apiCall("RollCall_SignOutSource", {
        param: params
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

