<template>
  <div>
    <!-- 功能列表 -->
    <el-date-picker v-model="selectedDate" placeholder="选择日期" style="margin-right: 10px" type="date"/>
    <el-button type="primary" @click="fetchDataByDate">获取课程与签到信息</el-button>
    <el-button style="margin-left: 10px" @click="$router.back()">返回上一页</el-button>

    <!-- 信息展示 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 今日课程表 -->
      <el-col :span="12">
        <h3>课程表</h3>
        <el-table v-if="todayCourseList.length" :data="transposedCourseRows" border stripe style="width: 100%">
          <el-table-column label="" prop="label" width="150"/>
          <el-table-column v-for="(_, idx) in todayCourseList" :key="idx" :label="'课程表' + (idx + 1)"
                           :prop="String(idx)">
            <template #default="{ row }">
              <span :class="{ highlight: highlightValue === row[idx] && highlightValue !== undefined }"
                    @mouseenter="setHighlight(row[idx])" @mouseleave="clearHighlight">
                <template v-if="row.label === '课程类型'">{{ row[idx] === 0 ? `正常排课` : row[idx] }}</template>
                <template v-else-if="row.label === '是否选修'">{{ row[idx] === 0 ? '否' : '是' }}</template>
                <template v-else-if="row.label === '周次'">{{ `第${row[idx]}周` }}</template>
                <template v-else-if="row.label === '星期序号'">{{ `第${row[idx]}天` }}</template>
                <template v-else-if="row.label === '节次'">{{ `第${row[idx]}节` }}</template>
                <template v-else-if="row.label === '最大容量'">{{ `${row[idx]}人` }}</template>
                <template v-else-if="row.label === '当前人数'">{{ `${row[idx]}人` }}</template>
                <template v-else>{{ row[idx] }}</template>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-else :description="todayCourseList.length === 0 ? '当日数据服务端未生成' : '暂无课程信息'"/>
      </el-col>

      <!-- 签到信息表 -->
      <el-col :span="12">
        <h3>签到信息表</h3>
        <el-table v-if="checkInRecords.length" :data="transposedCheckInRows" border stripe style="width: 100%">
          <el-table-column label="" prop="label" width="150"/>
          <el-table-column v-for="(_, idx) in checkInRecords" :key="idx" :label="'签到' + (idx + 1)"
                           :prop="String(idx)">
            <template #default="{ row }">
              <span :class="{ highlight: highlightValue === row[idx] && highlightValue !== undefined }"
                    @mouseenter="setHighlight(row[idx])" @mouseleave="clearHighlight">
                <template v-if="row.label === '课程类型'">{{ row[idx] === 0 ? `正常排课` : row[idx] }}</template>
                <template v-else-if="row.label === '迟到时长(分钟)'">{{
                    row[idx] === 0 ? '未迟到' : `迟到${row[idx]}分钟`
                  }}</template>
                <template v-else-if="row.label === '早退时长(分钟)'">{{
                    row[idx] === 0 ? '未早退' : `早退${row[idx]}分钟`
                  }}</template>
                <template v-else-if="row.label === '缺勤次数'">{{ row[idx] === 0 ? '未缺勤' : '已缺勤' }}</template>
                <template v-else-if="row.label === '迟到次数'">{{ row[idx] === 0 ? '未迟到' : '已迟到' }}</template>
                <template v-else-if="row.label === '早退次数'">{{ row[idx] === 0 ? '未早退' : '已早退' }}</template>
                <template v-else-if="row.label === '请假次数'">{{ row[idx] === 0 ? '未请假' : '已请假' }}</template>
                <template v-else-if="row.label === '正常出勤次数'">{{ row[idx] === 0 ? '未出勤' : '已出勤' }}</template>
                <template v-else-if="row.label === '签到次数'">{{ row[idx] === 0 ? '未签到' : '已签到' }}</template>
                <template v-else-if="row.label === '学生人数'">{{ row[idx] }}人</template>
                <template v-else-if="row.label === '节次编号'">第{{ row[idx] }}节</template>
                <template v-else-if="row.label === '课程状态'">{{ row[idx] === 0 ? '未知' : '未知' }}</template>
                <template v-else-if="row.label === '评价分数'">{{
                    row[idx] === 0 ? '未打分' : `${row[idx]}分`
                  }}</template>
                <template v-else-if="row.label === '评价内容'">{{ row[idx] === '' ? '未打分' : row[idx] }}</template>
                <template v-else-if="row.label === '教师头像'">{{ row[idx] === '' ? '没有头像' : row[idx] }}</template>
                <template v-else>{{ row[idx] }}</template>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-else :description="checkInRecords.length === 0 ? '当日数据服务端未生成' : '暂无签到信息'"/>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 导入包体
