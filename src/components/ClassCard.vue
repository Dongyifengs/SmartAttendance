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
  computedStatus?: "已签退" | "已签到" | "未签到" | "迟到" | "早退" | null
}
</script>
<script setup lang="ts">
import {Clock, Location, User, CircleClose, CircleCheck} from "@element-plus/icons-vue";
import {ref, computed} from "vue";

const info = defineModel<ClassInfo>({required: true});
const selectedSignInTime = ref<string>("");
const selectedSignOutTime = ref<string>("");

// Determine the status to display
const displayStatus = computed(() => {
  return info.value.computedStatus || (info.value.situation ? null : "未签到");
});

// Check if we should show time selectors (for 迟到 or 早退)
const shouldShowSignInSelector = computed(() => {
  return (info.value.situation === "迟到" || displayStatus.value === "迟到") && !info.value.signInTime;
});

const shouldShowSignOutSelector = computed(() => {
  return (info.value.situation === "早退" || displayStatus.value === "早退") && !info.value.signOutTime;
});

// Compute tag type based on status
const tagType = computed(() => {
  if (info.value.situation === '缺勤') return 'danger';
  if (info.value.situation === '迟到' || info.value.situation === '早退') return 'warning';
  if (info.value.situation === '请假') return 'info';
  if (displayStatus.value === '已签退') return 'success';
  if (displayStatus.value === '已签到') return 'primary';
  return 'info';
});

</script>
<template>
  <div class="class-card-wrapper">
    <div class="class-container">
      <div class="class-header">
        <div class="class-title">
          <span class="class-index">第{{info.classIndex}}节</span>
          <span class="class-name">{{info.className}}</span>
        </div>
        <div class="status-tag">
          <el-tag 
            :type="tagType"
            effect="dark"
            round
          >
            {{ info.situation || displayStatus }}
          </el-tag>
        </div>
      </div>
      
      <div class="class-content">
        <div class="info-item">
          <el-icon class="info-icon" :color="'#667eea'"><Clock /></el-icon>
          <span class="info-text">{{info.startTime.format("HH:mm")}} - {{info.endTime.format("HH:mm")}}</span>
        </div>
        
        <div class="info-item">
          <el-icon class="info-icon" :color="'#f093fb'"><Location /></el-icon>
          <span class="info-text">{{info.classRoom}}</span>
        </div>
        
        <div class="info-item">
          <el-icon class="info-icon" :color="'#4facfe'"><User /></el-icon>
          <span class="info-text">{{info.teacher.name}}</span>
        </div>
        
        <div class="divider"></div>
        
        <!-- Sign In Section -->
        <div class="sign-section">
          <div class="sign-item" v-if="info.signInTime">
            <el-icon class="sign-icon" :color="'#00d2ff'"><CircleCheck /></el-icon>
            <span class="sign-label">签到时间：</span>
            <span class="sign-value success">{{info.signInTime.format("HH:mm:ss")}}</span>
          </div>
          <div class="sign-item" v-else-if="shouldShowSignInSelector">
            <el-icon class="sign-icon" :color="'#f093fb'"><CircleClose /></el-icon>
            <span class="sign-label">签到时间：</span>
            <el-time-select 
              size="small" 
              v-model="selectedSignInTime" 
              :start="info.shouldSignInTime.format('HH:mm')" 
              step="00:01" 
              :end="info.startTime.format('HH:mm')" 
              placeholder="选择签到时间" 
              class="time-selector"
            />
          </div>
          <div class="sign-item" v-else>
            <el-icon class="sign-icon" :color="'#fa709a'"><CircleClose /></el-icon>
            <span class="sign-label">签到时间：</span>
            <span class="sign-value pending">未签到</span>
          </div>
        </div>
        
        <!-- Sign Out Section -->
        <div class="sign-section" v-if="info.signInTime">
          <div class="sign-item" v-if="info.signOutTime">
            <el-icon class="sign-icon" :color="'#00d2ff'"><CircleCheck /></el-icon>
            <span class="sign-label">签退时间：</span>
            <span class="sign-value success">{{info.signOutTime.format("HH:mm:ss")}}</span>
          </div>
          <div class="sign-item" v-else-if="shouldShowSignOutSelector">
            <el-icon class="sign-icon" :color="'#f093fb'"><CircleClose /></el-icon>
            <span class="sign-label">签退时间：</span>
            <el-time-select 
              size="small" 
              v-model="selectedSignOutTime" 
              :start="info.endTime.format('HH:mm')" 
              step="00:01" 
              :end="info.shouldSignOutTime.format('HH:mm')" 
              placeholder="选择签退时间" 
              class="time-selector"
            />
          </div>
          <div class="sign-item" v-else>
            <el-icon class="sign-icon" :color="'#fa709a'"><CircleClose /></el-icon>
            <span class="sign-label">签退时间：</span>
            <span class="sign-value pending">待签退</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.class-card-wrapper {
  animation: cardFadeIn 0.5s ease-out;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.class-container {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  min-width: 320px;
  max-width: 100%;
}

.class-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f5f5f7;
}

.class-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.class-index {
  font-size: 12px;
  color: #86868b;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.class-name {
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  letter-spacing: 0.3px;
}

.status-tag {
  animation: tagPulse 0.6s ease-out;
}

@keyframes tagPulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.class-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f5f5f7;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.info-item:hover {
  background: #e8e8ed;
  transform: translateX(4px);
}

.info-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.info-text {
  font-size: 14px;
  color: #1d1d1f;
  font-weight: 500;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #d2d2d7, transparent);
  margin: 8px 0;
}

.sign-section {
  margin-top: 4px;
}

.sign-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f5f5f7 0%, #fafafa 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.sign-item:hover {
  background: linear-gradient(135deg, #e8e8ed 0%, #f0f0f5 100%);
}

.sign-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.sign-label {
  font-size: 14px;
  color: #86868b;
  font-weight: 500;
  min-width: 80px;
}

.sign-value {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.sign-value.success {
  color: #00d2ff;
}

.sign-value.pending {
  color: #fa709a;
}

.time-selector {
  flex: 1;
  max-width: 180px;
}

.time-selector :deep(.el-input__wrapper) {
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.time-selector :deep(.el-input__wrapper):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .class-container {
    min-width: 280px;
    padding: 16px;
    border-radius: 16px;
  }
  
  .class-name {
    font-size: 18px;
  }
  
  .info-item {
    padding: 8px 10px;
  }
  
  .sign-item {
    padding: 10px;
    flex-wrap: wrap;
  }
  
  .time-selector {
    max-width: 100%;
    width: 100%;
  }
}
</style>