<template>
  <!-- Using Bootstrap's Header template (starter code) -->
  <!-- https://getbootstrap.com/docs/5.0/examples/headers/ -->
  <div class="container">
    <header class="d-flex justify-content-between align-items-center py-3">
      <!-- 左侧导航 -->
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">
            Home (Week 4)
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            About (Members Only)
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">
            Add Book
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/CountbookAPI" class="nav-link" active-class="active">
            Count Book API
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Firelogin" class="nav-link" active-class="active">
            Firebase Login
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/FireRegister" class="nav-link" active-class="active">
            Firebase Register
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/logout" class="nav-link" active-class="active">
            Firebase Logout
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/WeatherCheck" class="nav-link" active-class="active">
            Get Weather
          </router-link>
        </li>
      </ul>

      <!-- 右侧用户状态 -->
      <div class="user-section d-flex align-items-center">
        <!-- 已登录状态 -->
        <div v-if="isAuthenticated" class="d-flex align-items-center">
          <span class="me-3 text-success">
            👤 Welcome, <strong>{{ currentUser?.username }}</strong>
          </span>
          <button 
            @click="handleLogout" 
            class="btn btn-outline-danger btn-sm"
            :disabled="isLoggingOut"
          >
            <span v-if="isLoggingOut" class="spinner-border spinner-border-sm me-1"></span>
            {{ isLoggingOut ? 'Logging out...' : '🚪 Logout' }}
          </button>
        </div>
        
        <!-- 未登录状态 -->
        <div v-else class="d-flex align-items-center">
          <span class="me-3 text-muted">
            👤 Not logged in
          </span>
          <router-link to="/login" class="btn btn-primary btn-sm">
            🔐 Login
          </router-link>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth.js' // or '@/composables/useAuth.js'

const router = useRouter()
const { isAuthenticated, currentUser, logout } = useAuth()

const isLoggingOut = ref(false)

const handleLogout = async () => {
  isLoggingOut.value = true
  
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 执行登出
    logout()
    
    // 重定向到首页
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}

.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}

.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}

.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}

/* 新增样式 */
.user-section {
  min-width: 200px;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .user-section {
    min-width: auto;
  }
  
  .user-section span {
    font-size: 0.9rem;
  }
}
</style>