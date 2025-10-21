<script setup lang="ts">
import ClassCard, {type ClassInfo} from "@/components/ClassCard.vue";

const data = defineModel<ClassInfo[]>({required: true});
</script>

<template>
<div class="class-list-container">
  <class-card v-for="(_, index) of data" v-model="data[index]"></class-card>
</div>
</template>

<style scoped>
.class-list-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 10px;
  justify-content: center;
}
</style>