// router/index.js - Vue Router配置
// 满足Category C要求：角色权限管理

import { createRouter, createWebHistory } from 'vue-router'
import { getStoredUser } from '../utils/storage.js'

// 页面组件导入
import Home from '../views/Home.vue'
import Services from '../views/Services.vue'
import Dashboard from '../views/Dashboard.vue'
import Admin from '../views/Admin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/services',
    name: 'Services',
    component: Services
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // 需要登录
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      requiresAdmin: true // 需要管理员权限
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 (满足Category C要求：角色权限)
router.beforeEach((to, from, next) => {
  const user = getStoredUser()

  // 检查是否需要登录
  if (to.meta.requiresAuth && !user) {
    alert('Please log in to access this page.')
    next('/')
    return
  }

  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    alert('Access denied. Admin privileges required.')
    next('/dashboard')
    return
  }

  next()
})

export default router
