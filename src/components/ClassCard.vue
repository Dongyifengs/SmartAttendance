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
  situation: "早退" | "迟到" | "已旷课" | "已请假" | null
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
  if (info.value.situation === '已旷课') return 'danger';
  if (info.value.situation === '迟到' || info.value.situation === '早退') return 'warning';
  if (info.value.situation === '已请假') return 'info';
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
            size="small"
            round
          >
            {{ info.situation || displayStatus }}
          </el-tag>
        </div>
      </div>
      
      <div class="class-content">
        <div class="info-row-compact">
          <span class="info-item-inline">
            <el-icon class="info-icon" :color="'#667eea'"><Clock /></el-icon>
            {{info.startTime.format("HH:mm")}} - {{info.endTime.format("HH:mm")}}
          </span>
          <span class="divider-inline">|</span>
          <span class="info-item-inline">
            <el-icon class="info-icon" :color="'#f093fb'"><Location /></el-icon>
            {{info.classRoom}}
          </span>
          <span class="divider-inline">|</span>
          <span class="info-item-inline">
            <el-icon class="info-icon" :color="'#4facfe'"><User /></el-icon>
            {{info.teacher.name}}
          </span>
        </div>
        
        <div class="divider"></div>
        
        <!-- Sign In/Out Section - More Compact -->
        <div class="sign-info">
          <div class="sign-row" v-if="info.signInTime">
            <el-icon class="sign-icon" :color="'#00d2ff'"><CircleCheck /></el-icon>
            <span class="sign-text">签到: {{info.signInTime.format("HH:mm:ss")}}</span>
          </div>
          <div class="sign-row" v-else-if="shouldShowSignInSelector">
            <el-icon class="sign-icon" :color="'#f093fb'"><CircleClose /></el-icon>
            <span class="sign-label">签到:</span>
            <el-time-select 
              size="small" 
              v-model="selectedSignInTime" 
              :start="info.shouldSignInTime.format('HH:mm')" 
              step="00:01" 
              :end="info.startTime.format('HH:mm')" 
              placeholder="选择时间" 
              class="time-selector"
            />
          </div>
          <div class="sign-row" v-else>
            <el-icon class="sign-icon" :color="'#fa709a'"><CircleClose /></el-icon>
            <span class="sign-text pending">未签到</span>
          </div>
        </div>
        
        <div class="sign-info" v-if="info.signInTime">
          <div class="sign-row" v-if="info.signOutTime">
            <el-icon class="sign-icon" :color="'#00d2ff'"><CircleCheck /></el-icon>
            <span class="sign-text">签退: {{info.signOutTime.format("HH:mm:ss")}}</span>
          </div>
          <div class="sign-row" v-else-if="shouldShowSignOutSelector">
            <el-icon class="sign-icon" :color="'#f093fb'"><CircleClose /></el-icon>
            <span class="sign-label">签退:</span>
            <el-time-select 
              size="small" 
              v-model="selectedSignOutTime" 
              :start="info.endTime.format('HH:mm')" 
              step="00:01" 
              :end="info.shouldSignOutTime.format('HH:mm')" 
              placeholder="选择时间" 
              class="time-selector"
            />
          </div>
          <div class="sign-row" v-else>
            <el-icon class="sign-icon" :color="'#fa709a'"><CircleClose /></el-icon>
            <span class="sign-text pending">待签退</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.class-card-wrapper {
  animation: cardFadeIn 0.4s ease-out;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.class-container {
  background: white;
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  min-width: 300px;
  max-width: 100%;
}

.class-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f5;
}

.class-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.class-index {
  font-size: 11px;
  color: #86868b;
  font-weight: 500;
}

.class-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
}

.status-tag {
  animation: tagPulse 0.5s ease-out;
}

@keyframes tagPulse {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.class-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row-compact {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: #1d1d1f;
  padding: 6px 0;
}

.info-item-inline {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.divider-inline {
  color: #d2d2d7;
  font-weight: 300;
}

.info-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e8e8ed, transparent);
  margin: 4px 0;
}

.sign-info {
  margin-top: 2px;
}

.sign-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #f5f5f7;
  border-radius: 10px;
  transition: all 0.2s ease;
  font-size: 13px;
}

.sign-row:hover {
  background: #e8e8ed;
}

.sign-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.sign-label {
  font-weight: 500;
  color: #86868b;
  min-width: 50px;
}

.sign-text {
  font-weight: 500;
  color: #00d2ff;
}

.sign-text.pending {
  color: #fa709a;
}

.time-selector {
  flex: 1;
  max-width: 140px;
}

.time-selector :deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

.time-selector :deep(.el-input__wrapper):hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .class-container {
    min-width: 260px;
    padding: 12px 14px;
    border-radius: 14px;
  }
  
  .class-name {
    font-size: 15px;
  }
  
  .info-row-compact {
    font-size: 12px;
    gap: 6px;
  }
  
  .sign-row {
    padding: 5px 7px;
    font-size: 12px;
    flex-wrap: wrap;
  }
  
  .time-selector {
    max-width: 100%;
    width: 100%;
  }
}
</style>