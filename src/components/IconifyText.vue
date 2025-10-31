<script lang="ts" setup>

import type {Component} from "vue";

const {icon, color = 'gray'} = defineProps<{ icon: Component, color?: string }>()
</script>

<template>
  <div class="icon-text-container">
    <el-icon :color="color">
      <component :is="icon"/>
    </el-icon>
    <slot name="default"/>
  </div>
</template>

<style scoped>
.icon-text-container {
  display: flex;
  align-items: center;
}
</style>