<template>
  <div>Home</div>
  <el-button type="danger" @click="outLogin">退出登录</el-button>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import {detectAccountData,outLogin} from "./Script/Function.ts";

onMounted(() => {
  detectAccountData()
})
</script>

<style scoped>

</style>