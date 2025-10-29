// ******************** //
//  响应体参数接口定义文件  //
// ******************** //


// *************** [ 用户登录接口API响应体 - ZHKQ_LOGIN ] *************** //
/**
 * 智慧考勤登录接口响应体返回类型定义
 * 包含用户基础信息、组织信息、权限信息及登录令牌等内容。
 * @interface ZHKQ_RespondingBodyUserInfo
 * @property { string } state - 状态码，例如 `"1"` 表示成功
 * @property { string } info - 错误信息，例如 `服务端错误`
 * @property { string } birthday - 出生日期，例如 `"2000-01-01"`
 * @property { string } pk_group - 集团主键ID，例如 `"F7****58"`
 * @property { string } user_name - 用户姓名，例如 `"李**"`
 * @property { OrgInfo[] } orgList - 用户所属组织列表
 * @property { string } pk_user - 用户主键ID，例如 `"3B****A3"`
 * @property { string } client_id - UUID，例如 `"uuid_fc****26"`
 * @property { string } pk_org - 所属组织主键，例如 `"68****F9"`
 * @property { number } user_role - 用户角色编号，例如 `2`
 * @property { string } user_type - 用户类型，例如 `"sys_user"`
 * @property { string } group_easid - 集团 EAS ID
 * @property { string } user_code - 用户学号，例如 `"20****01"`
 * @property { string } user_phone - 用户手机号
 * @property { string } face_id - 人脸识别 ID，例如 `"d0****c0"`
 * @property { string } pk_teacher - 教师主键 ID
 * @property { string } group_name - 学校名称
 * @property { string } sex - 性别，例如 `"男"`
 * @property { number } user_auth - 用户权限等级，例如 `1`
 * @property { string } org_type - 组织类型，例如 `"0"`
 * @property { string } curryDate - 当前日期，例如 `"2020-01-01"`
 * @property { string } token - 登录令牌，例如 `"ZV****0="`
 * @property { string } user_singlekey - 用户token
 * @property { string } super_root - 是否超级管理员标识
 * @property { string } user_pic - 用户头像 URL
 * @property { string } org_lev - 组织层级，例如 `"2"`
 * @property { number } new_join - 是否新加入用户，`0` 表示否
 * @property { number } initUser - 是否初始化用户，`0` 表示否
 */
export interface ZHKQ_RespondingBodyUserInfo {
    state: string;
    info?: string;
    birthday: string;
    pk_group: string;
    user_name: string;
    orgList: OrgInfo[];
    pk_user: string;
    client_id: string;
    pk_org: string;
    user_role: number;
    user_type: string;
    group_easid: string;
    user_code: string;
    user_phone: string;
    face_id: string;
    pk_teacher: string;
    group_name: string;
    sex: string;
    user_auth: number;
    org_type: string;
    curryDate: string;
    token: string;
    user_singlekey: string;
    super_root: string;
    user_pic: string;
    org_lev: string;
    new_join: number;
    initUser: number;
}

/**
 * 组织信息
 * @interface OrgInfo
 * @property { string } orgName - 组织名称，例如 `"摸鱼学院"`
 * @property { string } orgPk - 组织主键 ID，例如 `"68****F9"`
 */
export interface OrgInfo {
    orgName: string;
    orgPk: string;
}

// *************** [ 用户登录接口API响应体 - ZHKQ_LOGIN ] *************** //


