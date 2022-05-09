import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/plugins/firebase'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () =>
            import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    },
    {
        path: '/admin',
        name: 'Admin',
        beforeEnter: async (to, from, next) => {
            await new Promise<void>(() => {
                onAuthStateChanged(auth, (u) => {
                    if (u !== null) next()
                    else next('/login')
                })
            })
        },
        component: () =>
            import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
