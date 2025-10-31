<template>
  <div class="common-layout">
    <div class="header">
      <div class="loginTime">
        登陆时间 {{ getLoginTime() }}
      </div>
      <div class="logBtn">
        <h5>正式功能</h5>
        <el-button @click="DevHomeTest">课程签到签退页面</el-button>
        <el-button @click="logout">退出登录</el-button>
        <h5>测试功能</h5>
        <el-button @click="logoutTest">测试退出</el-button>
        <br>
        <h5>测试按钮</h5>
        <el-button @click="classListTest">课程表测试 [开发者模式]</el-button>
        <el-button @click="AttendanceListTest">考勤查询测试 [开发者模式]</el-button>
        <el-button @click="LeaveListTest">请假页面测试 [开发者模式]</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "../../router";

// 退出登录
const logout = () => {
  localStorage.clear()
  router.push('/')
}

const logoutTest = () => {
  localStorage.removeItem('SA-ZHKQ-TIMESTAMP')
  localStorage.removeItem('SA-ZHKQ-USERINFO')
  localStorage.removeItem('SA-OC-USERINFO')
  localStorage.removeItem('SA-OC-TIMESTAMP')
  router.push('/')
}

const classListTest = () => {
  router.push('/ClassListDev')
}

const AttendanceListTest = () => {
  router.push('/AttendanceDev')
}

const LeaveListTest = () => {
  router.push('/LeaveDev')
}

const DevHomeTest = () => {
  router.push('/dev/home')
}

// 获取登录时间
const getLoginTime = (): string | null => {
  const SAOCTIME = localStorage.getItem('SA-OC-TIMESTAMP');
  const SAZHKQTIME = localStorage.getItem('SA-ZHKQ-TIMESTAMP');

  const times = [SAOCTIME, SAZHKQTIME]
      .map(t => t !== null ? Number(t) : null)
      .filter((t): t is number => t !== null && !isNaN(t));

  if (!times.length) return null;

  const maxTime = Math.max(...times);
  const date = new Date(maxTime);

  // 格式化输出
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
</script>

<style scoped>

</style>