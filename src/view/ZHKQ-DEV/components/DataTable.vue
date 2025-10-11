<template>
  <el-card class="data-card">
    <div class="header">
      <h3>{{ title }}</h3>
    </div>

    <el-table
        v-if="data.length"
        v-loading="loading"
        :data="transposedData"
        border
        stripe
        style="width: 100%"
    >
      <!-- 左侧字段列 -->
      <el-table-column label="" prop="label" width="150"/>

      <!-- 动态课程/签到列 -->
      <el-table-column
          v-for="(_, idx) in data"
          :key="idx"
          :label="`${title}${idx + 1}`"
          :prop="String(idx)"
      >
        <template #default="{ row }">
          <span
              :class="{ highlight: props.highlightValue === row[idx] }"
              @mouseenter="setHighlight(row[idx])"
              @mouseleave="clearHighlight"
          >
            {{ formatValue(row.label, row[idx]) }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-else :description="data.length === 0 ? '当日数据服务端未生成' : '暂无信息'"/>
  </el-card>
</template>

<script lang="ts" setup>
import {computed} from 'vue'

interface Field {
  key: string
  label: string
}

interface DataTableProps {
  title: string
  data: any[]
  fields: Field[]
  loading: boolean
  highlightValue?: string | number
  type?: string
}

const props = withDefaults(defineProps<DataTableProps>(), {
  title: '未命名表格',
  data: () => [],
  fields: () => [],
  loading: false,
  highlightValue: undefined,
})

// ✅ 向父组件发送事件
const emit = defineEmits(['highlight', 'unhighlight'])

// 鼠标悬停与移出事件
const setHighlight = (val: string | number) => emit('highlight', val)
const clearHighlight = () => emit('unhighlight')

// ✅ 转置数据（字段作为行）
const transposedData = computed(() => {
  return props.fields.map((f) => {
    const row: Record<string, any> = {label: f.label}
    props.data.forEach((item, idx) => {
      row[idx] = item[f.key]
    })
    return row
  })
})

// ✅ 值格式化逻辑
function formatValue(label: string, val: any): string {
  if (val === undefined || val === null) return '—'

  switch (label) {
    case '课程类型':
      return val === 0 ? '正常排课' : String(val)
    case '是否选修':
      return val === 0 ? '否' : '是'
    case '迟到时长(分钟)':
      return val === 0 ? '未迟到' : `迟到${val}分钟`
    case '早退时长(分钟)':
      return val === 0 ? '未早退' : `早退${val}分钟`
    case '缺勤次数':
      return val === 0 ? '未缺勤' : '已缺勤'
    case '迟到次数':
      return val === 0 ? '未迟到' : '已迟到'
    case '早退次数':
      return val === 0 ? '未早退' : '已早退'
    case '请假次数':
      return val === 0 ? '未请假' : '已请假'
    case '正常出勤次数':
      return val === 0 ? '未出勤' : '已出勤'
    case '签到次数':
      return val === 0 ? '未签到' : '已签到'
    case '学生人数':
      return `${val}人`
    case '节次编号':
    case '节次':
      return `第${val}节`
    case '最大容量':
    case '当前人数':
      return `${val}人`
    case '周次':
      return `第${val}周`
    case '星期序号':
      return `第${val}天`
    case '评价分数':
      return val === 0 ? '未打分' : `${val}分`
    case '评价内容':
      return val === '' ? '未打分' : String(val)
    case '教师头像':
      return val === '' ? '没有头像' : String(val)
    case '课程状态':
      return val === 0 ? '未知' : String(val)
    default:
      return String(val)
  }
}
</script>

<style scoped>
.data-card {
  padding: 10px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* ✅ 高亮样式（两边同步） */
.highlight {
  background-color: #fff7d6;
  transition: background 0.2s;
}
</style>
