import {createRouter, createWebHashHistory} from "vue-router";

// 路由配置
export const routes = [
    {
        path: '/',
        component: () => import("@/view/login/Login.vue"),
        meta: {
            requiresAuth: true,
            title: "登录"
        },
    },
    {
        path: '/home',
        component: () => import("@/view/home/Home.vue"),
        meta: {
            requiresAuth: true,
            title: "主页"
        },
    },
    {
        path: '/classListDev',
        component: () => import("@/view/anlaxy-dev/ClassListDev.vue"),
        meta: {
            requiresAuth: true,
            title: "开发者课程详细列表"
        }
    },
    {
        path: '/AttendanceDev',
        component: () => import("@/view/anlaxy-dev/AttendanceDev.vue"),
        meta: {
            requiresAuth: true,
            title: "开发者考勤列表"
        }
    },
    {
        path: '/LeaveDev',
        component: () => import("@/view/anlaxy-dev/LeaveDev.vue"),
        meta: {
            requiresAuth: true,
            title: "开发者请假列表"
        }
    },
    {
        path: "/dev/home",
        component: () => import("@/view/DevHome.vue"),
        meta: {
            requiresAuth: true,
            title: "开发者主页"
        }
    }
]

// 实例
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
router.beforeEach((to) => {
    if (to.meta.title) {
        document.title = to.meta.title as string;
    }
})
export default router;