<template>
  <div id="app">
    <Header @login="showLogin = true" :current-user="currentUser" @logout="handleLogout" />

    <main class="main-content">
      <router-view :current-user="currentUser" @user-updated="handleUserUpdate" />
    </main>

    <Footer />

    <!-- Enhanced Login Modal -->
    <div v-if="showLogin" class="modal-overlay" @click="showLogin = false">
      <div class="modal-content" @click.stop>
        <LoginForm @login-success="handleLoginSuccess" @close="showLogin = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import LoginForm from './components/LoginForm.vue'
import { getStoredUser, clearStoredUser } from './utils/storage.js'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    LoginForm
  },
  setup() {
    const currentUser = ref(null)
    const showLogin = ref(false)

    const handleLoginSuccess = (user) => {
      currentUser.value = user
      showLogin.value = false
    }

    const handleLogout = () => {
      clearStoredUser()
      currentUser.value = null
    }

    const handleUserUpdate = (updatedUser) => {
      currentUser.value = updatedUser
    }

    onMounted(() => {
      const stored = getStoredUser()
      if (stored) {
        currentUser.value = stored
      }
    })

    return {
      currentUser,
      showLogin,
      handleLoginSuccess,
      handleLogout,
      handleUserUpdate
    }
  }
}
</script>

<style>
/* 导入Google字体 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 主要颜色 */
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #3b82f6;
  --secondary: #10b981;
  --accent: #f59e0b;
  --danger: #ef4444;
  --success: #22c55e;
  --warning: #f59e0b;

  /* 中性色 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* 渐变 */
  --gradient-primary: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  --gradient-secondary: linear-gradient(135deg, var(--secondary) 0%, #34d399 100%);
  --gradient-warm: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);

  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

  /* 圆角 */
  --radius-sm: 0.375rem;
  --radius: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--gray-800);
  background: var(--gray-50);
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  padding-top: 80px;
  position: relative;
}

/* 增强的模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: white;
  border-radius: var(--radius-xl);
  padding: 0;
  width: 90%;
  max-width: 450px;
  box-shadow: var(--shadow-xl);
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
}

/* 全局按钮样式增强 */
.btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  white-space: nowrap;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--gradient-secondary);
  color: white;
  box-shadow: var(--shadow);
}

.btn-outline-primary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-outline-primary:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 卡片样式增强 */
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-200);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--gray-300);
}

/* 表单样式增强 */
.form-control, .form-select {
  border: 2px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus, .form-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: white;
}

.form-control.is-invalid, .form-select.is-invalid {
  border-color: var(--danger);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 70px;
  }

  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--gray-100);
}

::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gray-400);
}

/* 选择文本样式 */
::selection {
  background: rgba(37, 99, 235, 0.2);
  color: var(--gray-900);
}

/* 焦点样式 */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* 加载动画 */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 辅助类 */
.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bg-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgba(37, 99, 235, 0.1) 1px, transparent 0);
  background-size: 20px 20px;
}
</style>
