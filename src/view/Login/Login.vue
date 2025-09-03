<template>
  <div class="mainBox">
    <div class="loginContainer">

      <div class="brand">
        <span v-for="(char, i) in '欢迎使用SmartAttendance'" :key="i" class="brand-char"
              :style="{ animationDelay: (i * 0.08) + 's' }">
          {{ char }}
        </span>
        <el-tag type="danger">{{ isDev }}</el-tag>
      </div>


      <el-tabs v-model="activeTab" type="card" class="loginTabs" :class="activeTab === 'ocLogin' ? 'dy_item' : ''">

        <el-tab-pane label="智慧考勤登录" name="zhkqLogin">
          <el-form :model="zhkqForm" class="loginForm" @submit.prevent="onLogin(1)">
            <el-form-item prop="username">
              <el-input v-model="zhkqForm.username" placeholder="请输入学号" :prefix-icon="User" clearable/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="zhkqForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock"
                        show-password clearable/>
            </el-form-item>
            <el-alert title="手机拨号键*#06#的IMEI1" type="warning" :closable="false" center/>
            <el-form-item prop="deviceId">
              <el-input v-model="zhkqForm.deviceId" placeholder="请输入设备ID" :prefix-icon="Cellphone" clearable/>
            </el-form-item>
            <el-button class="loginBtn" type="primary" round @click="onLogin(1)" size="large" style="width:100%">
              登录智慧考勤
            </el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="一卡通账号登录" name="ocLogin">
          <el-form :model="ocForm" class="loginForm" @submit.prevent="onLogin(2)">
            <el-form-item prop="username">
              <el-input v-model="ocForm.username" placeholder="请输入考生号" :prefix-icon="User" clearable/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="ocForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock"
                        show-password clearable/>
            </el-form-item>
            <el-button class="loginBtn" type="primary" round @click="onLogin(2)" size="large" style="width:100%">
              登录一卡通
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {User, Lock, Cellphone} from "@element-plus/icons-vue";
import {OC_LOGIN} from "../../API/ocAPI";
import {ZHKQ_LOGIN} from '../../API/zhkqAPI';
import router from "../../router";

// 开发环境
const isDev = import.meta.env.VITE_TEXT
const activeTab = ref('zhkqLogin')
const zhkqForm = ref({
  username: import.meta.env.VITE_ZHKQAPI_USERNAME || '',
  password: import.meta.env.VITE_ZHKQAPI_PASSWORD || '',
  deviceId: import.meta.env.VITE_ZHKQAPI_DEVICEID || ''
})
const ocForm = ref({
  username: import.meta.env.VITE_OC_USERNAME || '',
  password: import.meta.env.VITE_OC_PASSWORD || ''
})

// 获取当前时间戳（毫秒级）
const getTimestamp = () => {
  return new Date().getTime()
}

// 登录按钮登录事件
function onLogin(type: 1 | 2) {
  if (type === 1) {
    // 判断信息是否填写完整
    if (!zhkqForm.value.username || !zhkqForm.value.password || !zhkqForm.value.deviceId) {
      ElMessage.warning("请填写完整信息！")
      return
    } else {
      ZHKQ_LOGIN(zhkqForm.value.username, zhkqForm.value.password, zhkqForm.value.deviceId).then(async res => {
        if (res.state === "1") {
          ElMessage.success("智慧考勤登录成功！")
          localStorage.setItem("SA-ZHKQ-USERINFO", JSON.stringify(res))
          localStorage.setItem("SA-ZHKQ-TIMESTAMP", getTimestamp().toString())
          // 检查两个数据都存在，则跳转
          if (localStorage.getItem("SA-ZHKQ-USERINFO") && localStorage.getItem("SA-OC-USERINFO")) {
            await router.push("/home")
          }
        } else {
          ElMessage.error("智慧考勤登录失败：" + res.info)
        }
      })
    }
  } else if (type === 2) {
    if (!ocForm.value.username || !ocForm.value.password) {
      ElMessage.warning("请填写完整信息！")
      return
    } else {
      OC_LOGIN(ocForm.value.username, ocForm.value.password).then(async res => {
        if (res.code === 200) {
          ElMessage.success("登录成功！")
          localStorage.setItem("SA-OC-USERINFO", JSON.stringify(res))
          localStorage.setItem("SA-OC-TIMESTAMP", getTimestamp().toString())
          // 检查两个数据都存在，则跳转
          if (localStorage.getItem("SA-ZHKQ-USERINFO") && localStorage.getItem("SA-OC-USERINFO")) {
            await router.push("/home")
          }
        } else {
          ElMessage.error("一卡通登录失败：" + res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
@import "Style/index.css";
</style>
