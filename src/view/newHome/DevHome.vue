<template>
  <div class="dev-home-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="build-info">
        <span
          class="build-time"
          title="长按查看提交记录"
          @mousedown="handleLongPressStart"
          @mouseup="handleLongPressEnd"
          @mouseleave="handleLongPressEnd"
          @touchstart="handleLongPressStart"
          @touchend="handleLongPressEnd"
          @touchcancel="handleLongPressEnd"
        >
          编译时间：{{ buildTimestamp }}
        </span>
        <span class="hash-link" @click="handleHashClick">
          {{ gitHash }}
        </span>
      </div>
      <div class="header-actions">
        <el-button @click="logOut">退出登录</el-button>
        <el-button @click="logBack">返回</el-button>
      </div>
    </div>

    <!-- User Info Card -->
    <div v-if="zhkqUserInfo" class="user-info-card">
      <div class="user-info-header">
        <h3>个人信息</h3>
      </div>
      <div class="user-info-content">
        <div class="info-line">
          <span class="info-text">姓名: {{ zhkqUserInfo.user_name }}</span>
          <span class="divider">|</span>
          <span class="info-text">{{ zhkqUserInfo.birthday || '未设置生日' }}</span>
          <span class="divider">|</span>
          <span class="info-text">学号: {{ zhkqUserInfo.user_code }}</span>
        </div>

        <div class="info-line">
          <span class="info-text">签到日期: {{ todayString }}</span>
          <span class="divider">|</span>
          <span class="info-text">设备ID: {{ cleanDeviceId }}</span>
        </div>

        <div class="info-line">
          <span ref="walletBalanceRef" class="info-text clickable">
            钱包余额: {{ oneCard.walletBalance.value }}
          </span>
          <span class="divider">|</span>
          <span
            ref="airConditioningBalanceRef"
            class="info-text clickable"
            @click="airConditioning.showDialog.value = true"
          >
            空调余额: {{ airConditioning.balanceDisplay.value }}
          </span>
        </div>

        <div class="info-line">
          <span
            ref="qrCodePaymentFunction"
            class="info-text clickable"
            @click="paymentQR.showDialog.value = true"
          >
            个人付款码
          </span>
          <span class="divider">|</span>
          <span
            ref="recentConsumptionRef"
            class="info-text clickable"
            @click="showBillDialog = true"
          >
            最新消费: {{ oneCard.recentConsumption.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- Bill Dialog -->
    <el-dialog
      v-model="showBillDialog"
      title="账单详情"
      width="400px"
      class="bill-dialog"
      :close-on-click-modal="true"
    >
      <div class="bill-controls">
        <el-button
          v-for="day in dayOptions"
          :key="day.value"
          :type="day.value === oneCard.currentDays.value ? 'primary' : 'default'"
          size="small"
          @click="oneCard.fetchBillList(day.value)"
        >
          {{ day.label }}
        </el-button>
      </div>

      <div v-if="oneCard.billList.value.length" class="bill-table">
        <el-table :data="oneCard.billList.value" style="width: 100%" size="small">
          <el-table-column prop="trade_time" label="时间" min-width="35%" align="center" />
          <el-table-column prop="desc" label="说明" min-width="33%" align="center" />
          <el-table-column
            prop="trade_amount"
            label="金额"
            min-width="32%"
            align="center"
            :formatter="formatAmount"
          />
        </el-table>
      </div>
      <div v-else class="empty-state">暂无账单数据</div>
    </el-dialog>

    <!-- Payment QR Dialog -->
    <el-dialog
      v-model="paymentQR.showDialog.value"
      title="支付二维码"
      width="400px"
      class="pay-dialog"
      :close-on-click-modal="true"
    >
      <div class="qr-container">
        <img
          :src="paymentQR.qrCodeBase64.value"
          alt="支付二维码"
          class="qr-code"
        />
        <div class="qr-countdown">
          二维码 {{ paymentQR.refreshCountdown.value }} 秒后自动刷新
        </div>
      </div>
      <div class="user-details">
        {{ oneCard.userClass.value }} | {{ oneCard.userName.value }} | {{ oneCard.userId.value }}
      </div>
      <div class="qr-hint">
        请使用校园一卡通App扫码支付
      </div>
      <div class="qr-actions">
        <el-button
          type="primary"
          :loading="paymentQR.refreshing.value"
          @click="paymentQR.manualRefresh()"
        >
          {{ paymentQR.refreshing.value ? '刷新中...' : '立即刷新二维码' }}
        </el-button>
      </div>
    </el-dialog>

    <!-- Air Conditioning Dialog -->
    <el-dialog
      v-model="airConditioning.showDialog.value"
      title="空调设置与缴费"
      width="400px"
      class="air-conditioned-dialog"
      :close-on-click-modal="true"
    >
      <div class="air-conditioned-content">
        <el-form label-width="100px">
          <el-form-item label="缴费单位">
            <el-text>{{ airConditioning.selectedAreaName.value || '加载中...' }}</el-text>
          </el-form-item>

          <el-form-item label="楼栋号">
            <el-select
              v-model="airConditioning.selectedBuildingId.value"
              placeholder="请选择楼栋号"
              filterable
              clearable
              style="width: 100%"
              @change="airConditioning.onBuildingChange"
            >
              <el-option
                v-for="building in airConditioning.buildingList.value"
                :key="building.build_id"
                :label="building.build_name"
                :value="building.build_id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="房间号">
            <el-select
              v-model="airConditioning.selectedRoomId.value"
              placeholder="请先选择楼栋号"
              filterable
              clearable
              :disabled="!airConditioning.selectedBuildingId.value"
              style="width: 100%"
              @change="airConditioning.onRoomChange"
            >
              <el-option
                v-for="room in airConditioning.roomList.value"
                :key="room.room_id"
                :label="room.room_name"
                :value="room.room_id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="空调余额">
            <el-text v-if="airConditioning.balance.value" type="primary" size="large">
              {{ airConditioning.balance.value }}
            </el-text>
            <el-text v-else>请先选择楼栋和房间</el-text>
          </el-form-item>
        </el-form>

        <div class="dialog-actions">
          <el-button type="primary" @click="airConditioning.saveSettings()">保存设置</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- Course List Container -->
    <div
      v-loading="courseLoading"
      class="course-container"
      element-loading-text="正在加载课程信息..."
    >
      <class-container v-model="courseData"></class-container>
    </div>

    <!-- Tour Guide -->
    <el-tour
      v-if="!tourCompleted"
      v-model="tourOpen"
      :z-index="3001"
      :mask="{ color: 'rgba(0, 0, 0, 0.5)', style: { zIndex: 3000 } }"
    >
      <el-tour-step
        :target="walletBalanceRef"
        title="钱包余额"
        description="登录一卡通就能看见钱包的余额"
        :next-button-props="{ children: '下一步' }"
      />
      <el-tour-step
        :target="airConditioningBalanceRef"
        title="空调余额"
        description="点击可以查看和设置空调余额。选择楼栋号和房间号后，系统会自动查询空调余额并保存设置"
        :prev-button-props="{ children: '上一步' }"
        :next-button-props="{ children: '下一步' }"
      />
      <el-tour-step
        :target="recentConsumptionRef"
        title="最近消费记录"
        description="默认显示最近7天的消费记录，点击之后会显示详细模式，可以自己选择时间范围"
        :prev-button-props="{ children: '上一步' }"
        :next-button-props="{ children: '下一步' }"
      />
      <el-tour-step
        :target="qrCodePaymentFunction"
        title="二维码支付功能"
        description="点击显示一卡通二维码支付功能，支持自动刷新和手动刷新"
        :prev-button-props="{ children: '上一步' }"
        :next-button-props="{ children: '完成' }"
      />
    </el-tour>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import router from '@/router';
import type { ClassInfo } from '@/components/ClassCard.vue';
import ClassContainer from '@/components/ClassContainer.vue';
import { ZHKQ_GetDayCourseList, ZHKQ_GetDaySignList } from '@/api/anlaxy';
import { getZHKQUserInfo } from '@/api/anlaxy/utils';
import type { CourseList, SignListInfo } from '@/api/anlaxy/type/response';
import type { OC_BillRetrievalList } from '@/api/ocAPI/type/response';
import { useUserInfo } from '@/composables/useUserInfo';
import { useOneCard } from '@/composables/useOneCard';
import { usePaymentQR } from '@/composables/usePaymentQR';
import { useAirConditioning } from '@/composables/useAirConditioning';

// ==================== Constants ====================
const LONG_PRESS_DELAY = 800;
const LONG_PRESS_DEBOUNCE_DELAY = 100;
const TOUR_COMPLETED_KEY = 'SA-TOUR-COMPLETED2';

// ==================== Composables ====================
const userInfoComposable = useUserInfo();
const oneCard = useOneCard();
const paymentQR = usePaymentQR();
const airConditioning = useAirConditioning();

// ==================== Tour State ====================
const tourOpen = ref(false);
const tourCompleted = ref(localStorage.getItem(TOUR_COMPLETED_KEY) === 'true');
const walletBalanceRef = ref<HTMLElement | null>(null);
const airConditioningBalanceRef = ref<HTMLElement | null>(null);
const recentConsumptionRef = ref<HTMLElement | null>(null);
const qrCodePaymentFunction = ref<HTMLElement | null>(null);

const checkTourCompleted = (): boolean => {
  const completed = localStorage.getItem(TOUR_COMPLETED_KEY) === 'true';
  tourCompleted.value = completed;
  return completed;
};

const markTourCompleted = () => {
  localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
  tourCompleted.value = true;
};

watch(tourOpen, (newVal) => {
  if (!newVal) {
    markTourCompleted();
  }
});

// ==================== Bill Dialog ====================
const showBillDialog = ref(false);

const dayOptions = [
  { label: '1天', value: 1 },
  { label: '7天', value: 7 },
  { label: '14天', value: 14 },
  { label: '1个月', value: 30 },
];

const formatAmount = (row: OC_BillRetrievalList) => {
  return `${(row.trade_amount / 100).toFixed(2)} 元`;
};

// ==================== Long Press Logic ====================
const longPressTimer = ref<number | null>(null);
const isLongPressing = ref(false);

const buildTimestamp = ref(import.meta.env.VITE_BUILD_TIMESTAMP || '开发环境');
const gitHash = ref(import.meta.env.VITE_GIT_HASH || '开发中');
const gitFullHash = ref(import.meta.env.VITE_GIT_FULL_HASH || '开发中');
const commitMessage = ref(import.meta.env.VITE_COMMIT_MESSAGE || '开发环境构建');
const githubRepo = ref(
  import.meta.env.VITE_GITHUB_REPO || 'https://github.com/Dongyifengs/SmartAttendance'
);

const getCommitUrl = (): string => {
  if (gitFullHash.value && gitFullHash.value !== '开发中') {
    return `${githubRepo.value}/commit/${gitFullHash.value}`;
  }
  return '#';
};

const handleLongPressStart = (): void => {
  if (longPressTimer.value !== null) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
  isLongPressing.value = false;
  longPressTimer.value = window.setTimeout(() => {
    isLongPressing.value = true;
    ElMessage({
      message: `提交记录: ${commitMessage.value}`,
      type: 'info',
      duration: 5000,
      showClose: true,
    });
  }, LONG_PRESS_DELAY);
};

const handleLongPressEnd = (): void => {
  if (longPressTimer.value !== null) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
  setTimeout(() => {
    isLongPressing.value = false;
  }, LONG_PRESS_DEBOUNCE_DELAY);
};

const handleHashClick = (): void => {
  const url = getCommitUrl();
  if (url && url !== '#') {
    window.open(url, '_blank');
  }
};

// ==================== Navigation ====================
const logOut = (): void => {
  localStorage.clear();
  router.push('/');
};

const logBack = (): void => {
  router.push('/home');
};

// ==================== Course Data ====================
const zhkqUserInfo = getZHKQUserInfo();
const courseData = ref<ClassInfo[]>([]);
const courseLoading = ref(true);
const todayString = dayjs().format('YYYY-MM-DD');

const cleanDeviceId = computed(() => {
  if (!zhkqUserInfo.value?.client_id) return '';
  const clientId = zhkqUserInfo.value.client_id;
  const ids = clientId.split(',');
  return ids[0].replace(/^uuid_/, '');
});

/**
 * Calculate course status based on sign data
 */
const calculateStatus = (
  course: CourseList,
  signData: SignListInfo
): '已签退' | '已签到' | '未签到' | '迟到' | '早退' | null => {
  const now = dayjs();
  const startTime = dayjs(`${course.lesson_date} ${course.begin_time}`);
  const endTime = dayjs(`${course.lesson_date} ${course.end_time}`);

  const hasSignedIn = !!(signData.u_begin_time && signData.u_begin_time !== '');
  const hasSignedOut = !!(signData.u_end_time && signData.u_end_time !== '');

  const signInTime = hasSignedIn ? dayjs(signData.u_begin_time) : null;
  const signOutTime = hasSignedOut ? dayjs(signData.u_end_time) : null;

  if (signData.absent_num === '1') return null;
  if (signData.ask_leave_num === '1') return null;

  if (hasSignedIn && signInTime && signInTime.isAfter(startTime)) {
    if (hasSignedOut) {
      if (signOutTime && signOutTime.isBefore(endTime)) return '早退';
      return '已签退';
    }
    return '迟到';
  }

  if (hasSignedOut && signOutTime && signOutTime.isBefore(endTime)) {
    return '早退';
  }

  if (hasSignedOut) return '已签退';
  if (hasSignedIn) return '已签到';

  if (!hasSignedIn && now.isAfter(startTime)) {
    return '迟到';
  }

  return '未签到';
};

/**
 * Calculate special situations
 */
const calculateSituation = (
  signData: SignListInfo,
  status: '已签退' | '已签到' | '未签到' | '迟到' | '早退' | null
): '早退' | '迟到' | '已旷课' | '已请假' | null => {
  if (signData.absent_num === '1') return '已旷课';
  if (signData.ask_leave_num === '1') return '已请假';
  if (status === '迟到') return '迟到';
  if (status === '早退') return '早退';
  return null;
};

/**
 * Load course data
 */
async function loadCourseData() {
  if (!zhkqUserInfo.value) return;

  courseLoading.value = true;
  try {
    const [signRes, courseRes] = await Promise.all([
      ZHKQ_GetDaySignList({
        date: todayString,
        userKey: zhkqUserInfo.value.token,
      }),
      ZHKQ_GetDayCourseList({
        date: todayString,
        userKey: zhkqUserInfo.value.token,
      }),
    ]);

    const signInfo = signRes?.sign_record_list ?? [];
    const courseList = courseRes?.sourcelist ?? [];

    const signMap = new Map(signInfo.map((e: SignListInfo) => [e.pk_lesson, e]));

    const courses = courseList
      .map((e: CourseList, index: number): ClassInfo | null => {
        const signData = signMap.get(e.pk_anlaxy_lesson);
        if (signData) {
          const status = calculateStatus(e, signData);
          return {
            classIndex: index + 1,
            className: e.lesson_name,
            startTime: dayjs(`${e.lesson_date} ${e.begin_time}`),
            endTime: dayjs(`${e.lesson_date} ${e.end_time}`),
            signInTime: signData.u_begin_time ? dayjs(signData.u_begin_time) : null,
            signOutTime: signData.u_end_time ? dayjs(signData.u_end_time) : null,
            shouldSignInTime: dayjs(`${signData.lesson_date} ${signData.before_class_time}`),
            shouldSignOutTime: dayjs(`${signData.lesson_date} ${signData.after_class_over_time}`),
            classRoom: e.class_room_name,
            teacher: {
              name: e.teacher_name,
              id: Number.parseInt(e.teacher_id),
            },
            situation: calculateSituation(signData, status),
            computedStatus: status,
            pk_anlaxy_syllabus_user: signData.pk_anlaxy_syllabus_user,
            lessonDate: e.lesson_date,
          } as ClassInfo;
        }
        return null;
      })
      .filter((e) => !!e) as ClassInfo[];

    // Sort: incomplete courses first
    courseData.value = courses.sort((a, b) => {
      const getPriority = (course: ClassInfo) => {
        if (course.situation === '已请假' || course.situation === '已旷课') return 3;
        if (course.signInTime && course.signOutTime) return 2;
        return 1;
      };
      return getPriority(a) - getPriority(b);
    });
  } catch (error) {
    console.error('[loadCourseData] Error:', error);
  } finally {
    courseLoading.value = false;
  }
}

// ==================== Lifecycle ====================
onMounted(async () => {
  try {
    // Load user info cache first
    await userInfoComposable.loadUserInfo();

    // Load course data
    await loadCourseData();

    // Initialize One Card data
    await Promise.all([
      oneCard.fetchWalletBalance(),
      oneCard.fetchRecentConsumption(7),
      oneCard.fetchBillList(7),
      oneCard.fetchUserInfo(),
    ]);

    // Initialize payment QR
    await paymentQR.initialize();

    // Initialize air conditioning
    await airConditioning.initialize();

    // Check and open tour if needed
    await nextTick();
    if (!checkTourCompleted()) {
      tourOpen.value = true;
    }
  } catch (error) {
    console.error('[onMounted] Initialization error:', error);
  }
});

onUnmounted(() => {
  paymentQR.stopAutoRefresh();
  if (longPressTimer.value !== null) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
});
</script>

<style scoped>
/* Page Layout */
.dev-home-page {
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

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

.build-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.build-time {
  cursor: pointer;
  user-select: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.build-time:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.build-time:active {
  background-color: rgba(0, 0, 0, 0.1);
}

.hash-link {
  color: #409eff;
  text-decoration: none;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.hash-link:hover {
  background-color: #ecf5ff;
  color: #66b1ff;
}

.hash-link:active {
  background-color: #d9ecff;
}

/* User Info Card */
.user-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 6px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideDown 0.5s ease-out;
  margin-bottom: 16px;
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

.info-text.clickable {
  cursor: pointer;
  transition: color 0.2s ease;
}

.info-text.clickable:hover {
  color: rgba(255, 255, 255, 1);
  text-decoration: underline;
}

.divider {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
}

/* Dialogs */
.bill-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 20px;
}

.qr-container {
  text-align: center;
  margin-bottom: 16px;
}

.qr-code {
  width: 300px;
  height: 300px;
}

.qr-countdown {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
}

.user-details {
  text-align: center;
  color: #999;
  margin-bottom: 8px;
}

.qr-hint {
  text-align: center;
  color: #999;
  margin-bottom: 16px;
}

.qr-actions {
  text-align: center;
}

.dialog-actions {
  text-align: center;
  margin-top: 20px;
}

/* Course Container */
.course-container {
  padding: 12px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .dev-home-page {
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

  .qr-code {
    width: 250px;
    height: 250px;
  }
}
</style>
