<template>
  <div class="main-box">
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h1 class="text-center">🔐 Library Member Login</h1>
          <p class="text-center">Please login to access the members area</p>
          
          <!-- 登录表单 -->
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="formData.username"
                @blur="() => validateUsername(true)"
                @input="() => validateUsername(false)"
                :class="{ 'is-invalid': errors.username }"
                required
              />
              <div v-if="errors.username" class="invalid-feedback">
                {{ errors.username }}
              </div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="formData.password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                :class="{ 'is-invalid': errors.password }"
                required
              />
              <div v-if="errors.password" class="invalid-feedback">
                {{ errors.password }}
              </div>
            </div>

            <!-- 登录错误信息 -->
            <div v-if="loginError" class="alert alert-danger" role="alert">
              {{ loginError }}
            </div>

            <div class="text-center">
              <button 
                type="submit" 
                class="btn btn-primary me-2"
                :disabled="!isFormValid || isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="clearForm">
                Clear
              </button>
            </div>
          </form>

          <!-- 演示凭据提示 -->
          <div class="mt-4">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Demo Credentials</h5>
              </div>
              <div class="card-body">
                <p class="card-text">
                  <strong>Username:</strong> librarian<br>
                  <strong>Password:</strong> Library2024!
                </p>
                <button class="btn btn-outline-primary btn-sm" @click="fillDemoCredentials">
                  Use Demo Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth.js' // 或者 '@/composables/useAuth.js'

const router = useRouter()
const { login } = useAuth()

// 表单数据
const formData = ref({
  username: '',
  password: ''
})

// 错误状态
const errors = ref({
  username: null,
  password: null
})

// 登录状态
const loginError = ref('')
const isLoading = ref(false)

// 表单验证
const validateUsername = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Username must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  if (formData.value.password.length < 6) {
    if (blur) errors.value.password = 'Password must be at least 6 characters'
  } else {
    errors.value.password = null
  }
}

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return formData.value.username.length >= 3 && 
         formData.value.password.length >= 6 && 
         !errors.value.username && 
         !errors.value.password
})

// 处理登录
const handleLogin = async () => {
  // 验证表单
  validateUsername(true)
  validatePassword(true)
  
  if (!isFormValid.value) {
    return
  }

  isLoading.value = true
  loginError.value = ''

  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result = login(formData.value.username, formData.value.password)
    
    if (result.success) {
      // 登录成功，重定向到About页面或之前尝试访问的页面
      const redirect = router.currentRoute.value.query.redirect || '/about'
      router.push(redirect)
    } else {
      loginError.value = result.error
    }
  } catch (error) {
    loginError.value = 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// 清除表单
const clearForm = () => {
  formData.value = {
    username: '',
    password: ''
  }
  errors.value = {
    username: null,
    password: null
  }
  loginError.value = ''
}

// 填充演示凭据
const fillDemoCredentials = () => {
  formData.value.username = 'librarian'
  formData.value.password = 'Library2024!'
  validateUsername(false)
  validatePassword(false)
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>