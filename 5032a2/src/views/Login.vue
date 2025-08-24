<template>
  <div class="app-container">
    <!-- main content -->
    <div class="main-content">
      <!-- validation summary -->
      <div v-if="hasValidationErrors" class="validation-summary">
        <h4>Please fix the following errors:</h4>
        <ul>
          <li v-if="validationErrors.email">{{ validationErrors.email }}</li>
          <li v-if="validationErrors.password">{{ validationErrors.password }}</li>
        </ul>
      </div>

      <!-- login error -->
      <div v-if="error" class="login-error">
        <p>{{ error }}</p>
      </div>

      <!-- login success -->
      <div v-if="success" class="login-success">
        <p>{{ success }}</p>
      </div>

      <!-- login form -->
      <div class="login-form">
        <h1 class="form-title">User Login</h1>

        <!-- Firebase Auth Tabs -->
        <div class="auth-tabs">
          <button
            @click="authMethod = 'email'"
            :class="{ active: authMethod === 'email' }"
            class="tab-button"
          >
            Email Login
          </button>
          <button
            @click="authMethod = 'legacy'"
            :class="{ active: authMethod === 'legacy' }"
            class="tab-button"
          >
            Test Accounts
          </button>
        </div>

        <!-- Firebase Email Login -->
        <form v-if="authMethod === 'email'" @submit.prevent="onFirebaseLogin">
          <!-- email -->
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control"
              :class="{ 'error': validationErrors.email }"
              placeholder="Enter your email"
              required
              @blur="validateEmail"
              @input="clearEmailError"
            />
            <span v-if="validationErrors.email" class="field-error">{{ validationErrors.email }}</span>
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
              :disabled="!isFormValid || isLoading"
            >
              {{ isLoading ? 'Signing In...' : 'Sign In with Email' }}
            </button>
          </div>

          <!-- Google Login -->
          <div class="social-login">
            <div class="divider">
              <span>OR</span>
            </div>
            <button
              type="button"
              @click="onGoogleLogin"
              class="btn btn-google w-100"
              :disabled="isLoading"
            >
              <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {{ isLoading ? 'Please wait...' : 'Continue with Google' }}
            </button>
          </div>

          <!-- register link -->
          <div class="form-footer">
            <p>Don't have an account? <router-link to="/register" class="register-link">Create Account</router-link></p>
          </div>
        </form>

        <!-- Legacy Login (Test Accounts) -->
        <form v-if="authMethod === 'legacy'" @submit.prevent="onLegacyLogin">
          <!-- username -->
          <div class="form-group">
            <label for="username" class="form-label">Username</label>
            <input
              id="username"
              v-model="legacyForm.username"
              type="text"
              class="form-control"
              placeholder="Enter username"
              required
              minlength="3"
            />
          </div>

          <!-- password -->
          <div class="form-group">
            <label for="legacyPassword" class="form-label">Password</label>
            <input
              id="legacyPassword"
              v-model="legacyForm.password"
              type="password"
              class="form-control"
              placeholder="Enter password"
              required
              minlength="6"
            />
          </div>

          <!-- actions -->
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-submit btn-secondary w-100"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Signing In...' : 'Sign In (Test Mode)' }}
            </button>
          </div>
        </form>
      </div>

      <!-- test accounts -->
      <div v-if="authMethod === 'legacy' && availableUsers.length" class="test-accounts">
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

      <!-- Connection Status -->
      <div class="connection-status">
        <div v-if="firebaseConnected" class="status-item connected">
          <span class="status-dot"></span>
          Connected to Firebase
        </div>
        <div v-else class="status-item disconnected">
          <span class="status-dot"></span>
          Firebase connection failed - using local mode
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers } from '@/utils/users'
import {
  loginWithEmail,
  loginWithGoogle,
  checkFirebaseConnection
} from '@/utils/firebase'

const router = useRouter()
const authMethod = ref('email')
const isLoading = ref(false)
const firebaseConnected = ref(false)

// Firebase forms
const form = reactive({ email: '', password: '' })
const legacyForm = reactive({ username: '', password: '' })

// Messages
const error = ref('')
const success = ref('')
const availableUsers = ref([])

// Validation error states
const validationErrors = reactive({
  email: '',
  password: ''
})

// Check Firebase connection on mount
onMounted(async () => {
  console.log('🔥 Checking Firebase connection...')
  firebaseConnected.value = await checkFirebaseConnection()

  if (!firebaseConnected.value) {
    console.warn('🔥 Firebase not available, using legacy login')
    authMethod.value = 'legacy'
  }

  // Load test accounts for legacy mode
  try {
    availableUsers.value = getUsers()
  } catch (e) {
    console.warn('Failed to fetch user data, using default test accounts')
    availableUsers.value = [
      { username: 'admin', password: '123456' },
      { username: 'guest', password: 'guestguest' }
    ]
  }
})

