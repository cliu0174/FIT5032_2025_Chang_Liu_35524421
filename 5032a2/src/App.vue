<template>
  <div>
    <header class="header">
      <!-- 第一行：Logo + 登录/状态 -->
      <div class="header-top">
        <img class="logo" :src="logo" alt="HarmoNest Logo" />

        <!-- 移动端汉堡菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- 桌面端右侧内容，根据登录状态切换 -->
        <div class="header-top-right">
          <img class="login-icon" :src="loginIcon" alt="Icon" />
          <template v-if="isLoggedIn">
            <span class="welcome-text">Hello, {{ currentUser }}</span>
            <button class="auth-button" @click="onLogout">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="auth-button">Login</router-link>
            <router-link to="/register" class="auth-button">Register</router-link>
          </template>
        </div>
      </div>

      <!-- 第二行：主导航 + 管理页面入口 -->
      <nav class="header-bottom" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
        <router-link to="/" exact @click="closeMobileMenu">Home</router-link>
        <router-link to="/services" @click="closeMobileMenu">Services</router-link>
        <router-link to="/appointment" @click="closeMobileMenu">Appointment</router-link>
        <router-link to="/contact" @click="closeMobileMenu">Contact</router-link>
        <router-link v-if="currentRole === 'admin'" to="/admin-dashboard">Admin Dashboard</router-link>

        <!-- 移动端登录/注册 -->
        <div class="mobile-auth-section">
          <template v-if="isLoggedIn">
            <span class="mobile-welcome">👤 Hello, {{ currentUser }}</span>
            <button class="mobile-auth-button logout-btn" @click="onLogout">🚪 Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-auth-button" @click="closeMobileMenu">👤 Login</router-link>
            <router-link to="/register" class="mobile-auth-button" @click="closeMobileMenu">📝 Register</router-link>
          </template>
        </div>
      </nav>
    </header>

    <main><router-view/></main>

    <footer class="footer">© 2025 HarmoNest Health Foundation</footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import logo from '@/assets/logo.png'
import loginIcon from '@/assets/login-icon.png'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)

// 🔧 修改：使用响应式 ref 替代 computed
const isLoggedIn = ref(false)
const currentUser = ref('')
const currentRole = ref('')

// 🔧 新增：更新登录状态的函数
function updateAuthStatus() {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  currentUser.value = localStorage.getItem('currentUser') || ''
  currentRole.value = localStorage.getItem('currentRole') || ''
}

// 🔧 新增：组件挂载时初始化状态
onMounted(() => {
  updateAuthStatus()
})

// 🔧 新增：监听路由变化，每次路由变化时检查登录状态
watch(route, () => {
  updateAuthStatus()
})

// 🔧 新增：暴露更新函数给全局使用
window.updateAuthStatus = updateAuthStatus

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
function onLogout() {
  // 清除本地存储
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('currentRole')

  // 🔧 新增：立即更新状态
  updateAuthStatus()

  // 关闭移动端菜单
  isMobileMenuOpen.value = false
  // 使用 replace 避免回退后依然登录
  location.reload()
}
</script>

<style>
/* 只加入新样式 */
.welcome-text {
  margin-right: 1rem;
  font-weight: 500;
  color: var(--text-on-primary);
}
.btn-logout {
  background: transparent;
  border: 1px solid var(--text-on-primary);
  color: var(--text-on-primary);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity .2s;
}
.btn-logout:hover {
  opacity: 0.8;
}
</style>



<style>
/* 只加入新样式 */
.welcome-text {
  margin-right: 1rem;
  font-weight: 500;
  color: var(--text-on-primary);
}
.btn-logout {
  background: transparent;
  border: 1px solid var(--text-on-primary);
  color: var(--text-on-primary);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity .2s;
}
.btn-logout:hover {
  opacity: 0.8;
}
</style>

<style>
/* 响应式根字体大小 */
html {
  font-size: 16px;
}

/* 通用按钮和导航字体 */
.auth-button, .header-bottom a {
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

/* 整个 header */
.header {
  position: relative;
  color: var(--text-on-primary);
}

/* 第一行：响应式布局 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  flex-wrap: wrap;
}

/* Logo 响应式大小 */
.logo {
  max-height: 70px;
  height: auto;
  width: auto;
  min-height: 40px; /* 最小高度确保在小屏幕上可见 */
}

/* 移动端汉堡菜单按钮 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background: var(--primary-color);
  margin: 3px 0;
  transition: 0.3s;
}

.header-top-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* 小图标响应式 */
.login-icon {
  height: 60px;
  width: auto;
  margin-right: 1rem;
}

/* 响应式按钮 */
.auth-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  white-space: nowrap;
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif; /* 字体 */
  font-size: 1rem; /* 字号 */
  border: none; /* 重要：去掉黑色边框！ */
}


