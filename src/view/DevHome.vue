<script setup lang="ts">
import dayjs from "dayjs";
import type {ClassInfo} from "@/components/ClassCard.vue";
import {onMounted, ref} from "vue";
import ClassContainer from "@/components/ClassContainer.vue";
import {getDaySignList, ZHKQ_GetDayCourseList} from "@/API/zhkqAPI/index.ts";
import {getZHKQUserInfo} from '../API/zhkqAPI/Function/Function'

const userInfo = getZHKQUserInfo();
const data = ref<ClassInfo[]>([]);
const todayString = dayjs().format("YYYY-MM-DD")
onMounted(async () => {
  if (userInfo) {
    const signInfo = (await getDaySignList(todayString, userInfo.value!.token)).sign_record_list
    const courseList = (await ZHKQ_GetDayCourseList(todayString, userInfo.value!.token)).sourcelist;
    const signMap = new Map(signInfo.map(e => [e.pk_lesson, e]));
    data.value = courseList.map((e, index): ClassInfo | null => {
      const signData = signMap.get(e.pk_anlaxy_lesson);
      if (signData) {
        return {
          classIndex: index + 1,
          className: e.lesson_name,
          startTime: dayjs(e.begin_time),
          endTime: dayjs(e.end_time),
          signInTime: e ? dayjs(signData.u_begin_time) : null,
          signOutTime: e ? dayjs(signData.u_end_time) : null,
          shouldSignInTime: dayjs(signData.before_class_time),
          shouldSignOutTime: dayjs(signData.after_class_time),
          classRoom: e.class_room_name,
          teacher: {
            name: e.teacher_name,
            id: Number.parseInt(e.teacher_id)
          },
          situation: signData.absent_num ? "缺勤" : signData.late_num ? "迟到" : signData.leave_num ? "早退" : signData.ask_leave_num ? "请假" : null
        }
      }
      return null;
    }).filter(e => !!e);
  }
})

</script>

<template>
  <class-container v-model="data"></class-container>
</template>

<style scoped>

</style>