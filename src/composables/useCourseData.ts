import { ref } from 'vue';
import dayjs from 'dayjs';
import type { ClassInfo } from '@/components/ClassCard.vue';
import { ZHKQ_GetDayCourseList, ZHKQ_GetDaySignList } from '@/api/anlaxy';
import { getZHKQUserInfo } from '@/api/anlaxy/utils';
import type { CourseList, SignListInfo } from '@/api/anlaxy/type/response';

/**
 * 课程数据处理的Composable
 */
export function useCourseData() {
  const userInfo = getZHKQUserInfo();
  const data = ref<ClassInfo[]>([]);
  const loading = ref<boolean>(true);
  const todayString = dayjs().format('YYYY-MM-DD');

  /**
   * 根据课程与签到信息计算课程状态
   */
  function calculateStatus(
    course: CourseList,
    signData: SignListInfo
  ): '已签退' | '已签到' | '未签到' | '迟到' | '早退' | null {
    const now = dayjs();
    const startTime = dayjs(`${course.lesson_date} ${course.begin_time}`);
    const endTime = dayjs(`${course.lesson_date} ${course.end_time}`);

    const hasSignedIn = !!(signData.u_begin_time && signData.u_begin_time !== '');
    const hasSignedOut = !!(signData.u_end_time && signData.u_end_time !== '');

    const signInTime = hasSignedIn ? dayjs(signData.u_begin_time) : null;
    const signOutTime = hasSignedOut ? dayjs(signData.u_end_time) : null;

    // 缺勤或请假直接返回 null（特殊标识）
    if (signData.absent_num === '1') return null;
    if (signData.ask_leave_num === '1') return null;

    // 有签到但签到晚于上课时间 → 迟到
    if (hasSignedIn && signInTime && signInTime.isAfter(startTime)) {
      if (hasSignedOut) {
        // 若签退时间早于下课时间 → 早退
        if (signOutTime && signOutTime.isBefore(endTime)) return '早退';
        return '已签退';
      }
      return '迟到';
    }

    // 未迟到但签退时间早于下课 → 早退
    if (hasSignedOut && signOutTime && signOutTime.isBefore(endTime)) {
      return '早退';
    }

    // 正常签到签退
    if (hasSignedOut) return '已签退';
    if (hasSignedIn) return '已签到';

    // 未签到且当前时间已超过上课时间 → 迟到状态
    if (!hasSignedIn && now.isAfter(startTime)) {
      return '迟到';
    }

    // 默认情况：未签到
    return '未签到';
  }

  /**
   * 根据签到记录和课程状态进一步计算出特殊情况（旷课、请假等）
   */
  function calculateSituation(
    signData: SignListInfo,
    status: '已签退' | '已签到' | '未签到' | '迟到' | '早退' | null
  ): '早退' | '迟到' | '已旷课' | '已请假' | null {
    if (signData.absent_num === '1') return '已旷课';
    if (signData.ask_leave_num === '1') return '已请假';
    if (status === '迟到') return '迟到';
    if (status === '早退') return '早退';
    return null;
  }

  /**
   * 加载课程数据
   */
  async function loadCourseData(): Promise<void> {
    if (!userInfo.value) {
      loading.value = false;
      return;
    }

    loading.value = true;
    try {
      // 获取当天签到记录
      const signRes = await ZHKQ_GetDaySignList({
        date: todayString,
        userKey: userInfo.value.token,
      });
      const signInfo = signRes?.sign_record_list ?? [];

      // 获取当天课程列表
      const courseRes = await ZHKQ_GetDayCourseList({
        date: todayString,
        userKey: userInfo.value.token,
      });
      const courseList = courseRes?.sourcelist ?? [];

      // 将签到记录以课程主键（pk_lesson）为 key 构建 Map
      const signMap = new Map(signInfo.map((e: SignListInfo) => [e.pk_lesson, e]));

      // 遍历课程列表并匹配签到数据
      const courses = courseList
        .map((e: CourseList, index: number): ClassInfo | null => {
          const signData = signMap.get(e.pk_anlaxy_lesson);
          if (signData) {
            const status = calculateStatus(e, signData);
            return {
              classIndex: index + 1,
              className: e.lesson_name,
              startTime: dayjs(`${e.lesson_date} ${e.begin_time}`),
              endTime: dayjs(`${e.lesson_date} ${e.end_time}`),
              signInTime: signData.u_begin_time ? dayjs(signData.u_begin_time) : null,
              signOutTime: signData.u_end_time ? dayjs(signData.u_end_time) : null,
              shouldSignInTime: dayjs(`${signData.lesson_date} ${signData.before_class_time}`),
              shouldSignOutTime: dayjs(
                `${signData.lesson_date} ${signData.after_class_over_time}`
              ),
              classRoom: e.class_room_name,
              teacher: {
                name: e.teacher_name,
                id: Number.parseInt(e.teacher_id),
              },
              situation: calculateSituation(signData, status),
              computedStatus: status,
              pk_anlaxy_syllabus_user: signData.pk_anlaxy_syllabus_user,
              lessonDate: e.lesson_date,
            } as ClassInfo;
          }
          return null;
        })
        .filter((e) => !!e) as ClassInfo[];

      // 课程排序：未完成的排前面
      data.value = courses.sort((a, b) => {
        const getPriority = (course: ClassInfo) => {
          if (course.situation === '已请假' || course.situation === '已旷课') return 3;
          if (course.signInTime && course.signOutTime) return 2;
          return 1;
        };
        return getPriority(a) - getPriority(b);
      });
    } finally {
      loading.value = false;
    }
  }

  return {
    userInfo,
    data,
    loading,
    todayString,
    loadCourseData,
  };
}
