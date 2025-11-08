import { ZHKQ_SignIn, ZHKQ_SignOut, ZHKQ_GetDaySignList, ZHKQ_GetDayCourseList } from '@/api/anlaxy';
import type {
  SignInParam,
  SignOutParam,
  GetSignListParam,
  GetCourseListParam,
} from '@/api/anlaxy/type/requests';
import type {
  SignInResponse,
  SignOutResponse,
  SignListInfo,
  CourseList,
  BoolString,
} from '@/api/anlaxy/type/response';
import { MOYI_UploadInfo } from '@/api/moyi';

/**
 * 用于签到签退操作的组合式函数
 * 处理课程签到、签退和记录查询，并记录操作日志
 */
export function useAttendance() {
  /**
   * 执行签到操作
   */
  async function signIn(params: SignInParam, gitHash?: string): Promise<SignInResponse> {
    const result = await ZHKQ_SignIn(params);

    // 如果提供了 gitHash，则记录到 MOYI API
    if (gitHash) {
      try {
        await MOYI_UploadInfo(
          '课程签到',
          'ZHKQ_SignIn',
          params.userKey,
          JSON.stringify(result),
          gitHash,
          `签到类型: ${params.sign_in_type}, 时间: ${params.u_begin_time}`
        );
      } catch (error) {
        console.error('[signIn] MOYI_UploadInfo 错误:', error);
      }
    }

    return result;
  }

  /**
   * 执行签退操作
   */
  async function signOut(params: SignOutParam, gitHash?: string): Promise<SignOutResponse> {
    const result = await ZHKQ_SignOut(params);

    // 如果提供了 gitHash，则记录到 MOYI API
    if (gitHash) {
      try {
        await MOYI_UploadInfo(
          '课程签退',
          'ZHKQ_SignOut',
          params.userKey,
          JSON.stringify(result),
          gitHash,
          `签退类型: ${params.sign_out_type}, 时间: ${params.u_end_time}`
        );
      } catch (error) {
        console.error('[signOut] MOYI_UploadInfo 错误:', error);
      }
    }

    return result;
  }

  /**
   * 获取当天签到记录
   */
  async function getDaySignList(
    params: GetSignListParam,
    gitHash?: string
  ): Promise<{
    state: BoolString;
    sign_record_list: SignListInfo[];
  }> {
    const result = await ZHKQ_GetDaySignList(params);

    // 如果提供了 gitHash，则记录到 MOYI API
    if (gitHash) {
      try {
        await MOYI_UploadInfo(
          '获取签到记录',
          'ZHKQ_GetDaySignList',
          params.userKey,
          JSON.stringify(result),
          gitHash,
          `日期: ${params.date}, 记录数: ${result.sign_record_list?.length || 0}`
        );
      } catch (error) {
        console.error('[getDaySignList] MOYI_UploadInfo 错误:', error);
      }
    }

    return result;
  }

  /**
   * 获取当天课程列表
   */
  async function getDayCourseList(
    params: GetCourseListParam,
    gitHash?: string
  ): Promise<{
    state: BoolString;
    sourcelist: CourseList[];
  }> {
    const result = await ZHKQ_GetDayCourseList(params);

    // 如果提供了 gitHash，则记录到 MOYI API
    if (gitHash) {
      try {
        await MOYI_UploadInfo(
          '获取课程列表',
          'ZHKQ_GetDayCourseList',
          params.userKey,
          JSON.stringify(result),
          gitHash,
          `日期: ${params.date}, 课程数: ${result.sourcelist?.length || 0}`
        );
      } catch (error) {
        console.error('[getDayCourseList] MOYI_UploadInfo 错误:', error);
      }
    }

    return result;
  }

  return {
    signIn,
    signOut,
    getDaySignList,
    getDayCourseList,
  };
}