// *************** [ 课程列表API响应体 - ZHKQ_GetDayCourseList ] *************** //
/**
 * 智慧考勤课程信息接口返回类型定义
 * 包含课程基本信息、教师信息、上课时间及教室等内容
 * @interface ZHKQ_RespondingBodyCourseList
 * @property { number } lesson_type - 课程类型，例如 `0` 表示必修，`1` 表示选修
 * @property { string } lesson_date - 上课日期，例如 `"2020-01-01"`
 * @property { number } selective - 是否选修，例如 `0` 表示否，`1` 表示是
 * @property { number } week_num - 学期周数，例如 `8`
 * @property { number } week_item - 一周中的第几天，例如 `4` 表示周四
 * @property { string } week_name - 星期名称，例如 `"周四"`
 * @property { string } begin_time - 课程开始时间，例如 `"08:00"`
 * @property { string } end_time - 课程结束时间，例如 `"09:40"`
 * @property { number } section_num - 节次编号，例如 `10`
 * @property { string } pk_anlaxy_semester - 学期主键ID，例如 `"92****D6"`
 * @property { string } pk_anlaxy_organize - 组织主键ID，例如 `"C0****AF"`
 * @property { string } pk_group - 班级/分组主键ID，例如 `"F7****58"`
 * @property { string } pk_anlaxy_timezone - 时区主键ID，例如 `"57****22"`
 * @property { string } campus - 校区ID，例如 `"C0****AF"`
 * @property { string } lesson_name - 课程名称，例如 `"高等数学"`
 * @property { string } pk_anlaxy_lesson - 课程主键ID，例如 `"F0****B6"`
 * @property { string } teacher_id - 教师工号，例如 `"2****0"`
 * @property { string } teacher_name - 教师姓名，例如 `"李**"`
 * @property { string } pk_teacher - 教师主键ID，例如 `"01****65"`
 * @property { string } class_room_name - 教室名称，例如 `"提瓦特"`
 * @property { string } pk_anlaxy_classroom - 教室主键ID，例如 `"AA****B0"`
 * @property { string } pk_anlaxy_syllabus - 教学大纲主键ID，例如 `"FE****A0"`
 * @property { number } max_count - 最大上课人数，例如 `0` 表示不限
 * @property { string } cur_count - 当前已选人数，例如 `"0"`
 */
export interface ZHKQ_RespondingBodyCourseList {
    lesson_type: number;
    lesson_date: string;
    selective: number;
    week_num: number;
    week_item: number;
    week_name: string;
    begin_time: string;
    end_time: string;
    section_num: number;
    pk_anlaxy_semester: string;
    pk_anlaxy_organize: string;
    pk_group: string;
    pk_anlaxy_timezone: string;
    campus: string;
    lesson_name: string;
    pk_anlaxy_lesson: string;
    teacher_id: string;
    teacher_name: string;
    pk_teacher: string;
    class_room_name: string;
    pk_anlaxy_classroom: string;
    pk_anlaxy_syllabus: string;
    max_count: number;
    cur_count: string;
}


// *************** [ 课程列表API响应体 - ZHKQ_GetDayCourseList ] *************** //


//////////////////////////////////////////////////////////////////////////////////////


// *************** [ 获取课程列表API返回 - ZHKQ_GetDayCourseList ] *************** //


// *************** [ 获取课程列表API返回 - ZHKQ_GetDayCourseList ] *************** //


// *************** [ 获取签到记录API返回 - ZHKQ_GetDaySignList ] *************** //
export type BoolString = "0" | "1";