.auth-button:hover {
  opacity: 0.8;
}

/* 第二行：导航响应式 */
.header-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--primary-color);
  border-top: 1px solid rgba(255,255,255,0.2);
  flex-wrap: wrap;
}

/* 导航链接响应式 */
.header-bottom a {
  position: relative;
  padding: 1rem 1.5rem;
  color: var(--text-on-primary);
  text-decoration: none;
  transition: color .2s;
  white-space: nowrap;
}

.header-bottom a:hover {
  opacity: 0.8;
}

.header-bottom a.router-link-exact-active {
  color: #888;
}

.header-bottom a.router-link-exact-active::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #888;
}

/* 移动端登录注册区域 - 默认隐藏 */
.mobile-auth-section {
  display: none;
  width: 100%;
  flex-direction: row;
  gap: 0;
  border-top: 2px solid rgba(255,255,255,0.2);
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}

.mobile-auth-button {
  flex: 1;
  padding: 1rem;
  text-align: center;
  color: var(--text-on-primary);
  text-decoration: none;
  font-weight: 600;
  background: rgba(255,255,255,0.1);
  margin: 0 0.25rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255,255,255,0.2);
  cursor: pointer;
}

.mobile-auth-button:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

/* 移动端欢迎信息 */
.mobile-welcome {
  flex: 1;
  padding: 1rem;
  text-align: center;
  color: var(--text-on-primary);
  font-weight: 600;
  background: rgba(255,255,255,0.1);
  margin: 0 0.25rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 0.95rem;
}

/* 移动端退出按钮 */
.logout-btn {
  background: rgba(220, 53, 69, 0.2) !important;
  border-color: rgba(220, 53, 69, 0.4) !important;
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.3) !important;
}

/* Footer 响应式 */
.footer {
  text-align: center;
  padding: 1rem;
  background: var(--primary-color);
  color: var(--text-on-primary);
}

/* 平板设备适配 (768px - 1024px) */
@media (max-width: 1024px) {
  .header-top {
    padding: 0.5rem 1rem;
  }

  .logo {
    max-height: 60px;
  }

  .login-icon {
    height: 50px;
    margin-right: 0.5rem;
  }

  .header-bottom a {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
}

/* 移动设备适配 (最大768px) */
@media (max-width: 768px) {
  .header-top {
    padding: 0.5rem 1rem;
    position: relative;
  }

  .logo {
    max-height: 50px;
  }

  /* 显示汉堡菜单按钮 */
  .mobile-menu-btn {
    display: flex;
    order: 3;
  }

  /* 隐藏桌面端右侧内容 */
  .header-top-right {
    display: none;
  }

  /* 移动端导航菜单 */
  .header-bottom {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--primary-color);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .header-bottom.mobile-menu-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .header-bottom a {
    width: 100%;
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .header-bottom a:last-child {
    border-bottom: none;
  }

  /* 显示移动端登录注册区域 */
  .mobile-auth-section {
    display: flex;
  }

  /* 移动端登录注册按钮样式调整 */
  .mobile-auth-button {
    font-size: 0.95rem;
    padding: 1.2rem 1rem;
  }
}

/* 小屏幕移动设备 (最大480px) */
@media (max-width: 480px) {
  .header-top {
    padding: 0.5rem;
  }

  .logo {
    max-height: 40px;
  }

  .auth-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
    margin-left: 0.25rem;
  }

  .login-icon {
    height: 40px;
    margin-right: 0.5rem;
  }

  .footer {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  /* 小屏幕上的移动端按钮 */
  .mobile-auth-button {
    font-size: 0.9rem;
    padding: 1rem 0.5rem;
    margin: 0 0.1rem;
  }
}

/* 超小屏幕 (最大320px) */
@media (max-width: 320px) {
  .header-top {
    padding: 0.25rem;
  }

  .logo {
    max-height: 35px;
  }

  .auth-button {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }

  .login-icon {
    height: 35px;
  }

  .mobile-auth-button {
    font-size: 0.85rem;
    padding: 0.9rem 0.3rem;
  }
}

/* 打印样式 */
@media print {
  .mobile-menu-btn {
    display: none;
  }

  .header-bottom {
    position: static;
    transform: none;
    opacity: 1;
    visibility: visible;
  }

  .mobile-auth-section {
    display: none;
  }
}
/* 只加入新样式 */
.welcome-text {
  margin-right: 1rem;
  font-weight: 500;
  color: var(--text-on-primary);
}
.welcome-text {
  margin-right: 1rem;
  font-weight: 500;
  color: var(--text-on-primary);
  font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
}

</style>
