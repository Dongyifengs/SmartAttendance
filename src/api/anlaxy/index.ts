import { generateInterfaceParams } from '@/api/anlaxy/utils';
import { PairAPI, RollCallAPI } from '@/api/anlaxy/endpoint';
// 响应体
import type {
  AttendanceInfo,
  BoolString,
  ClassInfo,
  CourseList,
  CourseStatusInfo,
  GroupInfo,
  SignInResponse,
  SignListInfo,
  SignOutResponse,
  UserInfo,
} from './type/response.d';
// 请求体
import type {
  GetCourseListParam,
  GetSignListParam,
  LoginParam,
  SignInParam,
  SignOutParam,
} from '@/api/anlaxy/type/requests.d';

/**
 * 通用 api 调用方法
 *
 * @async
 * @utils apiCall
 * @param { string } func - 要调用的后端接口函数名（如 "Member_Login"）
 * @param { object } [params={}] - 请求参数对象，会被放入 Param 字段
 * @returns { Promise } 返回后端响应数据
 * @throws { Error } 当请求失败时抛出异常
 */
export async function apiCall<T>(func: string, params: object = {}): Promise<T> {
  const payload = {
    CommType: 'utils',
    Comm: func,
    Param: {
      Source_PlatForm: 2,
      ...params,
    },
  };

  const formData = generateInterfaceParams(payload);

  try {
    const response = await RollCallAPI.post('', formData);
    return response.data as T;
  } catch (error) {
    console.error('api 调用失败:', error);
    throw error;
  }
}

/**
 * 通用 RollCall Pair api 调用器
 *
 * @async
 * @utils apiRollCall
 * @param { string } func - 要调用的后端函数名
 * @param { object } [params={}] - 请求参数对象，会被放入 Param 字段
 * @returns { Promise } 返回后端响应数据
 * @throws { Error } 当请求失败时抛出异常
 */
export async function apiRollCall<T>(func: string, params: object = {}): Promise<T> {
  const payload = {
    CommType: 'utils',
    Comm: func,
    Param: {
      Source_PlatForm: 2,
      ...params,
    },
  };

  const formData = generateInterfaceParams(payload);

  try {
    const response = await PairAPI.post('', formData);
    return response.data as T;
  } catch (error) {
    console.error('api 调用失败:', error);
    throw error;
  }
}

/**
 * 用户登录接口
 * @utils ZHKQ_Login
 * @param { LoginParam } param - 登录参数对象
 * @param { string } param.userid - 用户名：`学号`
 * @param { string } param.userpwd - 用户密码：`<PASSWORD>`
 * @param { string } param.client_local_id - 客户端本地ID: `uuid_****`
 * @returns { Promise<UserInfo> } 返回登录结果数据
 */
export async function ZHKQ_Login(param: LoginParam): Promise<UserInfo> {
  return apiCall('Member_Login', param);
}

/**
 * 获取当天课程列表
 * @utils ZHKQ_GetDayCourseList
 * @param { GetCourseListParam } param - 请求参数对象
 * @param { string } param.userKey - 用户密钥： `用户Token`
 * @param { string } param.date - 日期字符串：`YYYY-MM-DD`
 * @returns { Promise<state,CourseList >} 返回当天课程列表
 */
export async function ZHKQ_GetDayCourseList(param: GetCourseListParam): Promise<{
  state: BoolString;
  sourcelist: CourseList[];
}> {
  return apiCall('RollCall_SourceListDay', param);
}

/**
 * 获取当天签到记录
 * @utils ZHKQ_GetDaySignList
 * @param { GetSignListParam } param - 请求参数对象
 * @param { string } param.date - 日期字符串：`YYYY-MM-DD`
 * @param { string } param.userKey - 用户密钥： `用户Token`
 * @returns { Promise<SignListInfo> } 返回签到记录数据
 */
export async function ZHKQ_GetDaySignList(param: GetSignListParam): Promise<{
  state: BoolString;
  sign_record_list: SignListInfo[];
}> {
  return apiCall('RollCall_SourceSignList', param);
}

/**
 * 课程签到接口
 * @utils ZHKQ_SignIn
 * @param { SignInParam } params - 签到参数对象
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
 * @returns { Promise<SignInResponse> } 返回签到结果
 */
export async function ZHKQ_SignIn(params: SignInParam): Promise<SignInResponse> {
  return apiCall('RollCall_SignInSource', params);
}

/**
 * 课程签退接口
 * @utils ZHKQ_SignOut
 * @param { SignOutParam } params - 签退参数对象
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
 * @returns { Promise<SignOutResponse> } 返回签退结果
 */
export async function ZHKQ_SignOut(params: SignOutParam): Promise<SignOutResponse> {
  return apiCall('RollCall_SignOutSource', params);
}

/**
 * 获取用户班级列表
 *
 * @async
 * @utils getUserClass
 * @param { string } userKey - 用户密钥
 * @returns { Promise<any> } 返回班级列表数据
 */
export async function getUserClass(
  userKey: string
): Promise<{ state: string; class_list: ClassInfo[] }> {
  return apiRollCall('Member_Get_Class', {
    userKey,
  });
}

/**
 * 获取班级学生列表
 *
 * @async
 * @utils getClassStudent
 * @param { string } userKey - 用户密钥
 * @param { string } group_id - 班级ID
 * @returns { Promise<any> } 返回学生列表数据
 */
export async function getClassStudent(userKey: string, group_id: string): Promise<GroupInfo> {
  return apiRollCall('Member_Get_Group', {
    userKey,
    group_id,
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
): Promise<{ state: BoolString; list: CourseStatusInfo[] }> {
  return apiRollCall('Supplement_Class_Anomaly', {
    userKey,
    pk_user,
    pk_class,
    pk_lesson: '',
    type,
    startDate,
    endDate,
  });
}

/**
 * 对应次数状态信息
 */
export interface StatusCountInfo {
  /**
   * 学生姓名
   */
  user_name: string;
  /**
   * 学生头像
   */
  user_pic: string;
  /**
   * 学生ID
   */
  pk_user: string;
  /**
   * 对应状态次数
   */
  totalNum: number;
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
): Promise<{ state: BoolString; list: StatusCountInfo[] }> {
  return apiRollCall('Supplement_Lesson_User', {
    userKey,
    pk_user,
    pk_class,
    pk_lesson,
    type,
    startDate,
    endDate,
  });
}

/**
 * 考勤状态日期查询
 */
export async function getAttendanceDates(
  userKey: string,
  classpk: string,
  source_code: string,
  user_code: string,
  type: string,
  start: string,
  end: string
): Promise<{ state: BoolString; data: AttendanceInfo }> {
  return apiCall('Supplement_LessonSignDetail', {
    userKey,
    classpk,
    source_code,
    user_code,
    type,
    start,
    end,
  });
}
