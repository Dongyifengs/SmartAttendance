import {createRouter, createWebHashHistory} from "vue-router";

import Login from "../view/Login/login.vue";

// 路由配置
export const routes = [
    {
        path: '/',
        component: Login,
        meta: {
            requiresAuth: true,
            title: "Login"
        },
    }
]

// 实例
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 路由守卫
export default router;