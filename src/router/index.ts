import { createRouter, createWebHashHistory } from "vue-router";

import Login from '../views/Login/Login.vue'
import Index from '../views/Index/Index.vue'
import Home from '../views/Home/Home.vue'
import Error from '../views/404/404.vue'

// 路由配置
export const routes = [
    {
        path: '/',
        component: Index,
        meta: {
            requiresAuth: true,
            title: "Index"
        }
    },
    {
        path: '/404',
        component: Error,
        meta: {
            requiresAuth: true,
            title: "404"
        }
    },
    {
        path: '/home',
        component: Home,
        meta: {
            requiresAuth: true,
            title: "Home"
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            requiresAuth: true,
            title: "Index"
        }
    },
]
// 实例
const router = createRouter({// 创建路由
    history: createWebHashHistory(),// 路由模式
    routes// 路由配置数组
});

export default router;