// ******************** //
//  请求体参数接口定义文件  //
// ******************** //


// *************** [ 用户登录接口API请求体 - ZHKQ_Login ] *************** //
/**
 * 智慧考勤 | 登录API请求体参数接口定义
 * @interface ZHKQ_RequestingBody_Login
 * @property { string } userid - 学号，例如 `"123456789"`
 * @property { string } userpwd - 密码，例如 `"<PASSWORD>"`
 * @property { string } client_local_id - uuid `"uuid_****"`
 */
export interface ZHKQ_RequestingBody_Login {
    userid: string;
    userpwd: string;
    client_local_id: string;
}

// *************** [ 用户登录接口API请求体 - ZHKQ_Login ] *************** //


// *************** [ 获取当天课程列表API请求体 - ZHKQ_GetDayCourseList ] *************** //
/**
 * 智慧考勤 | 课程列表API请求体参数接口定义
 * @interface ZHKQ_RequestingBody_GetDayCourseList
 * @property { string } userKey - 用户密钥，例如 `"V0****0="`
 * @property { string } date - 日期，例如 `"YYYY-MM-DD"`
 */
export interface ZHKQ_RequestingBody_GetDayCourseList {
    userKey: string;
    date: string;
}

// *************** [ 获取当天课程列表API请求体 - ZHKQ_GetDayCourseList ] *************** //


// *************** [ 获取签到记录API请求体 - ZHKQ_GetDaySignList ] *************** //
/**
 * 智慧考勤 | 签到记录API请求体参数接口定义
 * @interface ZHKQ_RequestingBody_GetDaySignList
 * @property { string } userKey - 用户密钥，例如 `"V0****0="`
 * @property { string } date - 日期，例如 `"YYYY-MM-DD"`
 */
export interface ZHKQ_RequestingBody_GetDaySignList {
    userKey: string;
    date: string;
}

// *************** [ 获取签到记录API请求体 - ZHKQ_GetDaySignList ] *************** //


//////////////////////////////////////////////////////////////////////////////////////


// *************** [ 获取签到操作API请求 - ZHKQ_SignIn ] *************** //
/**
 * 课程签到请求体参数接口定义
 * @property { string } userKey - 用户密钥，例如 `"V0****0="`
 * @property { string } pk_anlaxy_syllabus_user - 课程用户主键，例如 `"56****AD"`
 * @property { number } sign_in_type - 签到类型，例如 `1迟到 | 2正常`
 * @property { string } u_begin_time - 签到时间，例如 `"YYYY-MM-dd HH:mm:ss"`
 * @property { number } late_time_length - 迟到时长，例如 `0`
 * @property { number } late_num - 迟到次数，例如 `0`
 * @property { number } ask_leave_num - 请假次数，例如 `0`
 * @property { number } in_longitude - 签到经度，例如 `0`
 * @property { number } in_latitude - 签到纬度，例如 `0`
 * @property { string } phone_code - 手机识别码，例如 `uuid_****,uuid_****`
 */
export interface ZHKQ_SignInParams {
    userKey: string;
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

// *************** [ 获取签到操作API请求 - ZHKQ_SignIn ] *************** //


// *************** [ 获取课程签退接口API请求 - ZHKQ_SignOut ] *************** //
/**
 * 课程签退参数接口定义
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
export interface ZHKQ_SignOutParams {
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

// *************** [ 获取课程签退接口API请求 - ZHKQ_SignOut ] *************** //