/**
 * 智慧考勤签到记录接口返回类型定义
 * 包含单个用户的课程签到信息、上课时间、请假/迟到/缺勤状态及教师信息等
 * @interface ZHKQ_SignRecord
 * @property { number } lesson_type - 课程类型，例如 `0` 表示必修，`1` 表示选修
 * @property { string } pk_anlaxy_syllabus_user - 课程用户表主键ID，例如 `"3A****4A6"`
 * @property { string } lesson_date - 上课日期，例如 `"2020-01-01"`
 * @property { string } user_id - 用户ID，例如 `"2****6"`
 * @property { string } user_name - 用户姓名，例如 `"李****"`
 * @property { string } before_class_time - 课前时间，例如 `"07:50"`
 * @property { string } begin_time - 课程开始时间，例如 `"08:00"`
 * @property { string } after_class_time - 课后时间，例如 `"08:00"`
 * @property { string } u_begin_time - 用户实际开始上课时间，例如 `""`（未签到）
 * @property { string } before_class_over_time - 课程结束前时间，例如 `"09:40"`
 * @property { string } end_time - 课程结束时间，例如 `"09:40"`
 * @property { string } after_class_over_time - 课程结束后时间，例如 `"09:50"`
 * @property { string } u_end_time - 用户实际下课时间，例如 `""`（未签到）
 * @property { number } late_time_length - 迟到时长（分钟），例如 `0`
 * @property { number } leave_ago_time_length - 早退时长（分钟），例如 `0`
 * @property { BoolString } absent_num - 是否缺勤，例如 `1` 表示缺勤，`0` 表示正常
 * @property { BoolString } late_num - 是否迟到，例如 `0` 表示未迟到
 * @property { BoolString } leave_num - 是否早退，例如 `0` 表示未早退
 * @property { BoolString } ask_leave_num - 是否请假，例如 `0` 表示未请假
 * @property { number } ok_num - 正常出勤数量，例如 `0`
 * @property { number } get_num - 实到人数，例如 `0`
 * @property { number } user_num - 用户总数，例如 `1`
 * @property { number } section_num - 节次编号，例如 `10`
 * @property { number } syllabus_status - 教学大纲状态，例如 `0`
 * @property { string } uuid - 唯一标识符，例如 `"FD****25"`
 * @property { string } srv_data - 服务器相关数据，例如 `"C3:****:CE"`
 * @property { string } mac - 设备 MAC 地址，例如 `"c3:****:ce"`
 * @property { number } reviewscore - 教师评分，例如 `0`
 * @property { string } reviewcontent - 教师评价内容，例如 `""`
 * @property { string } pk_user - 用户主键ID，例如 `"3B****A3"`
 * @property { string } pk_class - 班级主键ID，例如 `"05****0A"`
 * @property { string } pk_lesson - 课程主键ID，例如 `"F0****B6"`
 * @property { string } pk_teacher - 教师主键ID，例如 `"01****65"`
 * @property { string } pk_class_room - 教室主键ID，例如 `"AA****B0"`
 * @property { string } campus - 校区ID，例如 `"C0****AF"`
 * @property { string } pk_anlaxy_syllabus - 教学大纲主键ID，例如 `"FE****A0"`
 * @property { string } teacher_pic - 教师头像URL，例如 `""`
 */
export interface ZHKQ_SignRecord {
    lesson_type: number;
    pk_anlaxy_syllabus_user: string;
    lesson_date: string;
    user_id: string;
    user_name: string;
    before_class_time: string;
    begin_time: string;
    after_class_time: string;
    u_begin_time: string;
    before_class_over_time: string;
    end_time: string;
    after_class_over_time: string;
    u_end_time: string;
    late_time_length: number;
    leave_ago_time_length: number;
    absent_num: BoolString;
    late_num: BoolString;
    leave_num: BoolString;
    ask_leave_num: BoolString;
    ok_num: number;
    get_num: number;
    user_num: number;
    section_num: number;
    syllabus_status: number;
    uuid: string;
    srv_data: string;
    mac: string;
    reviewscore: number;
    reviewcontent: string;
    pk_user: string;
    pk_class: string;
    pk_lesson: string;
    pk_teacher: string;
    pk_class_room: string;
    campus: string;
    pk_anlaxy_syllabus: string;
    teacher_pic: string;
}

// *************** [ 获取签到记录API返回 - ZHKQ_GetDaySignList ] *************** //


// *************** [ 获取签到操作API返回 - ZHKQ_SignIn ] *************** //
/**
 * 课程签到响应体返回
 * @interface ZHKQ_SignInRespondingBody
 * @property { string } state - 状态码，例如`"1"`
 * @property { number } sign_coin - 签名码，例如`0`
 * @property { number } sing_result - 签到结果，例如`0`
 * @property { string } source_code - 课程主键，例如`"56****AD"`
 */

export interface ZHKQ_SignInRespondingBody {
    state: string;
    sign_coin: number;
    sing_result: number;
    source_code: string;
}

// *************** [ 获取签到操作API返回 - ZHKQ_SignIn ] *************** //


// *************** [ 课程签退接口API返回 - ZHKQ_SignOut ] *************** //
/**
 * 课程签退接口API返回
 * @interface ZHKQ_SignOutRespondingBody
 * @property { string } state - 状态码，例如`"1"`
 * @property { number } sign_coin - 签名码，例如`0`
 * @property { number } sing_result - 签到结果，例如`0`
 * @property { string } source_code - 课程主键，例如`"56****AD"`
 */

export interface ZHKQ_SignOutRespondingBody {
    state: string;
    sign_coin: number;
    sing_result: number;
    source_code: string;
}

// *************** [ 课程签退接口API返回 - ZHKQ_SignOut ] *************** //