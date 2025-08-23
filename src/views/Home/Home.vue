<template>
  <div>
    <div>Home</div>
    <el-button type="danger" @click="outLogin">退出登录</el-button><br>

    <div v-if="Object.keys(UserInfoData).length">
      <h3>用户信息</h3>
      <span>生日：{{UserInfoData.birthday}}</span><br>
      <span>性别：{{UserInfoData.sex}}</span><br>
      <span>{{UserInfoData.orgList[2].orgName}}：{{UserInfoData.orgList[1].orgName}}</span><br>
      <span>{{UserInfoData.orgList[3].orgName}}：{{UserInfoData.orgList[0].orgName}}</span><br>
      <span>学号：{{UserInfoData.user_code}}</span><br>
      <span>PKUser：{{UserInfoData.pk_user}}</span><br>
      <span>PKTeacher：{{UserInfoData.pk_teacher}}</span><br>
      <span>登录时间：{{UserInfoData.curryDate}}</span><br>
      <span>Token：{{UserInfoData.token}}</span><br>
      <span>客户端ID：{{UserInfoData.client_id}}</span><br>
      <span>用户登录Key：{{UserInfoData.user_singlekey}}</span><br>
      <span>脸部ID：{{UserInfoData.face_id}}</span><br>
      <span>用户名称：{{UserInfoData.user_name}}</span><br>
      <span>用户手机：{{UserInfoData.user_phone}}</span><br>
    </div>

    <div v-if="Object.keys(LoginFromData).length">
      <h3>登录信息</h3>
      <p>登录时间: {{ LoginFromData.LoginTime }}</p>
      <p>登录设备: {{ LoginFromData.deviceId }}</p>
      <p>登录账号: {{ LoginFromData.username }}</p>
      <p>登录密码: {{ LoginFromData.password }}</p>
      <p>是否自动登录: {{ LoginFromData.Remember }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { detectAccountData, outLogin } from './Script/Function.ts';
import { LoginFromData, UserInfoData } from './Script/Defined.ts';

onMounted(() => {
  detectAccountData();
});
</script>

<style scoped>
</style>