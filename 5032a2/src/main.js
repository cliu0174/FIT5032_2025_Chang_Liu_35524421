// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Firebase导入
import { onAuthStateChange, syncUserToLocalStorage } from './utils/firebase'

import './assets/styles.css'
import { initializeHealthcareData } from './utils/initData.js'

// 应用启动时初始化数据
initializeHealthcareData()

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Firebase认证状态监听
let authInitialized = false

// 任意全局可执行处(例如 main.js 顶部附近)
const origSetItem = localStorage.setItem;
localStorage.setItem = function(k, v) {
  console.log('[LS:set]', k, v, new Error().stack.split('\n')[2]?.trim());
  return origSetItem.apply(this, arguments);
};

onAuthStateChange(async (user) => {
  console.log('🔥 Auth state changed:', user ? 'User logged in' : 'User logged out')

  // 同步用户状态到localStorage
  await syncUserToLocalStorage(user)

  // 首次初始化时，如果用户已登录且在需要认证的页面，不重定向
  if (!authInitialized) {
    authInitialized = true
    console.log('🔥 Firebase auth initialized')
  }
})

app.mount('#app')
