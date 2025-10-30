<script setup lang="ts">
import dayjs from "dayjs";
import type {ClassInfo} from "@/components/ClassCard.vue";
import {onMounted, ref, computed} from "vue";
import ClassContainer from "@/components/ClassContainer.vue";
import {ZHKQ_GetDayCourseList, ZHKQ_GetDaySignList} from "@/API/zhkqAPI/index.ts";
import {getZHKQUserInfo} from '../API/zhkqAPI/Function/Function'

const userInfo = getZHKQUserInfo();
const data = ref<ClassInfo[]>([]);
const todayString = dayjs().format("YYYY-MM-DD")

// Clean up device ID - remove uuid_ prefix and keep only first UUID if duplicated
const cleanDeviceId = computed(() => {
  if (!userInfo.value?.client_id) return '';
  const clientId = userInfo.value.client_id;
  // Split by comma to handle duplicates
  const ids = clientId.split(',');
  // Take first ID and remove uuid_ prefix
  return ids[0].replace(/^uuid_/, '');
});

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

const calculateSituation = (signData: any, status: "已签退" | "已签到" | "未签到" | "迟到" | "早退" | null): "早退" | "迟到" | "缺勤" | "请假" | null => {
  if (signData.absent_num === "1") return "缺勤";
  if (signData.ask_leave_num === "1") return "请假";
  if (status === "迟到") return "迟到";
  if (status === "早退") return "早退";
  return null;
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
          situation: calculateSituation(signData, status),
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
    <!-- User Information Card - Compact Version -->
    <div class="user-info-card" v-if="userInfo">
      <div class="user-info-header">
        <h3>个人信息</h3>
      </div>
      <div class="user-info-content">
        <div class="info-line">
          <span class="info-text">姓名: {{ userInfo.user_name }}</span>
          <span class="divider">|</span>
          <span class="info-text">{{ userInfo.sex }}</span>
          <span class="divider">|</span>
          <span class="info-text">{{ userInfo.birthday }}</span>
        </div>
        <div class="info-line">
          <span class="info-text">手机: {{ userInfo.user_phone }}</span>
          <span class="divider">|</span>
          <span class="info-text">学号: {{ userInfo.user_code }}</span>
        </div>
        <div class="info-line">
          <span class="info-text">签到日期: {{ todayString }}</span>
          <span class="divider">|</span>
          <span class="info-text">设备: {{ cleanDeviceId }}</span>
        </div>
      </div>
    </div>
    
    <!-- Course List -->
    <class-container v-model="data"></class-container>
  </div>
</template>

<style scoped>
.dev-home-container {
  padding: 12px;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.user-info-header h3 {
  margin: 0 0 12px 0;
  color: white;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.user-info-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-line {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: white;
  font-size: 14px;
}

.info-text {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
}

.divider {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
}

@media (max-width: 768px) {
  .dev-home-container {
    padding: 10px;
  }
  
  .user-info-card {
    padding: 14px 16px;
    border-radius: 14px;
  }
  
  .user-info-header h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .info-line {
    font-size: 13px;
    gap: 6px;
  }
}
</style>