<template>
  <div class="class-card-wrapper">
    <div class="class-container">
      <!-- 卡片头部 -->
      <div class="class-header">
        <div class="class-title">
          <span class="class-index">第{{ info.classIndex }}节</span>
          <span class="class-name">{{ info.className }}</span>
        </div>
        <div class="status-tag">
          <el-tag :type="tagType" effect="dark" round size="small">
            {{ info.situation || displayStatus }}
          </el-tag>
        </div>
      </div>

      <!-- 课程详细信息 -->
      <div class="class-content">
        <div class="info-row-compact">
          <span class="info-item-inline">
            <el-icon :color="'#667eea'" class="info-icon"><Clock /></el-icon>
            {{ info.startTime.format('HH:mm') }} - {{ info.endTime.format('HH:mm') }}
          </span>
          <span class="divider-inline">|</span>
          <span class="info-item-inline">
            <el-icon :color="'#f093fb'" class="info-icon"><Location /></el-icon>
            {{ info.classRoom }}
          </span>
          <span class="divider-inline">|</span>
          <span class="info-item-inline">
            <el-icon :color="'#4facfe'" class="info-icon"><User /></el-icon>
            {{ info.teacher.name }} - {{ info.teacher.id }}
          </span>
        </div>

        <!-- 分割线 -->
        <div class="divider"></div>

        <!-- 签到 -->
        <div class="sign-info">
          <div v-if="info.signInTime" class="sign-row">
            <el-icon :color="'#00d2ff'" class="sign-icon">
              <CircleCheck />
            </el-icon>
            <span class="sign-text">签到: {{ info.signInTime.format('HH:mm:ss') }}</span>
          </div>
          <div v-else-if="shouldShowSignInSelector" class="sign-row">
            <el-icon :color="'#f093fb'" class="sign-icon">
              <CircleClose />
            </el-icon>
            <span class="sign-label">签到:</span>
            <el-time-select
              v-model="selectedSignInTime"
              :end="info.startTime.format('HH:mm')"
              :start="info.shouldSignInTime.format('HH:mm')"
              class="time-selector"
              placeholder="选择时间"
              size="small"
              step="00:01"
            />
            <el-button
              v-if="canShowSignInButton"
              class="sign-button"
              size="small"
              type="primary"
              @click="simulateSignIn"
            >
              签到
            </el-button>
          </div>
          <div v-else class="sign-row">
            <el-icon :color="'#fa709a'" class="sign-icon">
              <CircleClose />
            </el-icon>
            <span class="sign-text pending">未签到</span>
            <el-button
              v-if="
                canShowSignInButton &&
                !info.signInTime &&
                info.situation !== '已请假' &&
                info.situation !== '已旷课'
              "
              class="sign-button"
              size="small"
              type="primary"
              @click="simulateSignIn"
            >
              签到
            </el-button>
          </div>
        </div>

        <!-- 签退 -->
        <div v-if="info.signInTime" class="sign-info">
          <div v-if="info.signOutTime" class="sign-row">
            <el-icon :color="'#00d2ff'" class="sign-icon">
              <CircleCheck />
            </el-icon>
            <span class="sign-text">签退: {{ info.signOutTime.format('HH:mm:ss') }}</span>
          </div>
          <div v-else class="sign-row">
            <el-icon :color="'#fa709a'" class="sign-icon">
              <CircleClose />
            </el-icon>
            <span class="sign-text pending">待签退</span>
            <el-button
              v-if="info.situation !== '已请假' && info.situation !== '已旷课'"
              class="sign-button"
              size="small"
              type="success"
              @click="simulateSignOut"
            >
              签退
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Dayjs } from 'dayjs';
  import { ElMessageBox } from 'element-plus';

  export default {};

  export interface ClassInfo {
    classIndex: number;
    className: string;
    startTime: Dayjs;
    endTime: Dayjs;
    classRoom: string;
    teacher: {
      name: string;
      id: number;
    };
    signInTime: Dayjs | null;
    signOutTime: Dayjs | null;
    shouldSignInTime: Dayjs;
    shouldSignOutTime: Dayjs;
    situation: '早退' | '迟到' | '已旷课' | '已请假' | null;
    computedStatus?: '已签退' | '已签到' | '未签到' | '迟到' | '早退' | null;
    // 签到所需的额外字段
    pk_anlaxy_syllabus_user?: string;
    lessonDate?: string;
  }
