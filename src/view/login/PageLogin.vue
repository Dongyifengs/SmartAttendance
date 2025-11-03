<template>
  <div class="mainBox">
    <div class="loginContainer">
      <div class="brand">
        <span
          v-for="(char, i) in '欢迎使用SmartAttendance'"
          :key="i"
          :style="{ animationDelay: i * 0.08 + 's' }"
          class="brand-char"
        >
          {{ char }}
        </span>
        <div v-if="buildInfo" class="build-info-tag">
          <span>在{{ buildInfo.date }}编译</span>
          <span>(</span>
          <a :href="buildInfo.commitUrl" class="commit-hash-link" target="_blank"
          >{{ buildInfo.hash }}</a>
          <span>)</span>
        </div>
<!--        <el-tag v-if="buildInfo" class="build-info-tag" type="danger">-->
<!--          <span>在{{ buildInfo.date }}编译</span>-->
<!--          <span>-->
<!--            (-->
<!--          </span>-->
<!--          <a :href="buildInfo.commitUrl" class="commit-hash-link" target="_blank"-->
<!--          >{{ buildInfo.hash }}</a>-->
<!--          <span>-->
<!--            )-->
<!--          </span>-->
<!--        </el-tag>-->
        <el-tag v-else type="danger">{{ isDev }}</el-tag>
      </div>

      <el-tabs
        v-model="activeTab"
        :class="activeTab === 'ocLogin' ? 'dy_item' : ''"
        class="loginTabs"
        type="card"
        @tab-change="handleTabChange"
      >
        <el-tab-pane label="智慧考勤登录" name="zhkqLogin">
          <div class="tab-content" :class="{ 'animate-enter': isAnimating }">
            <el-form :model="zhkqForm" class="loginForm" @submit.prevent="onLogin(1)">
              <el-form-item prop="username">
                <el-input
                    v-model="zhkqForm.username"
                    :prefix-icon="User"
                    clearable
                    placeholder="请输入学号"
                    class="form-input"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                    v-model="zhkqForm.password"
                    :prefix-icon="Lock"
                    clearable
                    placeholder="请输入密码"
                    show-password
                    type="password"
                    class="form-input"
                />
              </el-form-item>
              <div class="build-info-tag" style="text-align: center">
                <span>手机拨号键</span>
                <a href="#" class="commit-hash-link">{{'*#06#'}}</a>
                <span>的IMEI1</span>
              </div>
              <el-form-item prop="deviceId">
                <el-input
                    v-model="zhkqForm.deviceId"
                    :prefix-icon="Cellphone"
                    clearable
                    placeholder="请输入设备ID"
                    class="form-input"
                />
              </el-form-item>
              <el-button
                  class="loginBtn"
                  round
                  size="large"
                  style="width: 100%"
                  type="primary"
                  @click="onLogin(1)"
              >
                登录智慧考勤
              </el-button>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="一卡通账号登录" name="ocLogin">
          <div class="tab-content" :class="{ 'animate-enter': isAnimating }">
            <el-form :model="ocForm" class="loginForm" @submit.prevent="onLogin(2)">
              <el-form-item prop="username">
                <el-input
                    v-model="ocForm.username"
                    :prefix-icon="User"
                    clearable
                    placeholder="请输入考生号"
                    class="form-input"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                    v-model="ocForm.password"
                    :prefix-icon="Lock"
                    clearable
                    placeholder="请输入密码"
                    show-password
                    type="password"
                    class="form-input"
                />
              </el-form-item>
              <el-button
                  class="loginBtn"
                  round
                  size="large"
                  style="width: 100%"
                  type="primary"
                  @click="onLogin(2)"
              >
                登录一卡通
              </el-button>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { Cellphone, Lock, User } from '@element-plus/icons-vue';
  import { OC_LOGIN } from '@/api/ocAPI';
  import { ZHKQ_Login } from '@/api/anlaxy';
  import router from '@/router';

  // 开发环境
  const isDev = import.meta.env.VITE_TEXT;

  const isAnimating = ref(false)
  const handleTabChange = () => {
    // 开始动画
    isAnimating.value = true
    // 动画结束后移除类（需与CSS动画时长一致）
    setTimeout(() => {
      isAnimating.value = false
    }, 1000)
  }

  // 构建信息（生产环境）
  const buildInfo = computed(() => {
    const buildDate = import.meta.env.VITE_BUILD_DATE;
    const gitHash = import.meta.env.VITE_GIT_HASH;
    const gitFullHash = import.meta.env.VITE_GIT_FULL_HASH;
    const githubRepo = import.meta.env.VITE_GITHUB_REPO;

    if (buildDate && gitHash && gitFullHash && githubRepo) {
      return {
        date: buildDate,
        hash: gitHash,
        commitUrl: `${githubRepo}/commit/${gitFullHash}`,
      };
    }
    return null;
  });

  const activeTab = ref('zhkqLogin');
  const zhkqForm = ref({
    username: '',
    password: '',
    deviceId: '',
  });
  const ocForm = ref({
    username: '',
    password: '',
  });

  // 四小时（毫秒）
  const FOUR_HOURS = 4 * 60 * 60 * 1000;
  // 获取当前时间戳
  const getTimestamp = () => new Date().getTime();

  // 1. 自动填充表单（优先localStorage，其次环境变量）
  function fillFormFromStorage() {
    // 智慧考勤
    const zhkqAccount = localStorage.getItem('SA-ZHKQ-ACCOUNT');
    if (zhkqAccount) {
      try {
        const account = JSON.parse(zhkqAccount);
        zhkqForm.value.username = account.username || '';
        zhkqForm.value.password = account.password || '';
        zhkqForm.value.deviceId = account.deviceId || '';
      } catch (e) {
        console.error(e);
      }
    } else {
      zhkqForm.value.username = import.meta.env.VITE_ZHKQAPI_USERNAME || '';
      zhkqForm.value.password = import.meta.env.VITE_ZHKQAPI_PASSWORD || '';
      zhkqForm.value.deviceId = import.meta.env.VITE_ZHKQAPI_DEVICEID || '';
    }
    // 一卡通
    const ocAccount = localStorage.getItem('SA-OC-ACCOUNT');
    if (ocAccount) {
      try {
        const account = JSON.parse(ocAccount);
        ocForm.value.username = account.username || '';
        ocForm.value.password = account.password || '';
      } catch (e) {
        console.error(e);
      }
    } else {
      ocForm.value.username = import.meta.env.VITE_OC_USERNAME || '';
      ocForm.value.password = import.meta.env.VITE_OC_PASSWORD || '';
    }
  }

  // 2. 超时自动登录
  function autoLoginIfExpired() {
    checkZHKQLogin();
    checkOCLogin();
  }

  // 检查智慧考勤登录状态
  function checkZHKQLogin() {
    const zhkqTimestamp = Number(localStorage.getItem('SA-ZHKQ-TIMESTAMP') || '0');
    if (getTimestamp() - zhkqTimestamp > FOUR_HOURS) {
      onLogin(1);
    }
  }

  // 检查一卡通登录状态
  function checkOCLogin() {
    const ocTimestamp = Number(localStorage.getItem('SA-OC-TIMESTAMP') || '0');
    if (getTimestamp() - ocTimestamp > FOUR_HOURS) {
      onLogin(2);
    }
  }

  // 3. 登录事件（成功后自动保存账户信息和时间戳）
  function onLogin(type: 1 | 2) {
    if (type == 1) {
      if (!zhkqForm.value.username || !zhkqForm.value.password || !zhkqForm.value.deviceId) {
        ElMessage.warning('请填写完整信息！');
        return;
      } else {
        ZHKQ_Login({
          userid: zhkqForm.value.username,
          userpwd: zhkqForm.value.password,
          client_local_id: zhkqForm.value.deviceId,
        }).then(async (res) => {
          if (res.state === '1') {
            ElMessage.success('智慧考勤登录成功！');
            localStorage.setItem('SA-ZHKQ-USERINFO', JSON.stringify(res));
            localStorage.setItem('SA-ZHKQ-TIMESTAMP', getTimestamp().toString());
            localStorage.setItem(
              'SA-ZHKQ-ACCOUNT',
              JSON.stringify({
                username: zhkqForm.value.username,
                password: zhkqForm.value.password,
                deviceId: zhkqForm.value.deviceId,
              })
            );
            // 检查一卡通是否已登录
            if (localStorage.getItem('SA-OC-USERINFO')) {
              await router.push('/home');
            } else {
              activeTab.value = 'ocLogin';
            }
          } else {
            ElMessage.error('智慧考勤登录失败：' + res.info);
          }
        });
      }
    } else if (type == 2) {
      if (!ocForm.value.username || !ocForm.value.password) {
        ElMessage.warning('请填写完整信息！');
        return;
      } else {
        OC_LOGIN(ocForm.value.username, ocForm.value.password).then(async (res) => {
          if (res.code === 200) {
            ElMessage.success('登录成功！');
            localStorage.setItem('SA-OC-USERINFO', JSON.stringify(res));
            localStorage.setItem('SA-OC-TIMESTAMP', getTimestamp().toString());
            localStorage.setItem(
              'SA-OC-ACCOUNT',
              JSON.stringify({
                username: ocForm.value.username,
                password: ocForm.value.password,
              })
            );
            // 检查智慧考勤是否已登录
            if (localStorage.getItem('SA-ZHKQ-USERINFO')) {
              await router.push('/home');
            } else {
              activeTab.value = 'zhkqLogin';
            }
          } else {
            ElMessage.error('一卡通登录失败：' + res.msg);
          }
        });
      }
    }
  }

  // 页面加载时自动填充+自动登录
  onMounted(() => {
    fillFormFromStorage();
    autoLoginIfExpired();
  });
</script>

<style scoped>
  @import 'style/index.css';
</style>
