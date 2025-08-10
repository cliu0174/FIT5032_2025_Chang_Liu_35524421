import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth.js' // 或者 '@/composables/useAuth.js'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import AccessDenied from '@/views/AccessDenied.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import AddBookView from '@/views/AddBookView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPI from '@/views/CountBookAPI.vue'

import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import LogoutView from '@/views/FirebaseLogoutView.vue'
const routes = [
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView
  },
  {
    path: '/WeatherCheck',
    name: 'WeatherCheck',
    component: WeatherView
  },
  {
    path: '/CountbookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Home - Library App'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      requiresAuth: true, // 需要认证的路由
      title: 'About - Library App'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: 'Login - Library App',
      hideWhenAuthenticated: true // 已登录时隐藏登录页面
    }
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDenied,
    meta: {
      title: 'Access Denied - Library App'
    }
  },
  {
    // 404 页面重定向
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫：检查认证状态
router.beforeEach((to, from, next) => {
  const { checkAuth } = useAuth()
  const isAuthenticated = checkAuth()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 如果路由需要认证
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // 未认证，重定向到登录页面，并保存原始目标
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // 如果已经登录且试图访问登录页面，重定向到首页
  if (to.meta.hideWhenAuthenticated && isAuthenticated) {
    next('/')
    return
  }
  
  // 允许访问
  next()
})

// 路由后置守卫：用于清理或日志记录
router.afterEach((to, from) => {
  // 可以在这里添加页面访问日志或其他后置处理
  console.log(`Navigated from ${from.path} to ${to.path}`)
})

export default router