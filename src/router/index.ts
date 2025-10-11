import {createRouter, createWebHashHistory} from "vue-router";

import Login from "../view/Login/Login.vue";
import Home from "../view/Home/Home.vue"
import ClassListDev from "../view/ZHKQ-DEV/ClassListDev.vue"
import AttendanceDev from "../view/ZHKQ-DEV/AttendanceDev.vue";
import LeaveDev from "../view/ZHKQ-DEV/LeaveDev.vue"

// 路由配置
export const routes = [
    {
        path: '/',
        component: Login,
        meta: {
            requiresAuth: true,
            title: "登录"
        },
    },
    {
        path: '/home',
        component: Home,
        meta: {
            requiresAuth: true,
            title: "主页"
        },
    },
    {
        path: '/classListDev',
        component: ClassListDev,
        meta: {
            requiresAuth: true,
            title: "开发者课程详细列表"
        }
    },
    {
        path: '/AttendanceDev',
        component: AttendanceDev,
        meta: {
            requiresAuth: true,
            title: "开发者考勤列表"
        }
    },
    {
        path: '/LeaveDev',
        component: LeaveDev,
        meta: {
            requiresAuth: true,
            title: "开发者请假列表"
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