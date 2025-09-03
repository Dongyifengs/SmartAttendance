<template>
  <div class="mainBox">
    <div class="loginContainer">

      <div class="brand">欢迎使用SmartAttendance</div>

      <el-tabs v-model="activeTab" type="card" class="loginTabs" :class="activeTab === 'ocLogin' ? 'dy_item' : ''">

        <el-tab-pane label="智慧考勤登录" name="zhkqLogin">
          <el-form :model="zhkqForm" class="loginForm" @submit.prevent="onLogin(1)">
            <el-form-item prop="username">
              <el-input v-model="zhkqForm.username" placeholder="请输入学号" :prefix-icon="User" clearable/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="zhkqForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password clearable/>
            </el-form-item>
            <el-form-item prop="deviceId">
              <el-input v-model="zhkqForm.deviceId" placeholder="请输入设备ID" :prefix-icon="Cellphone" clearable/>
            </el-form-item>
            <el-button class="loginBtn" type="primary" round @click="onLogin(1)" size="large" style="width:100%">登录智慧考勤</el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="一卡通账号登录" name="ocLogin">
          <el-form :model="ocForm" class="loginForm" @submit.prevent="onLogin(2)">
            <el-form-item prop="username">
              <el-input v-model="ocForm.username" placeholder="请输入考生号" :prefix-icon="User" clearable/>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="ocForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password clearable/>
            </el-form-item>
            <el-button class="loginBtn" type="primary" round @click="onLogin(2)" size="large" style="width:100%">登录一卡通</el-button>
          </el-form>

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {User,Lock,Cellphone} from "@element-plus/icons-vue";

const activeTab = ref('zhkqLogin')
const zhkqForm = ref({username: '', password: '', deviceId: ''})
const ocForm = ref({username: '', password: ''})

function onLogin(type: 1 | 2) {
  console.log(type === 1 ? '登录智慧考勤' : '登录一卡通', type === 1 ? zhkqForm.value : ocForm.value)
}
</script>

<style scoped>
@import "Style/index.css";
</style>
