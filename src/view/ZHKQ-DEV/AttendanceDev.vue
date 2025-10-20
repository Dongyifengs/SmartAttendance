<template>
  <div class="attendance-page">
    <div class="header">
      <el-text>AttendanceDev - 考勤查询页面</el-text>
      <el-button class="ml-2" type="default" @click="$router.back()">返回上一页</el-button>
    </div>

    <div class="user-info">
      <el-text>当前用户班级：{{ userClass || "加载中..." }}</el-text>
      <br/>
      <el-text>当前用户班级ID：{{ userClassID || "加载中..." }}</el-text>
    </div>

    <!-- 控制显示按钮 -->
    <el-button
        v-if="students.length > 4"
        class="mt-3 mb-2"
        size="small"
        type="primary"
        @click="toggleShowAll"
    >
      {{ showAll ? "收起" : "显示全部" }}
    </el-button>

    <!-- 学生信息表格 -->
    <el-table
        v-if="students.length"
        :data="displayedStudents"
        border
        size="small"
        stripe
        style="width: 100%"
    >
      <el-table-column label="学号" prop="user_code" width="120"/>
      <el-table-column label="姓名" prop="user_name" width="100"/>
      <el-table-column label="EAS ID" min-width="200" prop="easid"/>
      <el-table-column label="UserPK" min-width="200" prop="userpk"/>
      <el-table-column
          :formatter="formatFriendStatus"
          label="是否好友"
          prop="is_friends"
          width="100"
      />
      <el-table-column label="性别" prop="sex" width="80"/>
    </el-table>

    <el-empty v-else class="mt-5" description="暂无学生信息"/>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {getClassStudent, getUserClass} from "../../API/zhkqAPI";

interface Student {
  user_code: string;
  user_name: string;
  easid: string;
  userpk: string;
  is_friends: number;
  sex: string;
}

const userClass = ref<string>("");
const userClassID = ref<string>("");
const students = ref<Student[]>([]);
const showAll = ref(false);

// 获取用户 Token（一次封装）
const getUserToken = (): string => {
  try {
    const info = localStorage.getItem("SA-ZHKQ-USERINFO");
    return info ? JSON.parse(info).token || "" : "";
  } catch {
    console.warn("用户 Token 解析失败");
    return "";
  }
};

// 是否好友格式化
const formatFriendStatus = (_: any, __: any, cellValue: number) =>
    cellValue === 1 ? "是" : "否";

// 切换展示模式
const toggleShowAll = () => (showAll.value = !showAll.value);

// 控制显示的学生（展示前2个与后2个）
const displayedStudents = computed(() => {
  const list = students.value;
  if (showAll.value || list.length <= 4) return list;
  return [...list.slice(0, 2), ...list.slice(-2)];
});

// 加载班级与学生信息
const loadUserClassAndStudents = async () => {
  const token = getUserToken();
  if (!token) {
    console.warn("未获取到用户 Token");
    return;
  }

  try {
    const classRes = await getUserClass(token);
    const classInfo = classRes.class_list?.[0];
    if (!classInfo) {
      console.warn("未获取到班级信息");
      return;
    }

    userClass.value = classInfo.class_name;
    userClassID.value = classInfo.class_id;

    const studentRes = await getClassStudent(token, classInfo.class_id);
    students.value = studentRes.group_members || [];
    console.info("班级学生信息加载成功:", students.value);
  } catch (err) {
    console.error("加载班级或学生信息失败:", err);
  }
};

onMounted(loadUserClassAndStudents);
</script>

<style scoped>
.attendance-page {
  padding: 20px;
  font-size: 14px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-info {
  margin-top: 10px;
  margin-bottom: 15px;
}

.ml-2 {
  margin-left: 10px;
}

.mt-3 {
  margin-top: 10px;
}

.mb-2 {
  margin-bottom: 10px;
}

.mt-5 {
  margin-top: 40px;
}
</style>
