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