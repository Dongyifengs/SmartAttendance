// 布尔字符串类型定义
export type BoolString = "0" | "1";

// ************* [ 登录返回类型 - ZHKQ_LOGIN ] ************* //
/**
 * 智慧考勤登录接口响应体返回类型定义
 * 包含用户基础信息、组织信息、权限信息及登录令牌等内容。
 * @interface UserInfo
 * @property {string} state - 状态码，例如 `"1"` 表示成功
 * @property {string} birthday - 出生日期，例如 `"2000-01-01"`
 * @property {string} pk_group - 集团主键ID，例如 `"F7****58"`
 * @property {string} user_name - 用户姓名，例如 `"李**"`
 * @property {OrgInfo[]} orgList - 用户所属组织列表
 * @property {string} pk_user - 用户主键ID，例如 `"3B****A3"`
 * @property {string} client_id - UUID，例如 `"uuid_fc****26"`
 * @property {string} pk_org - 所属组织主键，例如 `"68****F9"`
 * @property {number} user_role - 用户角色编号，例如 `2`
 * @property {string} user_type - 用户类型，例如 `"sys_user"`
 * @property {string} group_easid - 集团 EAS ID
 * @property {string} user_code - 用户学号，例如 `"20****01"`
 * @property {string} user_phone - 用户手机号
 * @property {string} face_id - 人脸识别 ID，例如 `"d0****c0"`
 * @property {string} pk_teacher - 教师主键 ID
 * @property {string} group_name - 学校名称
 * @property {string} sex - 性别，例如 `"男"`
 * @property {number} user_auth - 用户权限等级，例如 `1`
 * @property {string} org_type - 组织类型，例如 `"0"`
 * @property {string} curryDate - 当前日期，例如 `"2020-01-01"`
 * @property {string} token - 登录令牌，例如 `"ZV****0="`
 * @property {string} user_singlekey - 用户token
 * @property {string} super_root - 是否超级管理员标识
 * @property {string} user_pic - 用户头像 URL
 * @property {string} org_lev - 组织层级，例如 `"2"`
 * @property {number} new_join - 是否新加入用户，`0` 表示否
 * @property {number} initUser - 是否初始化用户，`0` 表示否
 */
export interface UserInfo {
    state: string;
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
 * @property {string} orgName - 组织名称，例如 `"摸鱼学院"`
 * @property {string} orgPk - 组织主键 ID，例如 `"68****F9"`
 */
export interface OrgInfo {
    orgName: string;
    orgPk: string;
}

// ************* [ 登录返回类型 - ZHKQ_LOGIN ] ************* //

// ************* [ 获取课程表返回类型 - getDayCourseList ] ************* //
/**
 * 智慧考勤课程信息接口返回类型定义
 * 包含课程基本信息、教师信息、上课时间及教室等内容
 * @interface CourseList
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
export interface CourseList {
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

// ************* [ 获取课程表返回类型 - getDayCourseList ] ************* //
