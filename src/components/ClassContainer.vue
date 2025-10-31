<script lang="ts" setup>
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
  padding: 0;
  animation: containerFadeIn 0.5s ease-out;
}

@keyframes containerFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .class-list-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>