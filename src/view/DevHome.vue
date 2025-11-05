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
        <el-button @click="logBakc">返回</el-button>
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
          <span class="info-text">[预留]空调余额:</span>
          <span class="divider">|</span>
          <span class="info-text">[预留]个人付款码:</span>
          <span class="divider">|</span>
          <span
            ref="recentConsumptionRef"
            class="info-text"
            style="cursor: pointer"
            @click="showBillDialog = true"
            >最新消费: {{ OC_BR }}</span
          >
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
        :next-button-props="{ children: '完成' }"
      />
    </el-tour>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs';
  import type { ClassInfo } from '@/components/ClassCard.vue';
  import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
  import ClassContainer from '@/components/ClassContainer.vue';
  import { ZHKQ_GetDayCourseList, ZHKQ_GetDaySignList } from '@/api/anlaxy';
  import { getZHKQUserInfo } from '@/api/anlaxy/utils';
  import type { CourseList, SignListInfo } from '@/api/anlaxy/type/response';
  import router from '@/router';
  import { ElMessage } from 'element-plus';
  import { OC_BillRetrieval, OC_GetBalance, OC_Login } from '@/api/ocAPI';
  import type { OC_BillRetrievalList } from '@/api/ocAPI/type/response';

  // 常量定义
  const LONG_PRESS_DELAY = 800; // 长按触发延迟（毫秒）
  const LONG_PRESS_DEBOUNCE_DELAY = 100; // 长按防抖延迟（毫秒）
  const TOUR_COMPLETED_KEY = 'SA-TOUR-COMPLETED'; // localStorage key for tour completion

  // ===== Tour Guide 相关 ===== //
  const tourOpen = ref(false);
  const tourCompleted = ref(localStorage.getItem(TOUR_COMPLETED_KEY) === 'true');
  const walletBalanceRef = ref<HTMLElement>();
  const recentConsumptionRef = ref<HTMLElement>();

  // 检查用户是否已完成 Tour
  const checkTourCompleted = () => {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    const isCompleted = completed === 'true';
    tourCompleted.value = isCompleted;
    return isCompleted;
  };

  // 标记 Tour 已完成
  const markTourCompleted = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    tourCompleted.value = true;
  };

  // 监听 Tour 关闭事件，保存完成状态
  watch(tourOpen, (newVal) => {
    if (!newVal) {
      markTourCompleted();
    }
  });

  // ===== 一卡通API函数区域 ===== //

  const OC_QBYS = ref('加载中...'); // 一卡通余额
  const OC_BR = ref('7日内没有消费'); // 最近一次消费

  // ======= 账单详情弹窗逻辑 ======= //
  const showBillDialog = ref(false);
  const billList = ref<OC_BillRetrievalList[]>([]);
  const currentDays = ref(7);

  const dayOptions = [
    { label: '1天', value: 1 },
    { label: '7天', value: 7 },
    { label: '14天', value: 14 },
    { label: '1个月', value: 30 },
  ];

  // 监听 Tour 关闭事件，保存完成状态
  watch(tourOpen, (newVal) => {
    if (!newVal) {
      markTourCompleted();
    }
  });

  // ===== 一卡通API函数区域 ===== //

  // 获取一卡通信息
  const getUserInfo_OC = () => {
    const userInfoStr = localStorage.getItem('SA-OC-USERINFO');
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  };

  // 自动登录一卡通
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

      console.log('[一卡通自动登录] 检测到token已过期，开始自动登录...');
      const res = await OC_Login(ocAccount.username, ocAccount.password);
      
      if (res.code === 200) {
        console.log('[一卡通自动登录] 自动登录成功');
        
        // 使用structuredClone创建副本并将backUrl和logoUrl的值设为空字符串
        const userInfoToSave = structuredClone(res);
        if (userInfoToSave.data) {
          userInfoToSave.data.backUrl = "";
          userInfoToSave.data.logoUrl = "";
        }

        localStorage.setItem('SA-OC-USERINFO', JSON.stringify(userInfoToSave));
        localStorage.setItem('SA-OC-TIMESTAMP', new Date().getTime().toString());
        return true;
      } else {
        console.log('[一卡通自动登录] 自动登录失败：' + res.msg);
        return false;
      }
    } catch (error) {
      console.error('[一卡通自动登录] 自动登录异常：', error);
      return false;
    }
  };

  // 获取钱包余额
  const oc_Get_WalletBalance = async () => {
    const userInfo = getUserInfo_OC();

    const userKey = userInfo.data.token;
    const res = await OC_GetBalance(userKey);
    console.log('钱包余额API返回：', res);

    if (res.msg === '您的身份信息已失效,请重新从卡包进入') {
      // 尝试自动登录
      const loginSuccess = await autoLoginOC();
      
      if (loginSuccess) {
        // 重新获取用户信息和余额
        const newUserInfo = getUserInfo_OC();
        if (newUserInfo) {
          try {
            const newRes = await OC_GetBalance(newUserInfo.data.token);
            console.log('重新获取钱包余额API返回：', newRes);
            OC_QBYS.value = newRes.data.wallet0_amount / 100 + ' 元';
            return;
          } catch (error) {
            console.error('[一卡通自动登录] 重新获取余额失败：', error);
            ElMessage.error('获取钱包余额失败，请重新登录');
          }
        }
      }
      
      // 如果自动登录失败，则显示错误并跳转到登录页
      ElMessage.error('您的身份信息已失效,请重新登录');
      localStorage.removeItem('SA-OC-USERINFO');
      localStorage.removeItem('SA-OC-TIMESTAMP');
      await router.push('/');
      return;
    }

    OC_QBYS.value = res.data.wallet0_amount / 100 + ' 元';
  };

  // 获取最近的消费记录
  const oc_Get_BillRetrieval = async () => {
    const userInfo = getUserInfo_OC();

    const userKey = userInfo.data.token;
    const res = await OC_BillRetrieval(1, 1, 7, userKey);
    console.log('最近消费记录API返回：', res);
    if (res.code == 400) {
      OC_BR.value = res.msg;
    } else if (res.data.all_count > 0) {
      if (res.data.list[0].desc == "用水支出") {
        OC_BR.value = res.data.list[0].trade_amount / 100 + '元🥤';
      } else if (res.data.list[0].desc == "餐费支出") {
        OC_BR.value = res.data.list[0].trade_amount / 100 + '元🍽️';
      } else if (res.data.list[0].desc == "淋浴支出") {
        OC_BR.value = res.data.list[0].trade_amount / 100 + '元🚿';
      } else if (res.data.list[0].desc == "微信充值") {
        OC_BR.value = res.data.list[0].trade_amount / 100 + '元💳';
      } else if (res.data.list[0].desc == "商场购物") {
        OC_BR.value = res.data.list[0].trade_amount / 100 + '元🛍️';
      } else if (res.data.list[0].desc == "洗衣支出") {
        OC_BR.value = res.data.list[0].trade_amount / 100 + '元🧼';
      }
    } else {
      OC_BR.value = '近7天未消费';
    }
  };

  // 拉取账单详情
  const fetchBill = async (days: number) => {
    currentDays.value = days;
    const userInfo = getUserInfo_OC();
    if (!userInfo) return;
    const userKey = userInfo.data.token;

    // 每次切换时间范围重新加载账单
    const res = await OC_BillRetrieval(1, 100, days, userKey);
    console.log(`账单${days}天数据切换API返回：`, res);

    if (res.data?.list?.length) {
      billList.value = res.data.list;
    } else {
      billList.value = [];
    }
  };

  // ===== 一卡通API函数区域 ===== //

  // 用户信息对象（包含姓名、学号、token等）
  const userInfo = getZHKQUserInfo();

  // 当天课程数据（课程列表）
  const data = ref<ClassInfo[]>([]);

  // 页面加载状态（用于 v-loading）
  const loading = ref(true);

  // 当前日期字符串（格式：YYYY-MM-DD）
  const todayString = dayjs().format('YYYY-MM-DD');

  // 编译信息
  const buildTimestamp = ref(import.meta.env.VITE_BUILD_TIMESTAMP || '开发环境');
  const gitHash = ref(import.meta.env.VITE_GIT_HASH || '开发中');
  const gitFullHash = ref(import.meta.env.VITE_GIT_FULL_HASH || '开发中');
  const commitMessage = ref(import.meta.env.VITE_COMMIT_MESSAGE || '开发环境构建');
  const githubRepo = ref(
    import.meta.env.VITE_GITHUB_REPO || 'https://github.com/Dongyifengs/SmartAttendance'
  );

  // 长按相关状态
  const longPressTimer = ref<number | null>(null);
  const isLongPressing = ref(false);

  // 获取 GitHub 提交链接
  const getCommitUrl = () => {
    if (gitFullHash.value && gitFullHash.value !== '开发中') {
      return `${githubRepo.value}/commit/${gitFullHash.value}`;
    }
    return '#';
  };

  // 长按开始
  const handleLongPressStart = () => {
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

  // 长按结束或取消
  const handleLongPressEnd = () => {
    if (longPressTimer.value !== null) {
      clearTimeout(longPressTimer.value);
      longPressTimer.value = null;
    }
    // 重置长按状态，延迟一点以防止误触点击事件
    setTimeout(() => {
      isLongPressing.value = false;
    }, LONG_PRESS_DEBOUNCE_DELAY);
  };

  // 点击哈希值跳转到 GitHub
  const handleHashClick = () => {
    const url = getCommitUrl();
    if (url !== '#') {
      window.open(url, '_blank');
    }
  };

  const logOut = () => {
    localStorage.clear();
    router.push('/');
  };

  const logBakc = () => {
    router.push('/home')
  }

  // 清理定时器
  onUnmounted(() => {
    if (longPressTimer.value !== null) {
      clearTimeout(longPressTimer.value);
      longPressTimer.value = null;
    }
  });

  /**
   * 计算属性：清理设备 ID
   * - 若 userInfo.value.client_id 含多个 ID，用逗号分隔取第一个
   * - 去掉前缀 "uuid_"，使展示更干净
   */
  const cleanDeviceId = computed(() => {
    if (!userInfo.value?.client_id) return '';
    const clientId = userInfo.value.client_id;
    const ids = clientId.split(','); // 处理重复情况
    return ids[0].replace(/^uuid_/, ''); // 删除前缀 uuid_
  });

  /**
   * 根据课程与签到信息计算课程状态
   * @param {any} course - 当前课程信息对象
   * @param {any} signData - 当前课程对应的签到记录
   * @returns {"已签退" | "已签到" | "未签到" | "迟到" | "早退" | null}
   *
   * 逻辑说明：
   * - 先判断是否缺勤 / 请假
   * - 再根据签到时间与课程开始/结束时间判断是否迟到、早退
   * - 若无签到记录，则根据当前时间判断是否迟到或未签到
   */
  const calculateStatus = (
    course: CourseList,
    signData: SignListInfo
  ): '已签退' | '已签到' | '未签到' | '迟到' | '早退' | null => {
    const now = dayjs();
    const startTime = dayjs(`${course.lesson_date} ${course.begin_time}`);
    const endTime = dayjs(`${course.lesson_date} ${course.end_time}`);

    const hasSignedIn = signData.u_begin_time && signData.u_begin_time !== '';
    const hasSignedOut = signData.u_end_time && signData.u_end_time !== '';

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
   * @param {any} signData - 签到信息
   * @param {"已签退" | "已签到" | "未签到" | "迟到" | "早退" | null} status - 上一步计算的状态
   * @returns {"早退" | "迟到" | "已旷课" | "已请假" | null}
   *
   * 用于在课程卡片中展示“情况说明”字段
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
   * 生命周期钩子：组件挂载时执行
   * 异步加载当前用户当天课程与签到数据
   */
  onMounted(async () => {
    if (userInfo) {
      loading.value = true;
      try {
        // 获取当天的签到记录
        const signInfo = (
          await ZHKQ_GetDaySignList({
            date: todayString,
            userKey: userInfo.value!.token,
          })
        ).sign_record_list;

        // 获取当天的课程列表
        const courseList = (
          await ZHKQ_GetDayCourseList({
            date: todayString,
            userKey: userInfo.value!.token,
          })
        ).sourcelist;

        // 将签到记录以课程主键（pk_lesson）为 key 构建 Map 方便快速查找
        const signMap = new Map(signInfo.map((e) => [e.pk_lesson, e]));

        // 遍历课程列表并匹配签到数据
        const courses = courseList
          .map((e, index): ClassInfo | null => {
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
              };
            }
            return null;
          })
          .filter((e) => !!e);

        /**
         * 课程排序逻辑：
         * - 未完成课程（未签到/部分签到）排在前面
         * - 已完成、请假、旷课的课程排在后面
         */
        data.value = courses.sort((a, b) => {
          const getPriority = (course: ClassInfo) => {
            if (course.situation === '已请假' || course.situation === '已旷课') return 3;
            if (course.signInTime && course.signOutTime) return 2;
            return 1;
          };
          return getPriority(a) - getPriority(b);
        });
      } finally {
        // 无论成功或失败都结束加载状态
        loading.value = false;
      }
    }
    await oc_Get_WalletBalance();
    await oc_Get_BillRetrieval();
    await fetchBill(7);

    // 检查是否需要显示 Tour
    await nextTick();
    if (!checkTourCompleted()) {
      tourOpen.value = true;
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
