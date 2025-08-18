<template>
  <div class="LoginBox">
    <el-input v-model="InputUser" type="text" placeholder="请输入账号"/>
    <el-input v-model="InputDeviceID" type="text" placeholder="请输入设备ID"/>
    <el-input v-model="InputPassword" type="password" placeholder="请输入密码"/>
    <el-button @click="ClickButton()" type="primary" native-type="submit">提交</el-button>
  </div>
</template>

<script setup lang="ts">
import { InputUser, InputDeviceID, InputPassword} from "./Script/Defined.ts";
import { ClickButton } from "./Script/Function.ts";
</script>

<style scoped>

</style>
