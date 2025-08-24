import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Services from '../views/Services.vue'
import Appointment from '../views/Appointment.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'
import Register from '@/views/Register.vue'
import Unauthorized from '@/views/Unauthorized.vue'

import RatingPage from '@/views/Rating.vue'

// import ContactForm from '@/views/ContactForm.vue'

// 辅助：从 localStorage 取当前角色
function getCurrentRole() {
  return localStorage.getItem('currentRole')
}

const routes = [
  // 公开页面
  { path: '/',          component: Home },
  { path: '/services',  component: Services },
  { path: '/contact',   component: Contact },
  // { path: '/contactUs', component: ContactForm },
  // 需要登录（任意角色都行）
  {
    path: '/appointment',
    component: Appointment,
    meta: { requiresAuth: true, allowedRoles: ['admin', 'guest'] }
  },

  // 评分页面 - 需要登录（任意角色都可以评分）
  {
    path: '/rating/:service',
    name: 'Rating',
    component: RatingPage,
    props: true,
    meta: { requiresAuth: true, allowedRoles: ['admin', 'guest'] }
  },

  // 仅 admin 可见
  {
    path: '/admin-dashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] }
  },

  // 登录/注册/未授权
  { path: '/login',        component: Login },
  { path: '/register',     component: Register },
  { path: '/unauthorized', component: Unauthorized },

  // 兜底
  { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const role       = getCurrentRole()

  // 不需要登录的页面直接放行
  if (!to.meta.requiresAuth) {
    return next()
  }

  // 需要登录但没登录——去登录页
  if (!isLoggedIn) {
    return next('/login')
  }

  // 需要特定角色
  const allowed = to.meta.allowedRoles
  if (allowed && !allowed.includes(role)) {
    return next('/unauthorized')
  }

  // 一切 OK
  next()
})

export default router
