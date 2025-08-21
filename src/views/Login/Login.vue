<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">智能签到系统</h2>
      <el-form :model="LoginForm" class="login-form">
        <el-form-item>
          <el-input v-model="LoginForm.Username" placeholder="请输入账号" prefix-icon="User"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="LoginForm.DeviceId" placeholder="请输入设备ID" prefix-icon="Cpu"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="LoginForm.Password" placeholder="请输入密码" show-password prefix-icon="Lock"/>
        </el-form-item>
        <div class="options">
          <el-checkbox v-model="LoginForm.Remember">记住账号</el-checkbox>
        </div>

        <el-button type="primary" class="submit-btn" @click="UserLoginSubmit()">提交</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {UserLoginSubmit, UserSaveForm} from "./Script/Function.ts";
import {LoginForm} from "./Script/Defined.ts";

onMounted(() => {
  UserSaveForm()
});
</script>

<style scoped>
@import "Style/Style.css";
</style>
