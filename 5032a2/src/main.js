import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/styles.css'
import { initializeHealthcareData } from './utils/initData.js'

// 应用启动时初始化数据
initializeHealthcareData()
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
