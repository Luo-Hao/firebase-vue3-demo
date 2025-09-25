import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import DefaultLayouts from '../layouts/DefaultLayouts.vue'
import Login from '../components/auth/Login.vue'
import Register from '../components/auth/Register.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: DefaultLayouts,
    meta: { title: 'Home' }
  },
  {
    path: '/about',
    name: 'about',
    component: DefaultLayouts,
    meta: { title: 'About' }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { title: '注册', requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router