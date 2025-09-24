import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import DefaultLayouts from '../layouts/DefaultLayouts.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router