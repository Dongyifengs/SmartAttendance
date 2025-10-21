<script lang="ts">
import {Dayjs} from "dayjs";

export default {}
export interface ClassInfo {
  classIndex: number
  className: string
  startTime: Dayjs
  endTime: Dayjs
  classRoom: string
  teacher: {
    name: string
    id: number
  }
  signInTime: Dayjs | null
  signOutTime: Dayjs | null
  shouldSignInTime: Dayjs
  shouldSignOutTime: Dayjs,
  situation: "早退" | "迟到" | "缺勤" | "请假" | null
}
</script>
<script setup lang="ts">
import {Clock, Location, User, CircleClose, CircleCheck} from "@element-plus/icons-vue";
import IconifyText from "@/components/IconifyText.vue";
import {ref} from "vue";

const info = defineModel<ClassInfo>({required: true});
const selectedSignInTime = ref<string>("");
const selectedSignOutTime = ref<string>("");
</script>
<template>
  <el-card class="class-container">
    <template #header>
      <div class="class-header-container">
        <div>第{{info.classIndex}}节课 | {{info.className}}</div>
        <div>
          <el-tag type="danger" v-if="info.situation">{{info.situation}}</el-tag>
          <el-tag type="success" v-else-if="info.signInTime && info.signOutTime">签退成功</el-tag>
          <el-tag type="primary" v-else-if="info.signInTime">签到成功</el-tag>
          <el-tag type="info" v-else>暂未签到</el-tag>
        </div>
      </div>
    </template>
    <div class="content">
      <iconify-text :icon="Clock">课程时间：{{info.startTime.format("HH:mm")}} ~ {{info.endTime.format("HH:mm")}}</iconify-text>
      <iconify-text :icon="Location">教室位置：{{info.classRoom}}</iconify-text>
      <iconify-text :icon="User">教师：{{info.teacher.name}}（{{info.teacher.id}}）</iconify-text>
      <iconify-text :icon="CircleCheck" color="green" v-if="info.signInTime">签到时间：{{info.signInTime.format("HH:mm:ss")}}</iconify-text>
      <iconify-text :icon="CircleClose" color="red" v-else>签到时间：<el-time-select size="small" v-model="selectedSignInTime" :start="info.shouldSignInTime.format('HH:mm')" step="00:01" :end="info.startTime.format('HH:mm')" placeholder="请选择时间以签到" class="small-input"/></iconify-text>
      <iconify-text :icon="CircleCheck" color="green" v-if="info.signInTime && info.signOutTime">签退时间：{{info.signOutTime.format("HH:mm:ss")}}</iconify-text>
      <iconify-text :icon="CircleClose" color="red" v-else-if="info.signInTime">签退时间：<el-time-select size="small" v-model="selectedSignOutTime" :start="info.endTime.format('HH:mm')" step="00:01" :end="info.shouldSignOutTime.format('HH:mm')" placeholder="请选择时间以签退" class="small-input"/></iconify-text>
    </div>
  </el-card>
</template>

<style scoped>
.small-input {
  width: 170px;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.class-container {
  flex: 1;
  min-width: 370px
}
.class-header-container {
  display: flex;
  justify-content: space-between;
}
</style>