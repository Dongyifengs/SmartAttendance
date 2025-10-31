<template>
  <div class="attendance-page">
    <div class="header">
      <el-text>AttendanceDev - 考勤查询页面</el-text>
      <el-button class="ml-2" type="default" @click="$router.back()">返回上一页</el-button>
    </div>

    <div class="user-info">
      <el-text>当前用户班级：{{ userClass || '加载中...' }}</el-text>
      <br />
      <el-text>当前用户班级ID：{{ userClassID || '加载中...' }}</el-text>
      <br />
    </div>

    <!-- 日期选择 -->
    <div class="mt-3">
      <el-date-picker
        v-model="dateRange"
        end-placeholder="结束日期"
        format="YYYY-MM-DD"
        range-separator="至"
        start-placeholder="开始日期"
        type="daterange"
      ></el-date-picker>
      <el-button class="ml-2" type="primary" @click="refreshCourses">查询</el-button>
    </div>

    <!-- 控制显示按钮 -->
    <el-button
      v-if="students.length > 4"
      class="mt-3 mb-2"
      size="small"
      type="primary"
      @click="toggleShowAll"
    >
      {{ showAll ? '收起' : '显示全部' }}
    </el-button>

    <!-- 学生信息表格 -->
    <el-table
      v-if="students.length"
      :data="displayedStudents"
      border
      size="small"
      stripe
      style="width: 100%"
    >
      <el-table-column label="学号" prop="user_code" width="120" />
      <el-table-column label="姓名" prop="user_name" width="100" />
      <el-table-column label="EAS ID" min-width="200" prop="easid" />
      <el-table-column label="UserPK" min-width="200" prop="userpk" />
      <el-table-column
        :formatter="formatFriendStatus"
        label="是否好友"
        prop="is_friends"
        width="100"
      />
      <el-table-column label="性别" prop="sex" width="80" />
    </el-table>

    <el-empty v-else class="mt-5" description="暂无学生信息" />

    <!-- 课程状态表格 -->
    <div class="mt-5">
      <!-- 上方：正常、旷课、请假 -->
      <div v-for="type in ['1', '4', '5']" :key="type" class="course-table">
        <div>{{ attendanceTypeMap[type] }}课程：</div>
        <el-table
          v-if="coursesByType[type].length"
          :data="coursesByType[type]"
          border
          size="small"
          stripe
          style="width: 100%; margin-top: 5px"
        >
          <el-table-column label="课程名称" min-width="200" prop="lesson_name" />
          <el-table-column label="教师名称" min-width="150" prop="teacher_name" />
          <el-table-column label="考勤状态" prop="status" width="100" />
          <el-table-column label="次数" prop="totalNum" width="80" />
          <el-table-column label="日期" min-width="220" prop="recordDates" />
        </el-table>
        <el-empty v-else class="mt-2" description="暂无课程" />
      </div>

      <!-- 下方：迟到、早退 -->
      <div v-for="type in ['2', '3']" :key="type" class="course-table">
        <div>{{ attendanceTypeMap[type] }}课程：</div>
        <el-table
          v-if="coursesByType[type].length"
          :data="coursesByType[type]"
          border
          size="small"
          stripe
          style="width: 100%; margin-top: 5px"
        >
          <el-table-column label="课程名称" min-width="200" prop="lesson_name" />
          <el-table-column label="教师名称" min-width="150" prop="teacher_name" />
          <el-table-column label="考勤状态" prop="status" width="100" />
          <el-table-column label="次数" prop="totalNum" width="80" />
          <el-table-column label="日期" min-width="220" prop="recordDates" />
        </el-table>
        <el-empty v-else class="mt-2" description="暂无课程" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import {
    getAttendanceDates,
    getClassStudent,
    getCourseStatus,
    getStatusCount,
    getUserClass,
  } from '@/api/anlaxy';

  interface Student {
    user_code: string;
    user_name: string;
    easid: string;
    userpk: string;
    is_friends: number;
    sex: string;
  }

  interface Course {
    lesson_name: string;
    teacher_name: string;
    status: string;
    totalNum: number;
    pk_lesson: string;
    recordDates?: string; // 新增字段
  }

  const userClass = ref<string>('');
  const userClassID = ref<string>('');
  const students = ref<Student[]>([]);
  const showAll = ref(false);

  // 课程按状态分类存储
  const coursesByType = ref<Record<string, Course[]>>({
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
  });

  // 考勤类型映射
  const attendanceTypeMap: Record<string, string> = {
    '1': '正常',
    '2': '迟到',
    '3': '早退',
    '4': '旷课',
    '5': '请假',
  };

  // 日期范围
  const dateRange = ref<[string, string]>(['2020-01-01', dayjs().format('YYYY-MM-DD')]);

  // 获取用户 Token
  const getUserToken = (): string => {
    try {
      const info = localStorage.getItem('SA-ZHKQ-USERINFO');
      return info ? JSON.parse(info).token || '' : '';
    } catch {
      return '';
    }
  };

  // 获取PK_USER
  const getUserPk = (): string => {
    try {
      const info = localStorage.getItem('SA-ZHKQ-USERINFO');
      return info ? JSON.parse(info).pk_user || '' : '';
    } catch {
      return '';
    }
  };

  // 是否好友格式化
  const formatFriendStatus = (_: unknown, __: unknown, cellValue: number) =>
    cellValue === 1 ? '是' : '否';

  // 切换展示模式
  const toggleShowAll = () => (showAll.value = !showAll.value);

  // 控制显示的学生（展示前2个与后2个）
  const displayedStudents = computed(() => {
    const list = students.value;
    if (showAll.value || list.length <= 4) return list;
    return [...list.slice(0, 2), ...list.slice(-2)];
  });

  // 加载班级与学生信息
  const loadUserClassAndStudents = async () => {
    const token = getUserToken();
    if (!token) return;

    try {
      const classRes = await getUserClass(token);
      const classInfo = classRes.class_list?.[0];
      if (!classInfo) return;

      userClass.value = classInfo.class_name;
      userClassID.value = classInfo.class_id;

      const studentRes = await getClassStudent(token, classInfo.class_id);
      students.value = studentRes.group_members || [];
    } catch (err) {
      console.error('加载班级或学生失败', err);
    }
  };

  // 获取指定考勤类型的课程及次数（并行获取次数和日期）
  const getCoursesByType = async (type: string) => {
    try {
      const token = getUserToken();
      const pkUser = getUserPk();
      if (!token || !pkUser || !userClassID.value) return;

      const res = await getCourseStatus(
        token,
        pkUser,
        userClassID.value,
        type,
        dateRange.value[0],
        dateRange.value[1]
      );

      if (res.list && Array.isArray(res.list)) {
        coursesByType.value[type] = await Promise.all(
          res.list.map(async (c) => {
            let totalNum = 0;
            let recordDates = '';

            try {
              const countRes = await getStatusCount(
                token,
                userClassID.value,
                c.pk_lesson,
                pkUser,
                type,
                dateRange.value[0],
                dateRange.value[1]
              );
              totalNum = countRes.list?.[0]?.totalNum || 0;

              // 🔹 新增：获取日期详情
              const detailRes = await getAttendanceDates(
                token,
                userClassID.value,
                c.pk_lesson,
                pkUser,
                type,
                dateRange.value[0],
                dateRange.value[1]
              );

              if (detailRes.state === '1' && detailRes.data?.record_list?.length) {
                recordDates = detailRes.data.record_list.map((r) => r.record_date).join('、');
              }
            } catch (err) {
              console.error(`获取课程 ${c.lesson_name} 考勤详情失败`, err);
            }

            return {
              lesson_name: c.lesson_name,
              teacher_name: c.teacher_name,
              status: attendanceTypeMap[type] || '未知',
              totalNum,
              pk_lesson: c.pk_lesson,
              recordDates,
            };
          })
        );
      }
    } catch (err) {
      console.error(`获取${attendanceTypeMap[type]}课程失败`, err);
    }
  };

  // 刷新课程数据（用于日期选择器查询）
  const refreshCourses = async () => {
    for (const type of ['1', '2', '3', '4', '5']) {
      await getCoursesByType(type);
    }
  };

  onMounted(async () => {
    await loadUserClassAndStudents();
    await refreshCourses();
  });
</script>

<style scoped>
  .attendance-page {
    padding: 20px;
    font-size: 14px;
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .user-info {
    margin-top: 10px;
    margin-bottom: 15px;
  }

  .ml-2 {
    margin-left: 10px;
  }

  .mt-3 {
    margin-top: 10px;
  }

  .mb-2 {
    margin-bottom: 10px;
  }

  .mt-5 {
    margin-top: 40px;
  }

  .course-table {
    margin-top: 20px;
  }
</style>
