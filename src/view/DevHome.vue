<template>
  <div v-loading="loading" class="dev-home-container" element-loading-text="加载课程中...">
    <div class="header header-info">
      <div class="hash">
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
      <div>
        <el-button @click="logOut">退出登录</el-button>
        <el-button @click="logBack">返回</el-button>
      </div>
    </div>

    <!-- 用户信息卡片 - 紧凑版展示 -->
    <div v-if="userInfo" class="user-info-card">
      <div class="user-info-header">
        <h3>个人信息</h3>
      </div>
      <div class="user-info-content">
        <!-- 第一行：基础信息 -->
        <div class="info-line">
          <span class="info-text">姓名: {{ userInfo.user_name }}</span>
          <span class="divider">|</span>
          <span class="info-text">{{ userInfo.birthday || '未设置生日' }}</span>
          <span class="divider">|</span>
          <span class="info-text">学号: {{ userInfo.user_code }}</span>
        </div>

        <!-- 第二行：签到日期与设备ID -->
        <div class="info-line">
          <span class="info-text">签到日期: {{ todayString }}</span>
          <span class="divider">|</span>
          <span class="info-text">设备ID: {{ cleanDeviceId }}</span>
        </div>

        <!-- 第三行：预留字段（钱包余额、空调余额等） -->
        <div class="info-line">
          <span ref="walletBalanceRef" class="info-text">钱包余额: {{ OC_QBYS }}</span>
          <span class="divider">|</span>
          <span class="info-text" @click="showAirConditioned = true">空调余额: {{ OC_KTYE }} </span>
          <span class="divider">|</span>
          <span ref="qrCodePaymentFunction" class="info-text" @click="showPayDialog = true"
            >个人付款码
          </span>
          <span class="divider">|</span>
          <span
            ref="recentConsumptionRef"
            class="info-text"
            style="cursor: pointer"
            @click="showBillDialog = true"
            >最新消费: {{ OC_BR }}
          </span>
          <span class="divider">|</span>
          <span class="info-text">[预留]用水预约:</span>
        </div>
      </div>
    </div>

    <!-- 账单详情弹窗 -->
    <el-dialog
      v-model="showBillDialog"
      title="账单详情"
      width="400px"
      class="bill-dialog"
      :close-on-click-modal="false"
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
            :formatter="(row: OC_BillRetrievalList) => (row.trade_amount / 100).toFixed(2) + ' 元'"
          />
        </el-table>
      </div>
      <div v-else style="text-align: center; color: #999">暂无账单数据</div>
    </el-dialog>

    <!-- 支付弹窗 -->
    <el-dialog
      v-model="showPayDialog"
      title="支付二维码"
      width="400px"
      class="pay-dialog"
      :close-on-click-modal="false"
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
      class="pay-dialog"
      :close-on-click-modal="false"
    >
      <!-- 内容 -->
      <div class="air-conditioned-content">
        <el-text class="mx-1" size="large">缴费单位：{{ OC_TEXT_KTYE_PayingUnit }}</el-text
        ><br />
        <el-text class="mx-1" size="large">区域：{{ OC_TEXT_KTYE_PayingUnit }}</el-text
        ><br />
        <el-text class="mx-1" size="large">楼栋号：{{ OC_TEXT_KTYE_Building }}</el-text><br />
        <el-text class="mx-1" size="large">房间号：{{ OC_TEXT_KTYE_Room }}</el-text><br />
      </div>
    </el-dialog>

    <!-- 课程列表组件 -->
    <class-container v-model="data"></class-container>

    <!-- Tour Guide - Only render if not completed -->
    <el-tour
      v-if="!tourCompleted"
      v-model="tourOpen"
      :z-index="3001"
      :mask="{ color: 'rgba(0, 0, 0, 0.5)', style: { zIndex: 3000 } }"
      :close-icon="null"
    >
      <el-tour-step
        :target="walletBalanceRef"
        title="钱包余额"
        description="登录一卡通就能看见钱包的余额"
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
  /**
   * 优化说明（摘要）:
   * - 将相近逻辑分组（常量、tour、OC API、账单、长按、课程处理、生命周期）
   * - 去重重复 watch，增强空值保护及异常处理
   * - 所有异步调用统一 try/catch，失败时给予友好提示或记录日志
   */

  import dayjs from 'dayjs';
  import type { ClassInfo } from '@/components/ClassCard.vue';
  import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
  import ClassContainer from '@/components/ClassContainer.vue';
  import { ZHKQ_GetDayCourseList, ZHKQ_GetDaySignList } from '@/api/anlaxy';
  import { getZHKQUserInfo } from '@/api/anlaxy/utils';
  import type { CourseList, SignListInfo } from '@/api/anlaxy/type/response';
  import router from '@/router';
  import { ElMessage } from 'element-plus';
  import {
    OC_BillRetrieval,
    OC_GetBalance,
    OC_GetPaymentUnits,
    OC_GetPayQRCode,
    OC_GetUserInfo,
    OC_Login,
  } from '@/api/ocAPI';
  import type { OC_BillRetrievalList, OCLoginResponse } from '@/api/ocAPI/type/response';

  // ==================== 常量 & 配置 ====================
  const LONG_PRESS_DELAY = 800; // 长按触发延迟（毫秒）
  const LONG_PRESS_DEBOUNCE_DELAY = 100; // 长按防抖延迟（毫秒）
  const TOUR_COMPLETED_KEY = 'SA-TOUR-COMPLETED1'; // localStorage key for tour completion

  // ==================== Tour 相关 ====================
  const tourOpen = ref(false);
  const tourCompleted = ref(localStorage.getItem(TOUR_COMPLETED_KEY) === 'true');
  const walletBalanceRef = ref<HTMLElement | null>(null);
  const recentConsumptionRef = ref<HTMLElement | null>(null);
  const qrCodePaymentFunction = ref<HTMLElement | null>(null);

  const checkTourCompleted = (): boolean => {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    const isCompleted = completed === 'true';
    tourCompleted.value = isCompleted;
    return isCompleted;
  };

  const markTourCompleted = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    tourCompleted.value = true;
  };

  // 只需要一个 watch 来处理 tourOpen 关闭保存
  watch(tourOpen, (newVal) => {
    if (!newVal) {
      markTourCompleted();
    }
  });

  // ==================== 一卡通相关（状态） ====================
  const OC_QBYS = ref('加载中...'); // 一卡通余额显示
  const OC_BR = ref('7日内没有消费'); // 最近消费显示
  const OC_KTYE = ref('加载中...'); // 空调余额显示

  // 账单弹窗相关
  const showBillDialog = ref(false);
  const billList = ref<OC_BillRetrievalList[]>([]);
  const currentDays = ref<number>(7);

  // 支付弹窗
  const showPayDialog = ref(false);

  const dayOptions = [
    { label: '1天', value: 1 },
    { label: '7天', value: 7 },
    { label: '14天', value: 14 },
    { label: '1个月', value: 30 },
  ];

  // 本地读取一卡通用户信息（安全判空）
  const getUserInfo_OC = (): OCLoginResponse | null => {
    const userInfoStr = localStorage.getItem('SA-OC-USERINFO');
    if (!userInfoStr) return null;
    try {
      return JSON.parse(userInfoStr);
    } catch (e) {
      console.error('[getUserInfo_OC] JSON.parse 失败', e);
      return null;
    }
  };

  // 自动登录一卡通（当 token 失效时使用）
  const autoLoginOC = async (): Promise<boolean> => {
    try {
      const ocAccountStr = localStorage.getItem('SA-OC-ACCOUNT');
      if (!ocAccountStr) {
        console.log('[一卡通自动登录] 未找到保存的账户信息');
        return false;
      }
      let ocAccount;
      try {
        ocAccount = JSON.parse(ocAccountStr);
      } catch (parseError) {
        console.error('[一卡通自动登录] 账户信息解析失败：', parseError);
        return false;
      }
      if (!ocAccount.username || !ocAccount.password) {
        console.log('[一卡通自动登录] 账户信息不完整');
        return false;
      }

      console.log('[一卡通自动登录] 开始自动登录...');
      const res = await OC_Login(ocAccount.username, ocAccount.password);
      if (res && res.code === 200) {
        console.log('[一卡通自动登录] 自动登录成功');
        const userInfoToSave = structuredClone(res);
        if (userInfoToSave.data) {
          userInfoToSave.data.backUrl = '';
          userInfoToSave.data.logoUrl = '';
        }
        localStorage.setItem('SA-OC-USERINFO', JSON.stringify(userInfoToSave));
        localStorage.setItem('SA-OC-TIMESTAMP', new Date().getTime().toString());
        return true;
      } else {
        console.warn('[一卡通自动登录] 登录失败：', res?.msg || res);
        return false;
      }
    } catch (error) {
      console.error('[一卡通自动登录] 异常：', error);
      return false;
    }
  };

  // 获取钱包余额（含 token 失效自动登录与重试）
  const oc_Get_WalletBalance = async (): Promise<void> => {
    try {
      const userInfo = getUserInfo_OC();
      if (!userInfo?.data?.token) {
        OC_QBYS.value = '未登录';
        return;
      }
      const userKey = userInfo.data.token;
      const res = await OC_GetBalance(userKey);
      console.log('钱包余额API返回：', res);

      // 特殊提示字符判断（后端返回 msg）
      if (res?.msg === '您的身份信息已失效,请重新从卡包进入') {
        const loginSuccess = await autoLoginOC();
        if (loginSuccess) {
          const newUserInfo = getUserInfo_OC();
          if (newUserInfo?.data?.token) {
            try {
              const newRes = await OC_GetBalance(newUserInfo.data.token);
              OC_QBYS.value = (newRes?.data?.wallet0_amount ?? 0) / 100 + ' 元';
              return;
            } catch (err) {
              console.error('[一卡通自动登录] 重新获取余额失败：', err);
              ElMessage.error('获取钱包余额失败，请重新登录');
              // 清理并跳转回登录页面
              localStorage.removeItem('SA-OC-USERINFO');
              localStorage.removeItem('SA-OC-TIMESTAMP');
              await router.push('/');
              return;
            }
          }
        }
        ElMessage.error('您的身份信息已失效,请重新登录');
        localStorage.removeItem('SA-OC-USERINFO');
        localStorage.removeItem('SA-OC-TIMESTAMP');
        await router.push('/');
        return;
      }

      OC_QBYS.value = (res?.data?.wallet0_amount ?? 0) / 100 + ' 元';
    } catch (error) {
      console.error('[oc_Get_WalletBalance] 异常：', error);
      OC_QBYS.value = '获取失败';
    }
  };

  // 获取最近消费记录（默认 7 天）
  const oc_Get_BillRetrieval = async (days = 7): Promise<void> => {
    try {
      const userInfo = getUserInfo_OC();
      if (!userInfo?.data?.token) {
        OC_BR.value = '未登录';
        return;
      }
      const userKey = userInfo.data.token;
      const res = await OC_BillRetrieval(1, 1, days, userKey);
      console.log('最近消费记录API返回：', res);

      if (!res) {
        OC_BR.value = '查询失败';
        return;
      }

      if (res.code === 400) {
        OC_BR.value = res.msg || '无权限';
        return;
      }

      if (res.data?.all_count > 0 && Array.isArray(res.data.list)) {
        const latest = res.data.list[0];
        const amountText = (latest.trade_amount ?? 0) / 100;
        // 根据 desc 简单映射图标
        const desc = latest.desc || '';
        if (desc.includes('用水')) {
          OC_BR.value = `${amountText}元🥤`;
        } else if (desc.includes('餐')) {
          OC_BR.value = `${amountText}元🍽️`;
        } else if (desc.includes('淋浴')) {
          OC_BR.value = `${amountText}元🚿`;
        } else if (desc.includes('微信充值')) {
          OC_BR.value = `${amountText}元💳`;
        } else if (desc.includes('商场')) {
          OC_BR.value = `${amountText}元🛍️`;
        } else if (desc.includes('洗衣')) {
          OC_BR.value = `${amountText}元🧼`;
        } else {
          OC_BR.value = `${amountText}元`;
        }
      } else {
        OC_BR.value = `近${days}天未消费`;
      }
    } catch (error) {
      console.error('[oc_Get_BillRetrieval] 异常：', error);
      OC_BR.value = '获取失败';
    }
  };

  // 拉取指定天数的账单明细（弹窗内使用）
  const fetchBill = async (days: number): Promise<void> => {
    currentDays.value = days;
    try {
      const userInfo = getUserInfo_OC();
      if (!userInfo?.data?.token) {
        ElMessage.warning('请先登录一卡通以查看账单');
        return;
      }
      const userKey = userInfo.data.token;
      const res = await OC_BillRetrieval(1, 100, days, userKey);
      console.log(`账单${days}天数据切换API返回：`, res);
      if (res?.data?.list && res.data.list.length) {
        billList.value = res.data.list;
      } else {
        billList.value = [];
      }
    } catch (error) {
      console.error('[fetchBill] 异常：', error);
      billList.value = [];
      ElMessage.error('获取账单信息失败');
    }
  };

  // 获取用户信息
  const userName = ref('用户名');
  const userClass = ref('班级');
  const userId = ref('学校');
  const getUserInfoOC = async () => {
    try {
      const userInfo = getUserInfo_OC();
      if (!userInfo?.data?.token) {
        ElMessage.warning('请先登录一卡通以获取用户信息');
        return;
      }
      const userKey = userInfo.data.token;
      const res = OC_GetUserInfo(userKey);
      console.log('获取用户信息返回：', res);
      res.then((response) => {
        if (response && response.code === 200) {
          userName.value = response.data.name || '用户名';
          userClass.value = response.data.dept_name || '班级';
          userId.value = response.data.school_name || '学校';
        } else {
          ElMessage.error('获取用户信息失败');
        }
      });
    } catch (error) {
      console.log('[getUserInfoOC] 异常: ', error);
      ElMessage.error('获取用户信息失败');
    }
  };

  // 获取支付二维码
  const payQCBase = ref('');
  const refreshTimer = ref<number | null>(null);
  const refreshCountdown = ref(10); // 倒计时显示
  const refreshingQR = ref(false); // 刷新状态
  const getPayQC = async (): Promise<void> => {
    try {
      const userInfo = getUserInfo_OC();
      if (!userInfo?.data?.token) {
        ElMessage.warning('请先登录一卡通以获取用户信息');
        return;
      }
      const userKey = userInfo.data.token;
      const response = await OC_GetPayQRCode(userKey);
      console.log('获取支付二维码返回：', response);
      payQCBase.value = response.data.code_info;
    } catch (error) {
      console.error('[getPayQC] 异常: ', error);
      ElMessage.error('获取支付二维码失败');
    }
  };

  // 手动刷新二维码
  const refreshQRCode = async (): Promise<void> => {
    if (refreshingQR.value) return;

    refreshingQR.value = true;
    try {
      await getPayQC();
      resetRefreshTimer(); // 重置自动刷新计时器
      ElMessage.success('二维码已刷新');
    } catch (error) {
      console.error('[refreshQRCode] 刷新二维码失败:', error);
      ElMessage.error('刷新二维码失败');
    } finally {
      refreshingQR.value = false;
    }
  };

  // 重置自动刷新计时器
  const resetRefreshTimer = (): void => {
    // 清除现有计时器
    if (refreshTimer.value !== null) {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    }

    // 重置倒计时
    refreshCountdown.value = 10;

    // 启动新的计时器
    refreshTimer.value = window.setInterval(() => {
      refreshCountdown.value--;

      if (refreshCountdown.value <= 0) {
        // 自动刷新二维码
        getPayQC()
          .then(() => {
            console.log('二维码自动刷新完成');
          })
          .catch((error) => {
            console.error('二维码自动刷新失败:', error);
          });
        // 重置倒计时
        refreshCountdown.value = 10;
      }
    }, 1000);
  };

  // 启动二维码自动刷新
  const startQRRefresh = (): void => {
    resetRefreshTimer();
  };

  // 停止二维码自动刷新
  const stopQRRefresh = (): void => {
    if (refreshTimer.value !== null) {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    }
    refreshCountdown.value = 10;
  };

  // 监听支付弹窗显示/隐藏
  watch(showPayDialog, (newVal) => {
    if (newVal) {
      // 弹窗打开时启动自动刷新
      nextTick(() => {
        startQRRefresh();
      });
    } else {
      // 弹窗关闭时停止自动刷新
      stopQRRefresh();
    }
  });

  // 空调弹窗
  const showAirConditioned = ref(true);

  // 定义文本
  const OC_TEXT_KTYE_PayingUnit = ref('未知单位');
  const OC_TEXT_KTYE_Building = ref('未知楼栋');
  const OC_TEXT_KTYE_Room = ref('未知房间');
  const OC_Get_PayingUnit = async () => {
    try {
      const userInfo = getUserInfo_OC();
      if (!userInfo?.data?.token) {
        ElMessage.warning('请先登录一卡通以获取用户信息');
        return;
      }
      const userKey = userInfo.data.token;
      const response = OC_GetPaymentUnits(userKey);
      console.log('获取支付单位返回：', response);
      response.then((res) => {
        OC_TEXT_KTYE_PayingUnit.value = res.data.list[0].area_name;
      });
    } catch (error) {
      ElMessage.error('获取支付单位失败');
      console.error('[OC_Get_PayingUnit] 异常: ', error);
    }
  };

  // ==================== 长按逻辑 ====================
  const longPressTimer = ref<number | null>(null);
  const isLongPressing = ref(false);

  // 构建 commit 链接
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
    // 防止重复设定定时器
    if (longPressTimer.value !== null) {
      clearTimeout(longPressTimer.value);
      longPressTimer.value = null;
    }
    isLongPressing.value = false;
    longPressTimer.value = window.setTimeout(() => {
      isLongPressing.value = true;
      // 显示提交信息
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

  // ==================== 路由 / 会话管理 ====================
  const logOut = (): void => {
    localStorage.clear();
    router.push('/');
  };

  const logBack = (): void => {
    router.push('/home');
  };

  // 清理定时器
  onUnmounted(() => {
    stopQRRefresh();
    if (longPressTimer.value !== null) {
      clearTimeout(longPressTimer.value);
      longPressTimer.value = null;
    }
  });

  // ==================== 课程与签到处理 ====================
  // 从 ZHKQ 获取的用户信息（包含 token）
  const userInfo = getZHKQUserInfo();

  // 课程数据
  const data = ref<ClassInfo[]>([]);

  // 页面 loading 状态
  const loading = ref<boolean>(true);

  // 今天日期字符串
  const todayString = dayjs().format('YYYY-MM-DD');

  // 设备 ID 清理（计算属性）
  const cleanDeviceId = computed(() => {
    if (!userInfo.value?.client_id) return '';
    const clientId = userInfo.value?.client_id;
    const ids = clientId.split(',');
    return ids[0].replace(/^uuid_/, '');
  });

  /**
   * 根据课程与签到信息计算课程状态
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

    // 缺勤或请假直接返回 null（特殊标识）
    if (signData.absent_num === '1') return null;
    if (signData.ask_leave_num === '1') return null;

    // 有签到但签到晚于上课时间 → 迟到
    if (hasSignedIn && signInTime && signInTime.isAfter(startTime)) {
      if (hasSignedOut) {
        // 若签退时间早于下课时间 → 早退
        if (signOutTime && signOutTime.isBefore(endTime)) return '早退';
        return '已签退';
      }
      return '迟到';
    }

    // 未迟到但签退时间早于下课 → 早退
    if (hasSignedOut && signOutTime && signOutTime.isBefore(endTime)) {
      return '早退';
    }

    // 正常签到签退
    if (hasSignedOut) return '已签退';
    if (hasSignedIn) return '已签到';

    // 未签到且当前时间已超过上课时间 → 迟到状态
    if (!hasSignedIn && now.isAfter(startTime)) {
      return '迟到';
    }

    // 默认情况：未签到
    return '未签到';
  };

  /**
   * 根据签到记录和课程状态进一步计算出特殊情况（旷课、请假等）
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

  // ==================== 生命周期：挂载时加载数据 ====================
  onMounted(async () => {
    try {
      if (userInfo) {
        loading.value = true;
        try {
          // 获取当天签到记录
          const signRes = await ZHKQ_GetDaySignList({
            date: todayString,
            userKey: userInfo.value!.token,
          });
          const signInfo = signRes?.sign_record_list ?? [];

          // 获取当天课程列表
          const courseRes = await ZHKQ_GetDayCourseList({
            date: todayString,
            userKey: userInfo.value!.token,
          });
          const courseList = courseRes?.sourcelist ?? [];

          // 将签到记录以课程主键（pk_lesson）为 key 构建 Map
          const signMap = new Map(signInfo.map((e: SignListInfo) => [e.pk_lesson, e]));

          // 遍历课程列表并匹配签到数据
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
                  shouldSignOutTime: dayjs(
                    `${signData.lesson_date} ${signData.after_class_over_time}`
                  ),
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

          // 课程排序：未完成的排前面
          data.value = courses.sort((a, b) => {
            const getPriority = (course: ClassInfo) => {
              if (course.situation === '已请假' || course.situation === '已旷课') return 3;
              if (course.signInTime && course.signOutTime) return 2;
              return 1;
            };
            return getPriority(a) - getPriority(b);
          });
        } finally {
          loading.value = false;
        }
      }

      // 一卡通：余额与最近消费（并拉取默认 7 天账单）
      await oc_Get_WalletBalance();
      await oc_Get_BillRetrieval(7);
      await fetchBill(7);
      await getUserInfoOC();
      await getPayQC();
      await OC_Get_PayingUnit();

      // 检查并打开 Tour（若未完成）
      await nextTick();
      if (!checkTourCompleted()) {
        tourOpen.value = true;
      }
    } catch (error) {
      console.error('[onMounted] 初始化异常：', error);
    }
  });
</script>

<style scoped>
  /* =======================
   页面整体布局与动画效果
  ======================= */
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

  /* =======================
   Header 样式
  ======================= */
  .header {
    margin-bottom: 16px;
  }

  .header-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .hash {
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

  /* =======================
   用户信息卡片样式
  ======================= */
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

  /* =======================
   响应式适配
  ======================= */
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

  /* 弹窗宽度在手机端适配 */
  .bill-dialog {
    max-width: 90vw;
  }

  .bill-dialog .el-dialog__body {
    padding: 12px;
  }

  /* 让表格列文字更紧凑 */
  .bill-dialog .el-table .cell {
    padding: 4px 0;
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
