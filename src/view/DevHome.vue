<script setup lang="ts">
import dayjs from "dayjs";
import type {ClassInfo} from "@/components/ClassCard.vue";
import {onMounted, ref} from "vue";
import ClassContainer from "@/components/ClassContainer.vue";
import {ZHKQ_GetDayCourseList, ZHKQ_GetDaySignList} from "@/API/zhkqAPI/index.ts";
import {getZHKQUserInfo} from '../API/zhkqAPI/Function/Function'
import {User, Phone, Calendar, Iphone, Male} from "@element-plus/icons-vue";

const userInfo = getZHKQUserInfo();
const data = ref<ClassInfo[]>([]);
const todayString = dayjs().format("YYYY-MM-DD")

// Calculate course status based on current time
const calculateStatus = (course: any, signData: any): "已签退" | "已签到" | "未签到" | "迟到" | "早退" | null => {
  const startTime = dayjs(course.begin_time);
  const endTime = dayjs(course.end_time);
  
  const hasSignedIn = signData.u_begin_time && signData.u_begin_time !== "";
  const hasSignedOut = signData.u_end_time && signData.u_end_time !== "";
  const signInTime = hasSignedIn ? dayjs(signData.u_begin_time) : null;
  const signOutTime = hasSignedOut ? dayjs(signData.u_end_time) : null;
  
  // Check for specific situations first
  if (signData.absent_num === "1") return null; // 缺勤 handled separately
  if (signData.ask_leave_num === "1") return null; // 请假 handled separately
  
  // Check for late sign-in
  if (hasSignedIn && signInTime && signInTime.isAfter(startTime)) {
    if (hasSignedOut) {
      // Check for early leave
      if (signOutTime && signOutTime.isBefore(endTime)) {
        return "早退";
      }
      return "已签退";
    }
    return "迟到";
  }
  
  // Check for early leave
  if (hasSignedOut && signOutTime && signOutTime.isBefore(endTime)) {
    return "早退";
  }
  
  // Normal flow
  if (hasSignedOut) return "已签退";
  if (hasSignedIn) return "已签到";
  
  return "未签到";
};

onMounted(async () => {
  if (userInfo) {
    const signInfo = (await ZHKQ_GetDaySignList({date: todayString, userKey: userInfo.value!.token})).sign_record_list
    const courseList = (await ZHKQ_GetDayCourseList({date: todayString, userKey: userInfo.value!.token})).sourcelist;
    const signMap = new Map(signInfo.map(e => [e.pk_lesson, e]));
    data.value = courseList.map((e, index): ClassInfo | null => {
      const signData = signMap.get(e.pk_anlaxy_lesson);
      if (signData) {
        const status = calculateStatus(e, signData);
        return {
          classIndex: index + 1,
          className: e.lesson_name,
          startTime: dayjs(e.begin_time),
          endTime: dayjs(e.end_time),
          signInTime: signData.u_begin_time ? dayjs(signData.u_begin_time) : null,
          signOutTime: signData.u_end_time ? dayjs(signData.u_end_time) : null,
          shouldSignInTime: dayjs(signData.before_class_time),
          shouldSignOutTime: dayjs(signData.after_class_time),
          classRoom: e.class_room_name,
          teacher: {
            name: e.teacher_name,
            id: Number.parseInt(e.teacher_id)
          },
          situation: signData.absent_num === "1" ? "缺勤" : signData.ask_leave_num === "1" ? "请假" : status === "迟到" ? "迟到" : status === "早退" ? "早退" : null,
          computedStatus: status
        }
      }
      return null;
    }).filter(e => !!e);
  }
})

</script>

<template>
  <div class="dev-home-container">
    <!-- User Information Card -->
    <div class="user-info-card" v-if="userInfo">
      <div class="user-info-header">
        <h2>个人信息</h2>
      </div>
      <div class="user-info-content">
        <div class="info-row">
          <el-icon><User /></el-icon>
          <span class="info-label">姓名：</span>
          <span class="info-value">{{ userInfo.user_name }}</span>
        </div>
        <div class="info-row">
          <el-icon><Male /></el-icon>
          <span class="info-label">性别：</span>
          <span class="info-value">{{ userInfo.sex }}</span>
        </div>
        <div class="info-row">
          <el-icon><Calendar /></el-icon>
          <span class="info-label">生日：</span>
          <span class="info-value">{{ userInfo.birthday }}</span>
        </div>
        <div class="info-row">
          <el-icon><Phone /></el-icon>
          <span class="info-label">手机号：</span>
          <span class="info-value">{{ userInfo.user_phone }}</span>
        </div>
        <div class="info-row">
          <el-icon><Calendar /></el-icon>
          <span class="info-label">签到日期：</span>
          <span class="info-value">{{ todayString }}</span>
        </div>
        <div class="info-row">
          <el-icon><User /></el-icon>
          <span class="info-label">学号：</span>
          <span class="info-value">{{ userInfo.user_code }}</span>
        </div>
        <div class="info-row">
          <el-icon><Iphone /></el-icon>
          <span class="info-label">设备ID：</span>
          <span class="info-value">{{ userInfo.client_id }}</span>
        </div>
      </div>
    </div>
    
    <!-- Course List -->
    <class-container v-model="data"></class-container>
  </div>
</template>

<style scoped>
.dev-home-container {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
}

.user-info-header h2 {
  margin: 0 0 20px 0;
  color: white;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.user-info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
}

.info-row:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.02);
}

.info-row .el-icon {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
}

.info-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  min-width: 80px;
}

.info-value {
  font-weight: 400;
  color: white;
  flex: 1;
}

@media (max-width: 768px) {
  .dev-home-container {
    padding: 12px;
  }
  
  .user-info-card {
    padding: 20px;
    border-radius: 16px;
  }
  
  .user-info-header h2 {
    font-size: 20px;
  }
  
  .user-info-content {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .info-row {
    padding: 10px 14px;
  }
}
</style>