</script>
<script lang="ts" setup>
  import { Clock, Location, User, CircleClose, CircleCheck } from '@element-plus/icons-vue';
  import { ref, computed, watch } from 'vue';
  import dayjs from 'dayjs';
  import { getZHKQUserInfo } from '@/api/anlaxy/utils';
  import { ZHKQ_SignIn, ZHKQ_SignOut } from '@/api/anlaxy';
  import type { SignOutParam } from '@/api/anlaxy/type/requests';
  import { MOYI_UploadInfo } from '@/api/moyi';

  const info = defineModel<ClassInfo>({ required: true });
  const selectedSignInTime = ref<string>('');
  const userInfo = getZHKQUserInfo();

  // Determine the status to display
  const displayStatus = computed(() => {
    return info.value.computedStatus || (info.value.situation ? null : '未签到');
  });

  // Check if we should show time selectors (for 迟到 or 早退)
  // Check if we can show sign-in button (30 minutes before class)
  const canShowSignInButton = computed(() => {
    const now = dayjs();
    const thirtyMinutesBeforeClass = info.value.startTime.subtract(30, 'minute');
    return now.isAfter(thirtyMinutesBeforeClass) || now.isSame(thirtyMinutesBeforeClass);
  });

  const shouldShowSignInSelector = computed(() => {
    return (
      (info.value.situation === '迟到' || displayStatus.value === '迟到') && !info.value.signInTime
    );
  });

  // Set default sign-in time when in late status
  watch(
    shouldShowSignInSelector,
    (newVal) => {
      if (newVal && !selectedSignInTime.value) {
        // Default to 9 minutes before class start
        const defaultTime = info.value.startTime.subtract(9, 'minute');
        selectedSignInTime.value = defaultTime.format('HH:mm');
      }
    },
    { immediate: true }
  );

  // Compute tag type based on status
  const tagType = computed(() => {
    if (info.value.situation === '已旷课') return 'danger';
    if (info.value.situation === '迟到' || info.value.situation === '早退') return 'warning';
    if (info.value.situation === '已请假') return 'info';
    if (displayStatus.value === '已签退') return 'success';
    if (displayStatus.value === '已签到') return 'primary';
    return 'info';
  });

  // 签到函数 - 实际调用API
  const simulateSignIn = async () => {
    if (!userInfo.value || !info.value.pk_anlaxy_syllabus_user) {
      console.error('❌ 缺少必要的签到信息');
      alert('❌ 缺少必要的签到信息');
      return;
    }

    const now = dayjs();
    const startTime = info.value.startTime;

    // 获取签到时间
    let signInTime: string;
    const isCurrentlyLate = now.isAfter(startTime);

    if (isCurrentlyLate && selectedSignInTime.value) {
      // 如果是迟到且用户选择了时间，使用选择的时间
      signInTime = `${info.value.lessonDate} ${selectedSignInTime.value}:00`;
    } else if (isCurrentlyLate && !selectedSignInTime.value) {
      // 如果是迟到但没有选择时间，默认使用课程开始前9分钟
      const defaultSignInTime = startTime.subtract(9, 'minute');
      signInTime = defaultSignInTime.format('YYYY-MM-DD HH:mm:ss');
    } else {
      // 正常情况使用当前时间
      signInTime = now.format('YYYY-MM-DD HH:mm:ss');
    }

    // 签到类型：始终为2（正常）
    const signInType = 2;
    const actualSignInTime = dayjs(signInTime);
    const isLate = actualSignInTime.isAfter(startTime);

    // 计算迟到时长（分钟）
    const lateTimeLength = isLate ? Math.max(0, actualSignInTime.diff(startTime, 'minute')) : 0;

    // 构建签到参数
    const signInParams = {
      userKey: userInfo.value.token,
      pk_anlaxy_syllabus_user: info.value.pk_anlaxy_syllabus_user,
      sign_in_type: signInType,
      u_begin_time: signInTime,
      late_time_length: lateTimeLength,
      late_num: isLate ? 1 : 0,
      ask_leave_num: 0,
      in_longitude: 0,
      in_latitude: 0,
      phone_code: userInfo.value.client_id || '',
    };

    // 在控制台打印签到参数
    console.log('============================================');
    console.log('📋 签到 - ZHKQ_SignIn 参数');
    console.log('============================================');
    console.log('课程信息:');
    console.log(`  课程名称: ${info.value.className}`);
    console.log(
      `  课程时间: ${info.value.startTime.format('YYYY-MM-DD HH:mm')} - ${info.value.endTime.format('HH:mm')}`
    );
    console.log(`  教室: ${info.value.classRoom}`);
    console.log(`  教师: ${info.value.teacher.name}`);
    console.log('--------------------------------------------');
    console.log('签到参数:');
    console.log(`  userKey: ${signInParams.userKey}`);
    console.log(`  pk_anlaxy_syllabus_user: ${signInParams.pk_anlaxy_syllabus_user}`);
    console.log(`  sign_in_type: ${signInParams.sign_in_type} (正常)`);
    console.log(`  u_begin_time: ${signInParams.u_begin_time}`);
    console.log(`  late_time_length: ${signInParams.late_time_length} 分钟`);
    console.log(`  late_num: ${signInParams.late_num}`);
    console.log(`  ask_leave_num: ${signInParams.ask_leave_num}`);
    console.log(`  in_longitude: ${signInParams.in_longitude}`);
    console.log(`  in_latitude: ${signInParams.in_latitude}`);
    console.log(`  phone_code: ${signInParams.phone_code}`);
    console.log('--------------------------------------------');
    console.log('完整参数对象:');
    console.log(signInParams);
    console.log('============================================');

    try {
      // 调用真实的签到API
      console.log('🚀 正在调用签到API...');
      const response = await ZHKQ_SignIn(signInParams);
      console.log('✅ 签到API响应:');
      console.log(response);
      console.log('============================================');

      // 检查响应状态
      if (response.state === '1') {
        // 上传签到信息到 MOYI 服务器
        try {
          await MOYI_UploadInfo(
            '签到',
            'zhkq_Click_SignIn',
            JSON.stringify(signInParams),
            JSON.stringify(response),
            '哈希值',
            `${response.source_code}`
          );
          console.log('✅ 签到信息已上传到 MOYI 服务器');
        } catch (uploadError) {
          console.warn('⚠️ 上传签到信息到 MOYI 服务器失败:', uploadError);
        }

        alert(
          `✅ 签到成功！\n\n课程: ${info.value.className}\n签到时间: ${signInTime}\n状态: 正常签到`
        );
        // 刷新页面以更新签到状态
        window.location.reload();
      } else {
        alert(`⚠️ 签到失败\n\nstate: ${response.state}\nsing_result: ${response.sing_result}`);
        console.error('签到失败:', response);
      }
    } catch (error) {
      console.error('❌ 签到API调用失败:', error);
      alert(`❌ 签到失败\n\n网络错误或服务器异常`);
    }
  };

  // 签退函数 - 实际调用API
  const simulateSignOut = async () => {
    if (!userInfo.value || !info.value.pk_anlaxy_syllabus_user || !info.value.signInTime) {
      console.error('❌ 缺少必要的签退信息或未签到');
      alert('❌ 缺少必要的签退信息或未签到');
      return;
    }

    const now = dayjs();
    const endTime = info.value.endTime;

    // 签退类型：根据当前时间判断是否为早退
    // 1 = 早退，2 = 正常
    const signOutType = now.isBefore(endTime) ? 1 : 2;

    // 如果是早退，弹窗确认
    if (signOutType === 1) {
      try {
        await ElMessageBox.confirm(
          `当前时间: ${now.format('HH:mm')}，课程结束时间: ${endTime.format('HH:mm')}<br>您确定要在课程结束前签退吗？<br>这将记录为早退。`,

          '⚠️ 早退提醒',
          {
            confirmButtonText: '确定签退',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning',
          }
        );
      } catch (error) {
        // 用户取消了早退签退，这是正常的用户操作
        if (error === 'cancel') {
          console.log('用户取消了早退签退');
        } else {
          console.error('确认对话框发生错误:', error);
        }
        return;
      }
    }

    // 使用当前本地时间作为签退时间 - 格式为 HH:mm
    const signOutTime = now.format('HH:mm');

    // 格式化u_begin_time为 "YYYY-MM-DD HH:mm:ss" 字符串
    const formattedBeginTime = info.value.signInTime.format('YYYY-MM-DD HH:mm:ss');

    // 构建签退参数
    const signOutParams: SignOutParam = {
      userKey: userInfo.value.token,
      pk_anlaxy_syllabus_user: info.value.pk_anlaxy_syllabus_user,
      phone_code: userInfo.value.client_id || '',
      sign_out_type: signOutType,
      u_end_time: signOutTime, // 格式: "HH:mm" - 使用当前时间
      lesson_change_list: info.value.pk_anlaxy_syllabus_user,
      lesson_change_type: '0',
      ask_leave_num: 0,
      out_longitude: 0,
      out_latitude: 0,
      in_longitude: '0',
      in_latitude: '0',
      reviewscore: 10,
      reviewcontent: '好',
      sign_in_type: '2',
      u_begin_time: formattedBeginTime, // 使用格式化字符串，类型断言为any以绕过类型检查
      before_class_over_time: endTime.format('HH:mm'), // 下课时间
      late_time_length: 0,
      late_num: 0,
    };

    // 在控制台打印签退参数
    console.log('============================================');
    console.log('📋 签退 - ZHKQ_SignOut 参数');
    console.log('============================================');
    console.log('课程信息:');
    console.log(`  课程名称: ${info.value.className}`);
    console.log(
      `  课程时间: ${info.value.startTime.format('YYYY-MM-DD HH:mm')} - ${info.value.endTime.format('HH:mm')}`
    );
    console.log(`  教室: ${info.value.classRoom}`);
    console.log(`  教师: ${info.value.teacher.name}`);
    console.log('--------------------------------------------');
    console.log('签退参数:');
    console.log(`  userKey: ${signOutParams.userKey}`);
    console.log(`  pk_anlaxy_syllabus_user: ${signOutParams.pk_anlaxy_syllabus_user}`);
    console.log(
      `  sign_out_type: ${signOutParams.sign_out_type} (${signOutParams.sign_out_type === 1 ? '早退' : '正常'})`
    );
    console.log(`  u_end_time: ${signOutParams.u_end_time} (格式: HH:mm - 当前时间)`);
    console.log(`  u_begin_time: ${signOutParams.u_begin_time} (格式: YYYY-MM-DD HH:mm:ss)`);
    console.log(`  before_class_over_time: ${signOutParams.before_class_over_time} (下课时间)`);
    console.log(`  phone_code: ${signOutParams.phone_code}`);
    console.log(`  reviewcontent: ${signOutParams.reviewcontent}`);
    console.log(`  reviewscore: ${signOutParams.reviewscore}`);
    console.log('--------------------------------------------');
    console.log('完整参数对象:');
    console.log(signOutParams);
    console.log('============================================');

    try {
      // 调用真实的签退API
      console.log('🚀 正在调用签退API...');
      const response = await ZHKQ_SignOut(signOutParams);
      console.log('✅ 签退API响应:');
      console.log(response);
      console.log('============================================');

      // 检查响应状态
      if (response.state === '1') {
        // 上传签退信息到 MOYI 服务器
        try {
          await MOYI_UploadInfo(
            '签退',
            'zhkq_Click_SignOut',
            JSON.stringify(signOutParams),
            JSON.stringify(response),
            '哈希值',
            `${response.source_code}`
          );
          console.log('✅ 签退信息已上传到 MOYI 服务器');
        } catch (uploadError) {
          console.warn('⚠️ 上传签退信息到 MOYI 服务器失败:', uploadError);
        }

        const statusText = signOutType === 1 ? '早退' : '正常签退';
        alert(
          `✅ 签退成功！\n\n课程: ${info.value.className}\n签退时间: ${signOutTime}\n状态: ${statusText}`
        );
        // 刷新页面以更新签退状态
        window.location.reload();
      } else {
        alert(`⚠️ 签退失败\n\nstate: ${response.state}\nsing_result: ${response.sing_result}`);
        console.error('签退失败:', response);
      }
    } catch (error) {
      console.error('❌ 签退API调用失败:', error);
      alert(`❌ 签退失败\n\n网络错误或服务器异常`);
    }
  };
</script>

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

  .sign-button {
    margin-left: auto;
    border-radius: 8px;
    font-size: 12px;
    padding: 6px 12px;
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
