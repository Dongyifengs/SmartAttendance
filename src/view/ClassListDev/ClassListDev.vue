<template>
  <div>
    <el-date-picker
      v-model="selectedDate"
      type="date"
      placeholder="选择日期"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      style="margin-right: 10px"
    />

    <el-button type="primary" @click="fetchDataByDate">获取课程与签到信息</el-button>

    <!-- 今日课程表 -->
    <el-table v-if="todayCourseList.length" :data="todayCourseList" border stripe style="margin-top: 20px; width: 100%">
      <el-table-column prop="lesson_type" label="课程类型" width="100"/>
      <el-table-column prop="lesson_date" label="课程日期" width="100"/>
      <el-table-column prop="selective" label="是否选修" width="100"/>
      <el-table-column prop="week_num" label="周次" width="100"/>
      <el-table-column prop="week_item" label="星期序号" width="100"/>
      <el-table-column prop="week_name" label="星期" width="100"/>
      <el-table-column prop="begin_time" label="开始时间" width="100"/>
      <el-table-column prop="end_time" label="结束时间" width="100"/>
      <el-table-column prop="section_num" label="节次" width="100"/>
      <el-table-column prop="pk_anlaxy_semester" label="学期ID" width="100"/>
      <el-table-column prop="pk_anlaxy_organize" label="组织机构ID" width="100"/>
      <el-table-column prop="pk_group" label="班级ID" width="100"/>
      <el-table-column prop="pk_anlaxy_timezone" label="时区ID" width="100"/>
      <el-table-column prop="campus" label="校区" width="100"/>
      <el-table-column prop="lesson_name" label="课程名称" width="100"/>
      <el-table-column prop="pk_anlaxy_lesson" label="课程ID" width="100"/>
      <el-table-column prop="teacher_id" label="教师工号" width="100"/>
      <el-table-column prop="teacher_name" label="教师姓名" width="100"/>
      <el-table-column prop="pk_teacher" label="教师ID" width="100"/>
      <el-table-column prop="class_room_name" label="教室名称" width="100"/>
      <el-table-column prop="pk_anlaxy_classroom" label="教室ID" width="100"/>
      <el-table-column prop="pk_anlaxy_syllabus" label="教学大纲ID" width="100"/>
      <el-table-column prop="max_count" label="最大容量" width="100"/>
      <el-table-column prop="cur_count" label="当前人数" width="100"/>
    </el-table>
    <el-empty v-else description="暂无课程信息"/>

    <!-- 签到信息表 -->
    <el-table v-if="checkInRecords.length" :data="checkInRecords" border stripe style="margin-top: 20px; width: 100%">
      <el-table-column prop="lesson_type" label="课程类型" width="100"/>
      <el-table-column prop="pk_anlaxy_syllabus_user" label="教学安排用户主键" width="100"/>
      <el-table-column prop="lesson_date" label="上课日期" width="100"/>
      <el-table-column prop="user_id" label="用户ID" width="100"/>
      <el-table-column prop="user_name" label="学生姓名" width="100"/>
      <el-table-column prop="before_class_time" label="课前签到时间" width="100"/>
      <el-table-column prop="begin_time" label="上课开始时间" width="100"/>
      <el-table-column prop="after_class_time" label="课后签到时间" width="100"/>
      <el-table-column prop="u_begin_time" label="用户上课时间" width="100"/>
      <el-table-column prop="before_class_over_time" label="课前结束时间" width="100"/>
      <el-table-column prop="end_time" label="下课时间" width="100"/>
      <el-table-column prop="after_class_over_time" label="课后结束时间" width="100"/>
      <el-table-column prop="u_end_time" label="用户下课时间" width="100"/>
      <el-table-column prop="late_time_length" label="迟到时长(分钟)" width="100"/>
      <el-table-column prop="leave_ago_time_length" label="早退时长(分钟)" width="100"/>
      <el-table-column prop="absent_num" label="缺勤次数" width="100"/>
      <el-table-column prop="late_num" label="迟到次数" width="100"/>
      <el-table-column prop="leave_num" label="早退次数" width="100"/>
      <el-table-column prop="ask_leave_num" label="请假次数" width="100"/>
      <el-table-column prop="ok_num" label="正常出勤次数" width="100"/>
      <el-table-column prop="get_num" label="签到次数" width="100"/>
      <el-table-column prop="user_num" label="学生人数" width="100"/>
      <el-table-column prop="section_num" label="节次编号" width="100"/>
      <el-table-column prop="syllabus_status" label="课程状态" width="100"/>
      <el-table-column prop="uuid" label="唯一标识符" width="100"/>
      <el-table-column prop="srv_data" label="服务数据" width="100"/>
      <el-table-column prop="mac" label="MAC地址" width="100"/>
      <el-table-column prop="reviewscore" label="评价分数" width="100"/>
      <el-table-column prop="reviewcontent" label="评价内容" width="100"/>
      <el-table-column prop="pk_user" label="用户主键" width="100"/>
      <el-table-column prop="pk_class" label="班级主键" width="100"/>
      <el-table-column prop="pk_lesson" label="课程主键" width="100"/>
      <el-table-column prop="pk_teacher" label="教师主键" width="100"/>
      <el-table-column prop="pk_class_room" label="教室主键" width="100"/>
      <el-table-column prop="campus" label="校区" width="100"/>
      <el-table-column prop="pk_anlaxy_syllabus" label="课程表主键" width="100"/>
      <el-table-column prop="teacher_pic" label="教师头像" width="100"/>
    </el-table>
    <el-empty v-else description="暂无课程信息"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {ElMessage} from 'element-plus'
import { getDayCourseList, getDaySignList } from '../../API/zhkqAPI'

// 日期选择器，默认今天
const getCurrentDate = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const selectedDate = ref<Date>(new Date()) // 默认今天

// 数据
const todayCourseList = ref<any[]>([])
const checkInRecords = ref<any[]>([])

const loadingCourses = ref(false)
const loadingCheckIns = ref(false)

// 获取用户 token
const getUserToken = (): string => {
  const userData = localStorage.getItem('SA-ZHKQ-USERINFO')
  return userData ? JSON.parse(userData).token : ''
}

// 获取今日课程
const fetchTodayCourses = async (date: string) => {
  loadingCourses.value = true
  try {
    const res = await getDayCourseList(date, getUserToken())
    if (res.state === '1' && Array.isArray(res.sourcelist)) {
      todayCourseList.value = res.sourcelist
    } else {
      todayCourseList.value = []
      ElMessage.warning('未获取到课程信息')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('获取课程失败')
  } finally {
    loadingCourses.value = false
  }
}

// 获取签到信息
const fetchCheckInRecords = async (date: string) => {
  loadingCheckIns.value = true
  try {
    const res = await getDaySignList(date, getUserToken())
    if (res.state === '1' && Array.isArray(res.sign_record_list)) {
      checkInRecords.value = res.sign_record_list
    } else {
      checkInRecords.value = []
      ElMessage.warning("未获取到签到信息")
    }
  } catch (e) {
    console.error(e)
    ElMessage.error("获取签到信息失败")
  } finally {
    loadingCheckIns.value = false
  }
}

// 根据选择日期获取两个接口信息
const fetchDataByDate = () => {
  const date = selectedDate.value ? selectedDate.value.toISOString().slice(0,10) : getCurrentDate()
  fetchTodayCourses(date)
  fetchCheckInRecords(date)
}
</script>

<style scoped>
.el-table {
  font-size: 14px;
}
</style>