// Computed properties
const hasValidationErrors = computed(() => {
  return validationErrors.email || validationErrors.password
})

const isFormValid = computed(() => {
  return form.email.trim() &&
         form.password.trim() &&
         form.password.length >= 6 &&
         !hasValidationErrors.value
})

// Validation functions
function validateEmail() {
  if (!form.email.trim()) {
    validationErrors.email = 'Email is required'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    validationErrors.email = 'Please enter a valid email address'
    return false
  }
  validationErrors.email = ''
  return true
}

function validatePassword() {
  if (!form.password.trim()) {
    validationErrors.password = 'Password is required'
    return false
  }
  if (form.password.length < 6) {
    validationErrors.password = 'Password must be at least 6 characters'
    return false
  }
  validationErrors.password = ''
  return true
}

function clearEmailError() {
  if (validationErrors.email) {
    validationErrors.email = ''
  }
}

function clearPasswordError() {
  if (validationErrors.password) {
    validationErrors.password = ''
  }
}

function clearMessages() {
  error.value = ''
  success.value = ''
}

// Firebase login handlers
const onFirebaseLogin = async () => {
  if (isLoading.value) return

  clearMessages()

  // Validate form
  if (!validateEmail() || !validatePassword()) {
    return
  }

  isLoading.value = true

  try {
    const result = await loginWithEmail(form.email, form.password)

    if (result.success) {
      success.value = `Welcome back!`

      // Small delay to show success message
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const onGoogleLogin = async () => {
  if (isLoading.value) return

  clearMessages()
  isLoading.value = true

  try {
    const result = await loginWithGoogle()

    if (result.success) {
      success.value = 'Google login successful!'

      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Google login error:', err)
    error.value = 'Google login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Legacy login handler
const onLegacyLogin = () => {
  if (isLoading.value) return

  clearMessages()
  isLoading.value = true

  try {
    // Get user data
    const users = getUsers()

    // Find matching user
    const match = users.find(
      u => u.username === legacyForm.username && u.password === legacyForm.password
    )

    if (match) {
      // Login success
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('currentUser', legacyForm.username)
      localStorage.setItem('currentRole', match.role)
      localStorage.setItem('authProvider', 'legacy')

      success.value = `Welcome back, ${legacyForm.username}!`

      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      error.value = 'Incorrect username or password'
    }
  } catch (e) {
    error.value = 'Login system error. Please try again later.'
    console.error('Legacy login error:', e)
  } finally {
    isLoading.value = false
  }
}

// Fill test account credentials
function fillTestAccount(username, password) {
  legacyForm.username = username
  legacyForm.password = password
  clearMessages()
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-image: url('@/assets/bkg1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

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

.main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 500px;
}

/* Messages */
.validation-summary, .login-error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #721c24;
}

.login-success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #155724;
  text-align: center;
  font-weight: 500;
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

/* Form Container */
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

/* Auth Tabs */
.auth-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dee2e6;
}

.tab-button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: #f8f9fa;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-button.active {
  background: #007bff;
  color: white;
}

.tab-button:hover:not(.active) {
  background: #e9ecef;
}

/* Form Elements */
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

/* Buttons - 更友好的绿色系配色 */
.form-actions {
  margin-top: 2rem;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.75rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-submit {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1ea085 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
}

.btn:disabled {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  cursor: not-allowed;
  transform: none;
  opacity: 0.6;
  box-shadow: none;
}

.w-100 {
  width: 100%;
}

/* Google Login */
.social-login {
  margin-top: 1.5rem;
}

.divider {
  text-align: center;
  margin: 1rem 0;
  position: relative;
  color: #6c757d;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #dee2e6;
  z-index: 1;
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 1rem;
  position: relative;
  z-index: 2;
  font-size: 0.8rem;
}

.btn-google {
  background: linear-gradient(135deg, #4285f4 0%, #357ae8 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(66, 133, 244, 0.3);
}

.btn-google:hover:not(:disabled) {
  background: linear-gradient(135deg, #357ae8 0%, #2a6bd9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(66, 133, 244, 0.4);
}

.google-icon {
  width: 20px;
  height: 20px;
}

/* Footer */
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
  color: #28a745;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.register-link:hover {
  color: #218838;
  text-decoration: underline;
}

/* Test Accounts */
.test-accounts {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
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
  border-color: #28a745;
  background: #f1f8e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);
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

/* Connection Status */
.connection-status {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-item.connected {
  background: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.2);
}

.status-item.disconnected {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.2);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* Responsive */
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

  .auth-tabs {
    flex-direction: column;
  }

  .tab-button {
    border-radius: 0;
  }

  .tab-button:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .tab-button:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
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