import {computed, onMounted, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {getDayCourseList, getDaySignList} from '../../API/zhkqAPI'
import dayjs from "dayjs";

// 高亮相关
const highlightValue = ref<string | undefined>(undefined)  // 当前高亮值
const setHighlight = (val: string) => {  // 设置高亮
  highlightValue.value = val  // 设置为当前值
}
const clearHighlight = () => {  // 清除高亮
  highlightValue.value = undefined  // 清空
}

// 可自定义需要展示的字段
const courseFields = [
  {key: 'lesson_type', label: '课程类型'},
  {key: 'lesson_date', label: '课程日期'},
  {key: 'selective', label: '是否选修'},
  {key: 'week_num', label: '周次'},
  {key: 'week_item', label: '星期序号'},
  {key: 'week_name', label: '星期'},
  {key: 'begin_time', label: '开始时间'},
  {key: 'end_time', label: '结束时间'},
  {key: 'section_num', label: '节次'},
  {key: 'pk_anlaxy_semester', label: '学期ID'},
  {key: 'pk_anlaxy_organize', label: '组织机构ID'},
  {key: 'pk_group', label: '班级ID'},
  {key: 'pk_anlaxy_timezone', label: '时区ID'},
  {key: 'campus', label: '校区'},
  {key: 'lesson_name', label: '课程名称'},
  {key: 'pk_anlaxy_lesson', label: '课程ID'},
  {key: 'teacher_id', label: '教师工号'},
  {key: 'teacher_name', label: '教师姓名'},
  {key: 'pk_teacher', label: '教师ID'},
  {key: 'class_room_name', label: '教室名称'},
  {key: 'pk_anlaxy_classroom', label: '教室ID'},
  {key: 'pk_anlaxy_syllabus', label: '教学大纲ID'},
  {key: 'max_count', label: '最大容量'},
  {key: 'cur_count', label: '当前人数'},
]

// 签到信息字段
const checkInFields = [
  {key: 'lesson_type', label: '课程类型'},
  {key: 'pk_anlaxy_syllabus_user', label: '教学安排用户主键'},
  {key: 'lesson_date', label: '上课日期'},
  {key: 'user_id', label: '用户ID'},
  {key: 'user_name', label: '学生姓名'},
  {key: 'before_class_time', label: '课前签到时间'},
  {key: 'begin_time', label: '上课开始时间'},
  {key: 'after_class_time', label: '课后签到时间'},
  {key: 'u_begin_time', label: '用户上课时间'},
  {key: 'before_class_over_time', label: '课前结束时间'},
  {key: 'end_time', label: '下课时间'},
  {key: 'after_class_over_time', label: '课后结束时间'},
  {key: 'u_end_time', label: '用户下课时间'},
  {key: 'late_time_length', label: '迟到时长(分钟)'},
  {key: 'leave_ago_time_length', label: '早退时长(分钟)'},
  {key: 'absent_num', label: '缺勤次数'},
  {key: 'late_num', label: '迟到次数'},
  {key: 'leave_num', label: '早退次数'},
  {key: 'ask_leave_num', label: '请假次数'},
  {key: 'ok_num', label: '正常出勤次数'},
  {key: 'get_num', label: '签到次数'},
  {key: 'user_num', label: '学生人数'},
  {key: 'section_num', label: '节次编号'},
  {key: 'syllabus_status', label: '课程状态'},
  {key: 'uuid', label: '唯一标识符'},
  {key: 'srv_data', label: '服务数据'},
  {key: 'mac', label: 'MAC地址'},
  {key: 'reviewscore', label: '评价分数'},
  {key: 'reviewcontent', label: '评价内容'},
  {key: 'pk_user', label: '用户主键'},
  {key: 'pk_class', label: '班级主键'},
  {key: 'pk_lesson', label: '课程主键'},
  {key: 'pk_teacher', label: '教师主键'},
  {key: 'pk_class_room', label: '教室主键'},
  {key: 'campus', label: '校区'},
  {key: 'pk_anlaxy_syllabus', label: '课程表主键'},
  {key: 'teacher_pic', label: '教师头像'},
]

// 日期选择器，默认今天
const getCurrentDate = (): string => {
  return dayjs().format('YYYY-MM-DD')  // 返回今天日期字符串
}
const selectedDate = ref<Date>(dayjs().toDate())  // 选择的日期

// 数据
const todayCourseList = ref<any[]>([])  // 今日课程列表
const checkInRecords = ref<any[]>([])  // 签到信息列表

const loadingCourses = ref(false)  // 课程加载状态
const loadingCheckIns = ref(false)  // 签到加载状态

// 表格“转置”处理
const transposedCourseRows = computed(() => {   // 转置后的课程表
  return courseFields.map(field => {    // 遍历每个字段
    const row: any = {label: field.label}   // 创建新行，包含标签
    todayCourseList.value.forEach((item, idx) => {    // 遍历课程列表
      row[idx] = item[field.key]    // 将对应字段值添加到行中
    })
    return row    // 返回该行
  })
})
const transposedCheckInRows = computed(() => {    // 转置后的签到表
  return checkInFields.map(field => {   // 遍历每个字段
    const row: any = {label: field.label}   // 创建新行，包含标签
    checkInRecords.value.forEach((item, idx) => {   // 遍历签到列表
      row[idx] = item[field.key]    // 将对应字段值添加到行中
    })
    return row    // 返回该行
  })
})

// 获取用户 token
const getUserToken = (): string => {    //
  const userData = localStorage.getItem('SA-ZHKQ-USERINFO')   // 从 localStorage 获取用户信息
  return userData ? JSON.parse(userData).token : ''   // 解析并返回 token
}

// 获取今日课程
const fetchTodayCourses = async (date: string) => {   // 根据日期获取课程
  loadingCourses.value = true   // 设置加载状态为 true
  try {
    const res = await getDayCourseList(date, getUserToken())    // 调用 API 获取课程数据
    if (res.state === '1' && Array.isArray(res.sourcelist)) {   // 检查响应状态和数据格式
      todayCourseList.value = res.sourcelist    // 更新课程列表
      if (res.sourcelist.length === 0) {    // 如果没有课程
        ElMessage.info("今日课程数据服务端未生成")    // 提示信息
      }
    } else {
      todayCourseList.value = []    // 清空课程列表
      ElMessage.warning('未获取到课程信息')   // 提示警告信息
    }
  } catch (error) {   // 捕获错误
    console.error(error)    // 输出错误信息
    ElMessage.error('获取课程失败')   // 提示错误信息
  } finally {   // 无论成功或失败都会执行
    loadingCourses.value = false    // 重置加载状态
  }
}

// 获取签到信息
const fetchCheckInRecords = async (date: string) => {   // 根据日期获取签到信息
  loadingCheckIns.value = true    // 设置加载状态为 true
  try {
    const res = await getDaySignList(date, getUserToken())    // 调用 API 获取签到数据
    if (res.state === '1' && Array.isArray(res.sign_record_list)) {   // 检查响应状态和数据格式
      checkInRecords.value = res.sign_record_list   // 更新签到列表
      if (res.sign_record_list.length === 0) {    // 如果没有签到记录
        ElMessage.info("签到数据服务端未生成")    // 提示信息
      }
    } else {
      checkInRecords.value = []   // 清空签到列表
      ElMessage.warning("未获取到签到信息")   // 提示警告信息
    }
  } catch (e) {   // 捕获错误
    console.error(e)    // 输出错误信息
    ElMessage.error("获取签到信息失败")   // 提示错误信息
  } finally {   // 无论成功或失败都会执行
    loadingCheckIns.value = false   // 重置加载状态
  }
}

// 根据选择日期获取两个接口信息
const fetchDataByDate = () => {   // 获取选中日期的数据
  try {
    const date = selectedDate.value ? dayjs(selectedDate.value).format('YYYY-MM-DD') : getCurrentDate()   // 格式化日期
    fetchTodayCourses(date)   // 获取课程
    fetchCheckInRecords(date)   // 获取签到信息
    ElMessage.success(`已获取 ${date} 的课程与签到信息`)   // 提示成功信息
  } catch (e) {
    ElMessage.error("日期格式错误，请重新选择")   // 提示错误信息
    console.error(e)    // 输出错误信息
  }
}

onMounted(() => {
  fetchDataByDate()
})
</script>

<style scoped>
.el-table {
  font-size: 14px;
}

.highlight {
  background-color: #ffe58f;
  transition: background 0.2s;
}
</style>