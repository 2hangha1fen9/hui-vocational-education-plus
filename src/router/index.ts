import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        redirect: "/user",
        children: [
            {
                path: "user",
                name: "user",
                component: () => import("@/views/UserInfo.vue")
            },
            {
                path: "checkin",
                name: "checkin",
                component: () => import("@/views/CheckIn.vue")
            }
            ,
            {
                path: "logs",
                name: "info",
                component: () => import("@/views/LogInfo/LogInfo.vue")
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
