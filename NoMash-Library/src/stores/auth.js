// src/stores/auth.js 或者 src/composables/useAuth.js
import { ref } from 'vue'

// 全局认证状态
const isAuthenticated = ref(false)
const currentUser = ref(null)

// 硬编码的用户凭据（用于演示）
const DEMO_CREDENTIALS = {
  username: 'librarian',
  password: 'Library2024!'
}

export function useAuth() {
  const login = (username, password) => {
    // 验证凭据
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      isAuthenticated.value = true
      currentUser.value = { username }
      return { success: true }
    } else {
      return { 
        success: false, 
        error: 'Invalid username or password' 
      }
    }
  }

  const logout = () => {
    isAuthenticated.value = false
    currentUser.value = null
  }

  const checkAuth = () => {
    return isAuthenticated.value
  }

  return {
    isAuthenticated,
    currentUser,
    login,
    logout,
    checkAuth
  }
}