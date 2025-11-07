<template>
  <div :class="styles.container">
    <div :class="[styles.header, styles.headerInfo]">
      <div :class="styles.hash">
        <span
          :class="styles.buildTime"
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
        <span :class="styles.hashLink" @click="handleHashClick">
          {{ gitHash }}
        </span>
      </div>
      <div>
        <el-button @click="logOut">退出登录</el-button>
        <el-button @click="logBack">返回</el-button>
      </div>
    </div>

    <!-- 用户信息卡片 - 紧凑版展示 -->
    <div v-if="courseUserInfo" :class="styles.userInfoCard">
      <div :class="styles.userInfoHeader">
        <h3>个人信息</h3>
      </div>
      <div :class="styles.userInfoContent">
        <!-- 第一行：基础信息 -->
        <div :class="styles.infoLine">
          <span :class="styles.infoText">👤 {{ courseUserInfo.user_name }}</span>
          <span :class="styles.divider">|</span>
          <span :class="styles.infoText">🎂 {{ courseUserInfo.birthday || '未设置生日' }}</span>
          <span :class="styles.divider">|</span>
          <span :class="styles.infoText">🎓 {{ courseUserInfo.user_code }}</span>
        </div>

        <!-- 第二行：签到日期与设备ID -->
        <div :class="styles.infoLine">
          <span :class="styles.infoText">📅 {{ todayString }}</span>
          <span :class="styles.divider">|</span>
          <span :class="styles.infoText">📱 {{ cleanDeviceId }}</span>
        </div>

        <!-- 第三行：钱包余额与空调余额 -->
        <div :class="styles.infoLine">
          <span ref="walletBalanceRef" :class="styles.infoText">💰 {{ OC_QBYS }}</span>
          <span :class="styles.divider">|</span>
          <span
            ref="airConditioningBalanceRef"
            :class="styles.infoText"
            style="cursor: pointer"
            @click="showAirConditioned = true"
          >
            ❄️ {{ OC_KTYE }}
          </span>
        </div>
        <div :class="styles.infoLine">
          <span
            ref="qrCodePaymentFunction"
            :class="styles.infoText"
            style="cursor: pointer"
            @click="paymentDialogVisible = true"
          >
            📲 个人付款码
          </span>
          <span :class="styles.divider">|</span>
          <span
            ref="recentConsumptionRef"
            :class="styles.infoText"
            style="cursor: pointer"
            @click="showBillDialog = true"
          >
            💳 {{ OC_BR }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- 账单详情弹窗 -->
  <el-dialog
    v-model="showBillDialog"
    title="账单详情"
    width="400px"
    :close-on-click-modal="true"
  >
    <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 16px">
      <el-button
        v-for="day in dayOptions"
        :key="day.value"
        :type="day.value === currentDays ? 'primary' : 'default'"
        size="small"
        @click="fetchBill(day.value)"
      >
        {{ day.label }}
      </el-button>
    </div>

    <!-- 账单列表区域 -->
    <div v-if="billList.length">
      <el-table :data="billList" style="width: 100%" size="small">
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
    <div v-else style="text-align: center; color: #999">暂无账单数据</div>
  </el-dialog>

  <!-- 支付弹窗 -->
  <el-dialog
    v-model="paymentDialogVisible"
    title="支付二维码"
    width="400px"
    :close-on-click-modal="true"
  >
    <div style="text-align: center; margin-bottom: 16px">
      <img :src="payQCBase" alt="支付二维码" style="width: 300px; height: 300px" />
      <div style="margin-top: 8px; color: #666; font-size: 12px">
        二维码 {{ refreshCountdown }} 秒后自动刷新
      </div>
    </div>
    <div style="text-align: center; color: #999">
      {{ userClass }} | {{ userName }} | {{ userId }}
    </div>
    <div style="text-align: center; color: #999; margin-bottom: 16px">
      请使用校园一卡通App扫码支付
    </div>
    <div style="text-align: center">
      <el-button type="primary" :loading="refreshingQR" @click="refreshQRCode">
        {{ refreshingQR ? '刷新中...' : '立即刷新二维码' }}
      </el-button>
    </div>
  </el-dialog>

  <!-- 空调弹窗 -->
  <el-dialog
    v-model="showAirConditioned"
    title="空调设置与缴费"
    width="400px"
    :close-on-click-modal="true"
  >
    <div style="padding: 10px 0">
      <el-form label-width="100px">
        <el-form-item label="缴费单位">
          <el-text>{{ selectedAreaName || '加载中...' }}</el-text>
        </el-form-item>

        <el-form-item label="楼栋号">
          <el-select
            v-model="selectedBuildingId"
            placeholder="请选择楼栋号"
            filterable
            clearable
            style="width: 100%"
            @change="onBuildingChange"
          >
            <el-option
              v-for="building in buildingList"
              :key="building.build_id"
              :label="building.build_name"
              :value="building.build_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="房间号">
          <el-select
            v-model="selectedRoomId"
            placeholder="请先选择楼栋号"
            filterable
            clearable
            :disabled="!selectedBuildingId"
            style="width: 100%"
            @change="onRoomChange"
          >
            <el-option
              v-for="room in roomList"
              :key="room.room_id"
              :label="room.room_name"
              :value="room.room_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="空调余额">
          <el-text v-if="acBalance" type="primary" size="large">{{ acBalance }}</el-text>
          <el-text v-else>请先选择楼栋和房间</el-text>
        </el-form-item>
      </el-form>

      <div style="text-align: center; margin-top: 20px">
        <el-button type="primary" @click="saveACSettings">保存设置</el-button>
      </div>
    </div>
  </el-dialog>

  <!-- 加载课程转圈的地方 -->
  <div
    v-loading="loading"
    :class="styles.devHomeContainer"
    element-loading-text="正在加载课程信息，请稍候..."
  >
    <!-- 课程列表组件 -->
    <class-container v-model="data"></class-container>
  </div>

  <!-- 导游 - 仅在未完成时渲染 -->
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
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import ClassContainer from '@/components/ClassContainer.vue';
  import type { OC_BillRetrievalList } from '@/api/ocAPI/type/response';
  import { useOneCardAPI } from '@/composables/useOneCardAPI';
  import { useAirConditioning } from '@/composables/useAirConditioning';
  import { useTour } from '@/composables/useTour';
  import { useLongPress } from '@/composables/useLongPress';
  import { usePaymentQRCode } from '@/composables/usePaymentQRCode';
  import { useCourseData } from '@/composables/useCourseData';
  import styles from './DevHome.module.css';

  const router = useRouter();

  // 使用各个Composables
  const {
    OC_QBYS,
    OC_BR,
    billList,
    currentDays,
    userName,
    userClass,
    userId,
    payQCBase,
    getWalletBalance,
    getBillRetrieval,
    fetchBill,
    getUserInfoOC,
    getPayQC,
  } = useOneCardAPI();

  const {
    OC_KTYE,
    selectedAreaName,
    selectedBuildingId,
    selectedRoomId,
    buildingList,
    roomList,
    acBalance,
    loadPaymentUnits,
    loadBuildingList,
    onBuildingChange,
    onRoomChange,
    saveACSettings,
    loadSavedACSettings,
  } = useAirConditioning();

  const {
    tourOpen,
    tourCompleted,
    walletBalanceRef,
    airConditioningBalanceRef,
    recentConsumptionRef,
    qrCodePaymentFunction,
    initTour,
  } = useTour();

  const { buildTimestamp, gitHash, handleLongPressStart, handleLongPressEnd, handleHashClick } =
    useLongPress();

  const {
    showPayDialog: paymentDialogVisible,
    refreshCountdown,
    refreshingQR,
    refreshQRCode,
  } = usePaymentQRCode();

  const { userInfo: courseUserInfo, data, loading, todayString, loadCourseData } = useCourseData();

  // 本地状态
  const showBillDialog = ref(false);
  const showAirConditioned = ref(false);

  // 计算属性
  const cleanDeviceId = computed(() => {
    if (!courseUserInfo.value?.client_id) return '';
    const clientId = courseUserInfo.value.client_id;
    const ids = clientId.split(',');
    return ids[0].replace(/^uuid_/, '');
  });

  // 账单选项
  const dayOptions = [
    { label: '1天', value: 1 },
    { label: '7天', value: 7 },
    { label: '14天', value: 14 },
    { label: '1个月', value: 30 },
  ];

  // 金额格式化函数
  function formatAmount(row: OC_BillRetrievalList): string {
    return (row.trade_amount / 100).toFixed(2) + ' 元';
  }

  // 路由操作
  function logOut(): void {
    localStorage.clear();
    router.push('/');
  }

  function logBack(): void {
    router.push('/home');
  }

  // 生命周期：挂载时加载数据
  onMounted(async () => {
    try {
      // 加载课程数据
      await loadCourseData();

      // 一卡通：余额与最近消费
      await getWalletBalance();
      await getBillRetrieval(7);
      await fetchBill(7);
      await getUserInfoOC();
      await getPayQC();

      // 初始化空调相关数据
      await loadPaymentUnits();
      await loadBuildingList();
      await loadSavedACSettings();

      // 初始化导览
      await initTour();
    } catch (error) {
      console.error('[onMounted] 初始化异常：', error);
    }
  });
</script>

<style scoped>
  /* 弹窗样式优化 - 更现代化的设计 */
  :deep(.el-dialog) {
    border-radius: 16px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  }

  :deep(.el-dialog__header) {
    padding: 20px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px 16px 0 0;
    margin: 0;
  }

  :deep(.el-dialog__title) {
    color: white;
    font-weight: 600;
    font-size: 18px;
  }

  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: white;
    font-size: 20px;
  }

  :deep(.el-dialog__headerbtn .el-dialog__close:hover) {
    color: rgba(255, 255, 255, 0.8);
  }

  :deep(.el-dialog__body) {
    padding: 24px;
    background: #ffffff;
  }

  :deep(.el-table .cell) {
    padding: 8px 0;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  :deep(.el-table th) {
    background-color: #f5f7fa;
    font-weight: 600;
    color: #606266;
  }

  :deep(.el-table tr:hover) {
    background-color: #f5f7fa;
  }

  :deep(.el-button--primary) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
  }

  :deep(.el-button--primary:hover) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  :deep(.el-button--primary:active) {
    transform: translateY(0);
  }

  :deep(.el-button--default) {
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  :deep(.el-button--default:hover) {
    transform: scale(1.05);
  }

  :deep(.el-select) {
    border-radius: 8px;
  }

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  }

  @media (max-width: 768px) {
    :deep(.el-dialog) {
      width: 95vw !important;
      max-width: 95vw;
      margin: 5vh auto;
    }

    :deep(.el-dialog__header) {
      padding: 16px 20px;
    }

    :deep(.el-dialog__title) {
      font-size: 16px;
    }

    :deep(.el-dialog__body) {
      padding: 16px;
    }
  }
</style>
