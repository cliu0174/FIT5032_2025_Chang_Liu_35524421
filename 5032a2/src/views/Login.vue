<template>
  <div class="app-container">
    <!-- main content -->
    <div class="main-content">
      <!-- validation summary -->
      <div v-if="hasValidationErrors" class="validation-summary">
        <h4>Please fix the following errors:</h4>
        <ul>
          <li v-if="validationErrors.username">{{ validationErrors.username }}</li>
          <li v-if="validationErrors.password">{{ validationErrors.password }}</li>
        </ul>
      </div>

      <!-- login error -->
      <div v-if="error" class="login-error">
        <p>{{ error }}</p>
      </div>

      <!-- login form -->
      <div class="login-form">
        <h1 class="form-title">User Login</h1>
        <form @submit.prevent="onLogin">
          <!-- username -->
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="form-control"
              :class="{ 'error': validationErrors.username }"
              placeholder="Enter username"
              required
              minlength="3"
              pattern="^[A-Za-z0-9]+$"
              @blur="validateUsername"
              @input="clearUsernameError"
            />
            <span v-if="validationErrors.username" class="field-error">{{ validationErrors.username }}</span>
          </div>

          <!-- password -->
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-control"
              :class="{ 'error': validationErrors.password }"
              placeholder="Enter password"
              required
              minlength="6"
              @blur="validatePassword"
              @input="clearPasswordError"
            />
            <span v-if="validationErrors.password" class="field-error">{{ validationErrors.password }}</span>
          </div>

          <!-- actions -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-submit btn-primary w-100"
              :disabled="!isFormValid"
            >Login</button>
          </div>

          <!-- register link -->
          <div class="form-footer">
            <p>Don't have an account? <router-link to="/register" class="register-link">Register now</router-link></p>
          </div>
        </form>
      </div>

      <!-- test accounts -->
      <div v-if="availableUsers.length" class="test-accounts">
        <h3>Available Test Accounts</h3>
        <div class="account-cards">
          <div
            v-for="user in availableUsers"
            :key="user.username"
            class="account-card"
            @click="fillTestAccount(user.username, user.password)"
          >
            <div class="account-info">
              <strong>{{ user.username }}</strong>
              <p>Username: {{ user.username }}</p>
              <p>Password: {{ user.password }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers } from '@/utils/users'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const error = ref('')
const availableUsers = ref([])

// Validation error states
const validationErrors = reactive({
  username: '',
  password: ''
})

// Fetch user data when component is mounted
onMounted(() => {
  try {
    availableUsers.value = getUsers()
  } catch (e) {
    // If user data cannot be retrieved, use default test accounts
    console.warn('Failed to fetch user data, using default test accounts')
    availableUsers.value = [
      { username: 'admin', password: '123456' },
      { username: 'guest', password: 'guest123' }
    ]
  }
})

// Computed property: check if there are validation errors
const hasValidationErrors = computed(() => {
  return validationErrors.username || validationErrors.password
})

// Computed property: check if the form is valid
const isFormValid = computed(() => {
  return form.username.trim() &&
         form.password.trim() &&
         form.password.length >= 6 &&
         !hasValidationErrors.value
})

// Username validation
function validateUsername() {
  // Required check
  if (!form.username.trim()) {
    validationErrors.username = 'Username is required'
    return false
  }
  // Length check
  if (form.username.length < 3) {
    validationErrors.username = 'Username must be at least 3 characters'
    return false
  }
  // Format check
  if (!/^[A-Za-z0-9]+$/.test(form.username)) {
    validationErrors.username = 'Username can only contain letters and numbers'
    return false
  }
  validationErrors.username = ''
  return true
}

// Password validation
function validatePassword() {
  // Required check
  if (!form.password.trim()) {
    validationErrors.password = 'Password is required'
    return false
  }
  // Length check
  if (form.password.length < 6) {
    validationErrors.password = 'Password must be at least 6 characters'
    return false
  }
  validationErrors.password = ''
  return true
}

// Clear username error
function clearUsernameError() {
  if (validationErrors.username) {
    validationErrors.username = ''
  }
}

// Clear password error
function clearPasswordError() {
  if (validationErrors.password) {
    validationErrors.password = ''
  }
}

// Validate entire form
function validateForm() {
  const isUsernameValid = validateUsername()
  const isPasswordValid = validatePassword()
  return isUsernameValid && isPasswordValid
}

// Fill test account credentials
function fillTestAccount(username, password) {
  form.username = username
  form.password = password
  validationErrors.username = ''
  validationErrors.password = ''
  error.value = ''
}

// Handle login
function onLogin() {
  // Clear previous login error
  error.value = ''

  // Perform form validation
  if (!validateForm()) {
    return // If validation fails, do not proceed
  }

  try {
    // Get user data
    const users = getUsers()

    // Find matching user
    const match = users.find(
      u => u.username === form.username && u.password === form.password
    )

    if (match) {
      // Login success
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('currentUser', form.username)
      localStorage.setItem('currentRole', match.role)
      // location.reload()  // 登录后刷新页面


      // Welcome message
      alert(`Welcome back, ${form.username}!`)

      // Redirect to home page
      router.replace('/')
    } else {
      error.value = 'Incorrect username or password'
    }
  } catch (e) {
    error.value = 'Login system error. Please try again later.'
    console.error('Login error:', e)
  }
}
</script>


<style scoped>
.app-container {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;

  /* 渐变背景作为备选 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* 背景图片设置 */
  background-image: url('@/assets/bkg1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* 背景遮罩层 */
.app-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

/* 确保内容在遮罩层之上 */
.main-content {
  position: relative;
  z-index: 2;
}

.main-content {
  width: 100%;
  max-width: 500px;
}

.validation-summary {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #721c24;
}

.validation-summary h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.validation-summary ul {
  margin: 0;
  padding-left: 1.5rem;
}

.validation-summary li {
  margin-bottom: 0.25rem;
}

.login-error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #721c24;
  text-align: center;
}

.login-error p {
  margin: 0;
  font-weight: 500;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.15);
}

.form-control.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220,53,69,0.15);
}

.field-error {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.75rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit {
  background: var(--primary-color, #007bff);
  color: var(--text-on-primary, white);
}

.btn-submit:hover:not(:disabled) {
  background: var(--primary-hover, #0056b3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.btn-submit:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.w-100 {
  width: 100%;
}

.form-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.form-footer p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.register-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.test-accounts {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.test-accounts h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.account-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.account-card {
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.account-card:hover {
  border-color: #007bff;
  background: #e3f2fd;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.15);
}

.account-info strong {
  display: block;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.account-info p {
  margin: 0.25rem 0;
  color: #6c757d;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .app-container {
    padding: 1rem;
  }

  .login-form {
    padding: 1.5rem;
  }

  .account-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 1rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .test-accounts {
    padding: 1rem;
  }
}
</style>
