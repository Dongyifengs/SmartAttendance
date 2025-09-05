<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header">
          <div class="headerTitle">
            账户总览
          </div>
          <div class="loginTime">
            登陆时间 {{ getLoginTime() }}
          </div>
          <div class="logBtn">
            <el-button @click="logout">退出登录</el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <span>钱包余额：￥55.55</span>
        <span>E2南217空调余额：￥99.99</span>
        <span>个人付款码：显示二维码</span>
      </el-main>
      <el-footer>
        课程表列表
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import router from "../../router";

// 退出登录
const logout = () => {
  localStorage.clear()
  router.push('/')
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