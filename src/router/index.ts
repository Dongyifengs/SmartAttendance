import {createRouter, createWebHashHistory} from "vue-router";

import Login from "../view/Login/Login.vue";
import Home from "../view/Home/Home.vue"
import ClassListDev from "../view/ClassListDev/ClassListDev.vue"

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