<template>
  <div class="common-layout">
    <div class="header">
      <div class="loginTime">登陆时间 {{ getLoginTime() }}</div>
      <div class="logBtn">
        <h5>正式功能</h5>
        <el-button class="custom_btn" @click="DevHomeTest">课程签到签退页面</el-button>
        <el-button class="custom_btn" @click="logout">退出登录</el-button>
        <h5>测试功能</h5>
        <el-button class="custom_btn" @click="logoutTest">测试退出</el-button>
        <h5>测试按钮</h5>
        <el-button class="custom_btn" @click="classListTest">课程表测试 [开发者模式]</el-button>
        <el-button class="custom_btn" @click="AttendanceListTest">考勤查询测试 [开发者模式]</el-button>
        <el-button class="custom_btn" @click="LeaveListTest">请假页面测试 [开发者模式]</el-button>
        <el-button class="custom_btn" @click="cleanUpTheGuidanceTest">清理引导文件 [开发者模式]</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import router from '@/router';
  import dayjs from 'dayjs';
  import { ElMessage } from 'element-plus';

  // 退出登录
  const logout = () => {
    localStorage.clear();
    router.push('/');
  };

  const logoutTest = () => {
    localStorage.removeItem('SA-ZHKQ-TIMESTAMP');
    localStorage.removeItem('SA-ZHKQ-USERINFO');
    localStorage.removeItem('SA-OC-USERINFO');
    localStorage.removeItem('SA-OC-TIMESTAMP');
    router.push('/');
  };

  const classListTest = () => {
    router.push('/ClassListDev');
  };

  const AttendanceListTest = () => {
    router.push('/AttendanceDev');
  };

  const LeaveListTest = () => {
    router.push('/LeaveDev');
  };

  const cleanUpTheGuidanceTest = () => {
    localStorage.removeItem('SA-TOUR-COMPLETED');
    ElMessage.success('引导文件已清理，下次进入相应页面将重新显示引导。');
  }

  const DevHomeTest = () => {
    router.push('/dev/home');
  };

  // 获取登录时间
  const getLoginTime = (): string | null => {
    const times = [
      localStorage.getItem('SA-OC-TIMESTAMP'),
      localStorage.getItem('SA-ZHKQ-TIMESTAMP'),
    ]
      .map((t) => (t !== null ? Number(t) : null))
      .filter((t): t is number => t !== null && !isNaN(t));

    if (!times.length) return null;

    const maxTime = Math.max(...times);

    // 格式化输出
    return dayjs(maxTime).format("HH:mm:ss.SSS");
  };
</script>

<style scoped>
@import "style/index.css";
::v-deep(.el-button+.el-button) {
  margin-left: 0;
}
</style>
