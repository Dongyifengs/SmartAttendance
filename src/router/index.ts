import { createRouter, createWebHashHistory } from 'vue-router';
import { ROUTE_PATHS } from '@/utils/constants';

// 路由配置
export const routes = [
  {
    path: ROUTE_PATHS.LOGIN,
    component: () => import('@/view/login/PageLogin.vue'),
    meta: {
      requiresAuth: true,
      title: '登录',
    },
  },
  {
    path: ROUTE_PATHS.HOME,
    component: () => import('@/view/home/PageHome.vue'),
    meta: {
      requiresAuth: true,
      title: '主页',
    },
  },
  {
    path: ROUTE_PATHS.CLASS_LIST_DEV,
    component: () => import('@/view/anlaxy-dev/ClassListDev.vue'),
    meta: {
      requiresAuth: true,
      title: '开发者课程详细列表',
    },
  },
  {
    path: ROUTE_PATHS.ATTENDANCE_DEV,
    component: () => import('@/view/anlaxy-dev/AttendanceDev.vue'),
    meta: {
      requiresAuth: true,
      title: '开发者考勤列表',
    },
  },
  {
    path: ROUTE_PATHS.LEAVE_DEV,
    component: () => import('@/view/anlaxy-dev/LeaveDev.vue'),
    meta: {
      requiresAuth: true,
      title: '开发者请假列表',
    },
  },
  {
    path: ROUTE_PATHS.DEV_HOME,
    component: () => import('@/view/newHome/DevHome.vue'),
    meta: {
      requiresAuth: true,
      title: '开发者主页',
    },
  },
];

// 实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
});

export default router;
