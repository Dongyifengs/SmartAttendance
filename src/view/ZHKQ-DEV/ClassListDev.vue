<template>
  <div class="debug-page">
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <el-date-picker v-model="selectedDate" placeholder="选择日期" type="date"/>
      <el-button type="primary" @click="fetchAllData">获取课程与签到信息</el-button>
      <el-button @click="fetchTodayCourses(getCurrentDate())">仅获取课程</el-button>
      <el-button @click="fetchCheckInRecords(getCurrentDate())">仅获取签到</el-button>
      <el-button @click="$router.back()">返回上一页</el-button>
    </div>

    <!-- 内容区 -->
    <el-row :gutter="20" class="table-section">
      <el-col :span="12">
        <DataTable
            :data="todayCourseList"
            :fields="courseFields"
            :highlight-value="highlightValue"
            :loading="loadingCourses"
            title="课程表"
            type="course"
            @highlight="setHighlight"
            @unhighlight="clearHighlight"
        />
      </el-col>
      <el-col :span="12">
        <DataTable
            :data="checkInRecords"
            :fields="checkInFields"
            :highlight-value="highlightValue"
            :loading="loadingCheckIns"
            title="签到信息表"
            type="checkin"
            @highlight="setHighlight"
            @unhighlight="clearHighlight"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {ElMessage} from 'element-plus'
import dayjs from 'dayjs'
import {ZHKQ_GetDayCourseList, ZHKQ_GetDaySignList} from '../../API/zhkqAPI'
import {checkInFields, courseFields} from './Type/dataFields'
import DataTable from './components/DataTable.vue'

// 高亮
const highlightValue = ref<string | undefined>(undefined)
const setHighlight = (v: string) => (highlightValue.value = v)
const clearHighlight = () => (highlightValue.value = undefined)

// 日期
const selectedDate = ref<Date>(dayjs().toDate())
const getCurrentDate = () => dayjs().format('YYYY-MM-DD')

// 数据
const todayCourseList = ref<any[]>([])
const checkInRecords = ref<any[]>([])
const loadingCourses = ref(false)
const loadingCheckIns = ref(false)

// 获取 token
const getUserToken = () => {
  const info = localStorage.getItem('SA-ZHKQ-USERINFO')
  return info ? JSON.parse(info).token : ''
}

// 通用请求函数
async function fetchList(name: string, api: Function, date: string, target: any, loadingFlag: any, keyName: string) {
  loadingFlag.value = true
  try {
    // 修改这里：根据不同的API函数使用不同的参数格式
    let res;
    if (api === ZHKQ_GetDayCourseList) {
      // 使用对象参数格式
      res = await api({date: date, userKey: getUserToken()})
    } else {
      // 保持原来的参数格式
      res = await api(date, getUserToken())
    }

    const list = res[keyName]
    if (res.state === '1' && Array.isArray(list)) {
      target.value = list
      if (list.length === 0) ElMessage.info(`${name} 数据服务端未生成`)
    } else {
      target.value = []
      ElMessage.warning(`未获取到${name}信息`)
    }
  } catch (e) {
    console.error(`获取${name}失败:`, e)
    ElMessage.error(`获取${name}失败`)
  } finally {
    loadingFlag.value = false
  }
}

// 获取课程与签到
const fetchTodayCourses = (date: string) => fetchList('课程', ZHKQ_GetDayCourseList, date, todayCourseList, loadingCourses, 'sourcelist')
const fetchCheckInRecords = (date: string) => fetchList('签到', ZHKQ_GetDaySignList, date, checkInRecords, loadingCheckIns, 'sign_record_list')

const fetchAllData = () => {
  const date = selectedDate.value ? dayjs(selectedDate.value).format('YYYY-MM-DD') : getCurrentDate()
  ElMessage.success(`正在获取 ${date} 的课程与签到信息...`)
  fetchTodayCourses(date)
  fetchCheckInRecords(date)
}

onMounted(() => {
  fetchAllData()
})
</script>

<style scoped>
@import "./Style/ClassListDev.css";
</style>