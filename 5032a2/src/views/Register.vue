<template>
  <div class="app-container">
    <!-- Main content area -->
    <div class="main-content">

      <!-- Validation error summary -->
      <div v-if="hasValidationErrors" class="validation-summary">
        <h4>Please correct the following errors:</h4>
        <ul>
          <li v-if="errors.username">{{ errors.username }}</li>
          <li v-if="errors.email">{{ errors.email }}</li>
          <li v-if="errors.password">{{ errors.password }}</li>
          <li v-if="errors.confirm">{{ errors.confirm }}</li>
          <li v-if="errors.phone">{{ errors.phone }}</li>
          <li v-if="errors.address">{{ errors.address }}</li>
          <li v-if="errors.gender">{{ errors.gender }}</li>
          <li v-if="errors.terms">{{ errors.terms }}</li>
        </ul>
      </div>

      <!-- Success message -->
      <div v-if="successMessage" class="success-message">
        <p>{{ successMessage }}</p>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>

      <!-- Registration form -->
      <div class="registration-form">
        <h1 class="form-title">Create Account</h1>

        <!-- Registration Mode Toggle -->
        <div class="registration-tabs">
          <button
            @click="registrationMode = 'firebase'"
            :class="{ active: registrationMode === 'firebase' }"
            class="tab-button"
            :disabled="!firebaseAvailable"
          >
            🔥 Firebase Account
          </button>
          <button
            @click="registrationMode = 'local'"
            :class="{ active: registrationMode === 'local' }"
            class="tab-button"
          >
            💾 Local Account
          </button>
        </div>

        <!-- Firebase Registration -->
        <div v-if="registrationMode === 'firebase'">
          <!-- Account Type Selection for Firebase -->
          <div class="account-type-section">
            <h3>Select Account Type</h3>
            <div class="account-type-options">
              <label class="account-type-option">
                <input
                  v-model="firebaseForm.role"
                  type="radio"
                  value="guest"
                  name="firebaseAccountType"
                />
                <div class="option-card">
                  <div class="option-icon">👤</div>
                  <h4>Regular User</h4>
                  <p>Standard access to healthcare services</p>
                </div>
              </label>

              <label class="account-type-option">
                <input
                  v-model="firebaseForm.role"
                  type="radio"
                  value="admin"
                  name="firebaseAccountType"
                />
                <div class="option-card">
                  <div class="option-icon">👨‍⚕️</div>
                  <h4>Administrator</h4>
                  <p>Full system access and management</p>
                </div>
              </label>
            </div>
          </div>

          <form @submit.prevent="onFirebaseRegister">
            <!-- Firebase Username -->
            <div class="form-group">
              <label for="firebaseUsername" class="form-label">Username *</label>
              <input
                id="firebaseUsername"
                v-model="firebaseForm.username"
                type="text"
                class="form-control"
                :class="{ 'error': firebaseErrors.username }"
                placeholder="Enter username"
                required
                minlength="3"
                @blur="validateFirebaseUsername(true)"
                @input="validateFirebaseUsername(false)"
              />
              <div v-if="firebaseErrors.username" class="field-error">{{ firebaseErrors.username }}</div>
            </div>

            <!-- Firebase Email -->
            <div class="form-group">
              <label for="firebaseEmail" class="form-label">Email Address *</label>
              <input
                id="firebaseEmail"
                v-model="firebaseForm.email"
                type="email"
                class="form-control"
                :class="{ 'error': firebaseErrors.email }"
                placeholder="Enter your email"
                required
                @blur="validateFirebaseEmail(true)"
                @input="validateFirebaseEmail(false)"
              />
              <div v-if="firebaseErrors.email" class="field-error">{{ firebaseErrors.email }}</div>
            </div>

            <!-- Firebase Password -->
            <div class="form-row">
              <div class="form-group">
                <label for="firebasePassword" class="form-label">Password *</label>
                <div class="password-input-container">
                  <input
                    id="firebasePassword"
                    v-model="firebaseForm.password"
                    :type="showFirebasePassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'error': firebaseErrors.password }"
                    placeholder="••••••••••"
                    required
                    minlength="6"
                    @blur="validateFirebasePassword(true)"
                    @input="validateFirebasePassword(false)"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showFirebasePassword = !showFirebasePassword"
                    :title="showFirebasePassword ? 'Hide password' : 'Show password'"
                  >
                    {{ showFirebasePassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <div class="password-strength">
                  <div class="strength-bar">
                    <div
                      class="strength-fill"
                      :class="firebasePasswordStrengthClass"
                      :style="{ width: firebasePasswordStrengthPercent + '%' }"
                    ></div>
                  </div>
                  <span class="strength-text">{{ firebasePasswordStrengthText }}</span>
                </div>
                <div v-if="firebaseErrors.password" class="field-error">{{ firebaseErrors.password }}</div>
              </div>

              <div class="form-group">
                <label for="firebaseConfirm" class="form-label">Confirm Password *</label>
                <input
                  id="firebaseConfirm"
                  v-model="firebaseForm.confirm"
                  type="password"
                  class="form-control"
                  :class="{ 'error': firebaseErrors.confirm }"
                  placeholder="••••••••••"
                  required
                  @blur="validateFirebaseConfirmPassword(true)"
                  @input="validateFirebaseConfirmPassword(false)"
                />
                <div v-if="firebaseErrors.confirm" class="field-error">{{ firebaseErrors.confirm }}</div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="checkbox-section">
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input
                    id="firebaseAcceptTerms"
                    v-model="firebaseForm.acceptTerms"
                    type="checkbox"
                    class="form-check-input"
                    @change="validateFirebaseTerms"
                  />
                  <!-- <span class="checkmark"></span> -->
                  I accept the <a href="#" class="terms-link" @click.prevent="showTerms = true">Terms and Conditions</a> *
                </label>
                <div v-if="firebaseErrors.terms" class="field-error">{{ firebaseErrors.terms }}</div>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input
                    id="firebaseAcceptNewsletter"
                    v-model="firebaseForm.acceptNewsletter"
                    type="checkbox"
                    class="form-check-input"
                  />
                  <!-- <span class="checkmark"></span> -->
                  Subscribe to health tips and updates
                </label>
              </div>
            </div>

            <!-- Firebase Submit buttons -->
            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-submit btn-primary"
                :disabled="!isFirebaseFormValid || isLoading"
              >
                {{ isLoading ? 'Creating Account...' : 'Create Firebase Account' }}
              </button>
            </div>

            <!-- Google Registration -->
            <div class="social-login">
              <div class="divider">
                <span>OR</span>
              </div>
              <button
                type="button"
                @click="onGoogleRegister"
                class="btn btn-google w-100"
                :disabled="isLoading"
              >
                <svg class="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {{ isLoading ? 'Please wait...' : 'Sign up with Google' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Local Registration (Original Form) -->
        <div v-if="registrationMode === 'local'">
          <form @submit.prevent="onLocalRegister">
            <!-- First row: Username and Gender -->
            <div class="form-row">
              <div class="form-group">
                <label for="username" class="form-label">Username *</label>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  class="form-control"
                  :class="{ 'error': errors.username }"
                  placeholder="Enter username"
                  @blur="validateUsername(true)"
                  @input="validateUsername(false)"
                />
                <div v-if="errors.username" class="field-error">{{ errors.username }}</div>
              </div>

              <div class="form-group">
                <label for="gender" class="form-label">Gender *</label>
                <select
                  id="gender"
                  v-model="form.gender"
                  class="form-control"
                  :class="{ 'error': errors.gender }"
                  @change="validateGender"
                >
                  <option value="">Please select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <div v-if="errors.gender" class="field-error">{{ errors.gender }}</div>
              </div>
            </div>

            <!-- Second row: Password and Confirm Password -->
            <div class="form-row">
              <div class="form-group">
                <label for="password" class="form-label">Password *</label>
                <div class="password-input-container">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'error': errors.password }"
                    placeholder="••••••••••"
                    @blur="validatePassword(true)"
                    @input="validatePassword(false)"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                    :title="showPassword ? 'Hide password' : 'Show password'"
                  >
                    {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <div class="password-strength">
                  <div class="strength-bar">
                    <div
                      class="strength-fill"
                      :class="passwordStrengthClass"
                      :style="{ width: passwordStrengthPercent + '%' }"
                    ></div>
                  </div>
                  <span class="strength-text">{{ passwordStrengthText }}</span>
                </div>
                <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
              </div>

              <div class="form-group">
                <label for="confirm" class="form-label">Confirm Password *</label>
                <input
                  id="confirm"
                  v-model="form.confirm"
                  type="password"
                  class="form-control"
                  :class="{ 'error': errors.confirm }"
                  placeholder="••••••••••"
                  @blur="validateConfirmPassword(true)"
                  @input="validateConfirmPassword(false)"
                />
                <div v-if="errors.confirm" class="field-error">{{ errors.confirm }}</div>
              </div>
            </div>

            <!-- Enhanced Checkbox Section -->
            <div class="checkbox-section">
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input
                    id="isCitizen"
                    v-model="form.isCitizen"
                    type="checkbox"
                    class="form-check-input"
                  />
                  <span class="checkmark"></span>
                  Australian Resident?
                </label>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input
                    id="acceptTerms"
                    v-model="form.acceptTerms"
                    type="checkbox"
                    class="form-check-input"
                    @change="validateTerms"
                  />
                  <span class="checkmark"></span>
                  I accept the <a href="#" class="terms-link" @click.prevent="showTerms = true">Terms and Conditions</a> *
                </label>
                <div v-if="errors.terms" class="field-error">{{ errors.terms }}</div>
              </div>

              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input
                    id="acceptNewsletter"
                    v-model="form.acceptNewsletter"
                    type="checkbox"
                    class="form-check-input"
                  />
                  <span class="checkmark"></span>
                  Subscribe to health tips and updates
                </label>
              </div>
            </div>

            <!-- Email and Phone -->
            <div class="form-row">
              <div class="form-group">
                <label for="email" class="form-label">Email *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :class="{ 'error': errors.email }"
                  placeholder="Enter email"
                  @blur="validateEmail(true)"
                  @input="validateEmail(false)"
                />
                <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">Phone (10 digits) *</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form-control"
                  :class="{ 'error': errors.phone }"
                  placeholder="Enter phone number"
                  @blur="validatePhone(true)"
                  @input="validatePhone(false)"
                />
                <div v-if="errors.phone" class="field-error">{{ errors.phone }}</div>
              </div>
            </div>

            <!-- Address -->
            <div class="form-group">
              <label for="address" class="form-label">Suburb *</label>
              <input
                id="address"
                v-model="form.address"
                type="text"
                class="form-control"
                :class="{ 'error': errors.address }"
                placeholder="Glen Waverley"
                @blur="validateAddress(true)"
                @input="validateAddress(false)"
              />
              <div v-if="errors.address" class="field-error">{{ errors.address }}</div>
            </div>

            <!-- Submit buttons -->
            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-submit btn-secondary"
                :disabled="!isLocalFormValid || isLoading"
              >
                {{ isLoading ? 'Creating Account...' : 'Create Local Account' }}
              </button>
              <button type="button" class="btn btn-clear" @click="clearForm" :disabled="isLoading">
                Clear
              </button>
            </div>
          </form>
        </div>

        <!-- Login link -->
        <div class="form-footer">
          <p>Already have an account? <router-link to="/login" class="login-link">Sign In</router-link></p>
        </div>
      </div>

      <!-- Registered users table (only for local mode) -->
      <div v-if="registrationMode === 'local' && registeredUsers.length > 0" class="users-table">
        <h3>Registered Users</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Australian Resident</th>
              <th>Suburb</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in registeredUsers" :key="index">
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.gender }}</td>
              <td>{{ user.isCitizen ? 'Yes' : 'No' }}</td>
              <td>{{ user.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Connection Status -->
      <div class="connection-status">
        <div v-if="firebaseAvailable" class="status-item connected">
          <span class="status-dot"></span>
          Firebase Authentication Available
        </div>
        <div v-else class="status-item disconnected">
          <span class="status-dot"></span>
          Firebase Unavailable - Local Mode Only
        </div>
      </div>

      <!-- Terms Modal -->
      <div v-if="showTerms" class="modal-overlay" @click="showTerms = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Terms and Conditions</h2>
            <button @click="showTerms = false" class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <h3>HarmoNest Health Foundation - Terms of Service</h3>
            <p><strong>Last updated:</strong> {{ new Date().toDateString() }}</p>

            <h4>1. Acceptance of Terms</h4>
            <p>By creating an account with HarmoNest Health Foundation, you agree to be bound by these Terms and Conditions.</p>

            <h4>2. Privacy and Data Protection</h4>
            <p>We are committed to protecting your personal information and health data in accordance with applicable privacy laws.</p>

            <h4>3. User Responsibilities</h4>
            <p>Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account.</p>

            <h4>4. Service Availability</h4>
            <p>While we strive to provide continuous service, we do not guarantee uninterrupted access to our platform.</p>

            <h4>5. Medical Disclaimer</h4>
            <p>Our platform provides health information and services but does not replace professional medical advice. Always consult healthcare professionals for medical decisions.</p>
          </div>
          <div class="modal-footer">
            <button @click="showTerms = false" class="btn btn-primary">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State management
const registrationMode = ref('firebase')
const firebaseAvailable = ref(false)
const isLoading = ref(false)
const showTerms = ref(false)
const showPassword = ref(false)
const showFirebasePassword = ref(false)

// Messages
const successMessage = ref('')
const errorMessage = ref('')
const registeredUsers = ref([])

// Firebase form
const firebaseForm = reactive({
  username: '',
  email: '',
  password: '',
  confirm: '',
  role: 'guest',
  acceptTerms: false,
  acceptNewsletter: false
})

// Local form (original)
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirm: '',
  phone: '',
  address: '',
  isCitizen: false,
  gender: '',
  acceptTerms: false,
  acceptNewsletter: false
})

// Firebase errors
const firebaseErrors = reactive({
  username: null,
  email: null,
  password: null,
  confirm: null,
  terms: null
})

// Local errors (original)
const errors = reactive({
  username: null,
  email: null,
  password: null,
  confirm: null,
  phone: null,
  address: null,
  gender: null,
  terms: null
})

// Check Firebase availability on mount
onMounted(async () => {
  try {
    const { checkFirebaseConnection } = await import('@/utils/firebase.js')
    firebaseAvailable.value = await checkFirebaseConnection()

    if (firebaseAvailable.value) {
      console.log('🔥 Firebase available - enabling Firebase registration')
      registrationMode.value = 'firebase'
    } else {
      console.log('💾 Firebase unavailable - using local registration only')
      registrationMode.value = 'local'
    }
  } catch (error) {
    console.warn('Failed to check Firebase:', error)
    firebaseAvailable.value = false
    registrationMode.value = 'local'
  }

  // Load existing users for local mode
  registeredUsers.value = JSON.parse(localStorage.getItem('users') || '[]')
})

// Computed properties
const hasValidationErrors = computed(() => {
  if (registrationMode.value === 'firebase') {
    return Object.values(firebaseErrors).some(error => error !== null)
  } else {
    return Object.values(errors).some(error => error !== null)
  }
})

const isFirebaseFormValid = computed(() => {
  return firebaseForm.username.trim() &&
         firebaseForm.email.trim() &&
         firebaseForm.password.length >= 6 &&
         firebaseForm.confirm &&
         firebaseForm.password === firebaseForm.confirm &&
         firebaseForm.acceptTerms &&
         !Object.values(firebaseErrors).some(error => error !== null)
})

const isLocalFormValid = computed(() => {
  return form.username.trim() &&
         form.email.trim() &&
         form.password.length >= 6 &&
         form.confirm &&
         form.phone.trim() &&
         form.address.trim() &&
         form.gender &&
         form.acceptTerms &&
         !Object.values(errors).some(error => error !== null)
})

// Password strength calculators
const calculatePasswordStrength = (password) => {
  let strength = 0
  let text = 'Very Weak'
  let className = 'very-weak'

  if (password.length >= 6) strength += 20
  if (password.length >= 8) strength += 20
  if (/[A-Z]/.test(password)) strength += 20
  if (/[0-9]/.test(password)) strength += 20
  if (/[^A-Za-z0-9]/.test(password)) strength += 20

  if (strength >= 80) {
    text = 'Very Strong'
    className = 'very-strong'
  } else if (strength >= 60) {
    text = 'Strong'
    className = 'strong'
  } else if (strength >= 40) {
    text = 'Medium'
    className = 'medium'
  } else if (strength >= 20) {
    text = 'Weak'
    className = 'weak'
  }

  return { strength, text, className }
}

const passwordStrengthPercent = computed(() => calculatePasswordStrength(form.password).strength)
const passwordStrengthText = computed(() => calculatePasswordStrength(form.password).text)
const passwordStrengthClass = computed(() => calculatePasswordStrength(form.password).className)

const firebasePasswordStrengthPercent = computed(() => calculatePasswordStrength(firebaseForm.password).strength)
const firebasePasswordStrengthText = computed(() => calculatePasswordStrength(firebaseForm.password).text)
const firebasePasswordStrengthClass = computed(() => calculatePasswordStrength(firebaseForm.password).className)

// Firebase validation functions
const validateFirebaseUsername = (blur) => {
  if (!firebaseForm.username.trim()) {
    if (blur) firebaseErrors.username = 'Username is required'
  } else if (firebaseForm.username.length < 3) {
    if (blur) firebaseErrors.username = 'Username must be at least 3 characters'
  } else if (!/^[A-Za-z0-9]+$/.test(firebaseForm.username)) {
    if (blur) firebaseErrors.username = 'Username can only contain letters and numbers'
  } else {
    firebaseErrors.username = null
  }
}

const validateFirebaseEmail = (blur) => {
  const re = /^\S+@\S+\.\S+$/
  if (!firebaseForm.email.trim()) {
    if (blur) firebaseErrors.email = 'Email is required'
  } else if (!re.test(firebaseForm.email)) {
    if (blur) firebaseErrors.email = 'Please enter a valid email address'
  } else {
    firebaseErrors.email = null
  }
}

const validateFirebasePassword = (blur) => {
  if (!firebaseForm.password.trim()) {
    if (blur) firebaseErrors.password = 'Password is required'
  } else if (firebaseForm.password.length < 6) {
    if (blur) firebaseErrors.password = 'Password must be at least 6 characters'
  } else {
    firebaseErrors.password = null
  }
}

const validateFirebaseConfirmPassword = (blur) => {
  if (!firebaseForm.confirm.trim()) {
    if (blur) firebaseErrors.confirm = 'Please confirm your password'
  } else if (firebaseForm.confirm !== firebaseForm.password) {
    if (blur) firebaseErrors.confirm = 'Passwords do not match'
  } else {
    firebaseErrors.confirm = null
  }
}

const validateFirebaseTerms = () => {
  if (!firebaseForm.acceptTerms) {
    firebaseErrors.terms = 'You must accept the Terms and Conditions'
  } else {
    firebaseErrors.terms = null
  }
}

// Local validation functions (original)
const validateUsername = (blur) => {
  if (!form.username.trim()) {
    if (blur) errors.username = 'Username cannot be empty'
  } else if (form.username.length < 3) {
    if (blur) errors.username = 'Username must be at least 3 characters'
  } else if (!/^[A-Za-z0-9]+$/.test(form.username)) {
    if (blur) errors.username = 'Username can only contain letters and numbers'
  } else {
    errors.username = null
  }
}

const validateEmail = (blur) => {
  const re = /^\S+@\S+\.\S+$/
  if (!form.email.trim()) {
    if (blur) errors.email = 'Email cannot be empty'
  } else if (!re.test(form.email)) {
    if (blur) errors.email = 'Email format is incorrect'
  } else {
    errors.email = null
  }
}

const validatePassword = (blur) => {
  if (!form.password.trim()) {
    if (blur) errors.password = 'Password cannot be empty'
  } else if (form.password.length < 6) {
    if (blur) errors.password = 'Password must be at least 6 characters'
  } else {
    errors.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (!form.confirm.trim()) {
    if (blur) errors.confirm = 'Please confirm password'
  } else if (form.confirm !== form.password) {
    if (blur) errors.confirm = 'Passwords do not match'
  } else {
    errors.confirm = null
  }
}

const validatePhone = (blur) => {
  if (!form.phone.trim()) {
    if (blur) errors.phone = 'Phone number cannot be empty'
  } else if (!/^\d{10}$/.test(form.phone)) {
    if (blur) errors.phone = 'Phone number must be 10 digits'
  } else {
    errors.phone = null
  }
}

const validateAddress = (blur) => {
  if (!form.address.trim()) {
    if (blur) errors.address = 'Address cannot be empty'
  } else {
    errors.address = null
  }
}

const validateGender = () => {
  if (!form.gender) {
    errors.gender = 'Please select gender'
  } else {
    errors.gender = null
  }
}

const validateTerms = () => {
  if (!form.acceptTerms) {
    errors.terms = 'You must accept the Terms and Conditions'
  } else {
    errors.terms = null
  }
}

// Clear functions
const clearMessages = () => {
  successMessage.value = ''
  errorMessage.value = ''
}

const clearForm = () => {
  Object.assign(form, {
    username: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    address: '',
    isCitizen: false,
    gender: '',
    acceptTerms: false,
    acceptNewsletter: false
  })
  Object.keys(errors).forEach(k => (errors[k] = null))
}

const clearFirebaseForm = () => {
  Object.assign(firebaseForm, {
    username: '',
    email: '',
    password: '',
    confirm: '',
    role: 'guest',
    acceptTerms: false,
    acceptNewsletter: false
  })
  Object.keys(firebaseErrors).forEach(k => (firebaseErrors[k] = null))
}

// Firebase registration handlers
const onFirebaseRegister = async () => {
  if (isLoading.value) return

  clearMessages()

  // Validate all Firebase fields
  validateFirebaseUsername(true)
  validateFirebaseEmail(true)
  validateFirebasePassword(true)
  validateFirebaseConfirmPassword(true)
  validateFirebaseTerms()

  if (!isFirebaseFormValid.value) {
    return
  }

  isLoading.value = true

  try {
    const { registerWithEmail } = await import('@/utils/firebase.js')

    const userData = {
      username: firebaseForm.username,
      role: firebaseForm.role
    }

    const result = await registerWithEmail(firebaseForm.email, firebaseForm.password, userData)

    if (result.success) {
      successMessage.value = `🎉 Account created successfully! Welcome, ${firebaseForm.username}!`

      clearFirebaseForm()

      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      errorMessage.value = result.error
    }
  } catch (err) {
    console.error('Firebase registration error:', err)
    errorMessage.value = 'Registration failed. Please try again or use local registration.'
  } finally {
    isLoading.value = false
  }
}

const onGoogleRegister = async () => {
  if (isLoading.value) return

  clearMessages()
  isLoading.value = true

  try {
    const { loginWithGoogle } = await import('@/utils/firebase.js')

    const result = await loginWithGoogle()

    if (result.success) {
      successMessage.value = '🎉 Google registration successful!'

      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      errorMessage.value = result.error
    }
  } catch (err) {
    console.error('Google registration error:', err)
    errorMessage.value = 'Google registration failed. Please try email registration instead.'
  } finally {
    isLoading.value = false
  }
}

// Local registration handler (original)
const onLocalRegister = () => {
  if (isLoading.value) return

  clearMessages()

  // Trigger all validations
  validateUsername(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validatePhone(true)
  validateAddress(true)
  validateGender()
  validateTerms()

  if (!isLocalFormValid.value) {
    return
  }

  isLoading.value = true

  try {
    // Get existing users
    let users = JSON.parse(localStorage.getItem('users') || '[]')

    // Check if username or email already exists
    if (users.some(u => u.username === form.username)) {
      errorMessage.value = 'Username already exists!'
      return
    }

    if (users.some(u => u.email === form.email)) {
      errorMessage.value = 'Email already exists!'
      return
    }

    // Add new user
    const newUser = {
      username: form.username,
      email: form.email,
      gender: form.gender,
      isCitizen: form.isCitizen,
      address: form.address,
      phone: form.phone,
      password: form.password,
      role: 'guest', // Default role for local accounts
      acceptNewsletter: form.acceptNewsletter,
      createdAt: new Date().toISOString(),
      authProvider: 'local'
    }

    // Save to localStorage
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    // Update displayed users
    registeredUsers.value = users

    successMessage.value = `🎉 Registration successful! Welcome, ${form.username}!`
    clearForm()

    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (err) {
    errorMessage.value = 'Registration failed. Please try again.'
    console.error('Local registration error:', err)
  } finally {
    isLoading.value = false
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
  max-width: 600px;
}

/* Messages */
.validation-summary, .error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #721c24;
}

.success-message {
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
.registration-form {
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

/* Registration Tabs */
.registration-tabs {
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

.tab-button:hover:not(.active):not(:disabled) {
  background: #e9ecef;
}

.tab-button:disabled {
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
}

/* Account Type Selection */
.account-type-section {
  margin-bottom: 2rem;
}

.account-type-section h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
  text-align: center;
}

.account-type-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.account-type-option {
  cursor: pointer;
}

.account-type-option input[type="radio"] {
  display: none;
}

.option-card {
  padding: 1.5rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.account-type-option input[type="radio"]:checked + .option-card {
  border-color: #007bff;
  background: #e3f2fd;
}

.option-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.15);
}

.option-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.option-card h4 {
  margin: 0.5rem 0;
  color: #2c3e50;
}

.option-card p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Form Elements */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
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

/* Password Input */
.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #6c757d;
  padding: 0.25rem;
}

.password-toggle:hover {
  color: #007bff;
}

/* Password Strength */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-fill.very-weak { background: #dc3545; }
.strength-fill.weak { background: #fd7e14; }
.strength-fill.medium { background: #ffc107; }
.strength-fill.strong { background: #20c997; }
.strength-fill.very-strong { background: #28a745; }

.strength-text {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
  display: block;
}

/* Checkboxes */
.checkbox-section {
  margin: 2rem 0;
}

.checkbox-group {
  margin-bottom: 1rem !important;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e50;
  line-height: 1.4;
}

.form-check-input {
  width: 18px !important;
  height: 18px;
  margin-right: 0.75rem;
  margin-top: 0.125rem;
  cursor: pointer;
  flex-shrink: 0;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #dee2e6;
  border-radius: 3px;
  margin-right: 0.75rem;
  display: inline-block;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.terms-link {
  color: #007bff;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 1rem;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-submit {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  flex: 1;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
  background: #6c757d;
  color: white;
  flex: 1;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-1px);
}

.btn-clear {
  background: #6c757d;
  color: white;
}

.btn-clear:hover:not(:disabled) {
  background: #545b62;
  transform: translateY(-1px);
}

.btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  opacity: 0.7;
}

.w-100 {
  width: 100%;
}

/* Social Login */
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
  background: #4285f4;
  color: white;
  border: 1px solid #4285f4;
}

.btn-google:hover:not(:disabled) {
  background: #357ae8;
  border-color: #357ae8;
  transform: translateY(-1px);
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

.login-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.login-link:hover {
  text-decoration: underline;
}

/* Users Table */
.users-table {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
}

.users-table h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
  font-size: 0.9rem;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-top: 1px solid #dee2e6;
}

tr:hover {
  background: #f8f9fa;
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

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
}

.modal-close:hover {
  color: #000;
}

.modal-body {
  padding: 1.5rem;
  line-height: 1.6;
}

.modal-body h3 {
  color: #2c3e50;
  margin-top: 0;
}

.modal-body h4 {
  color: #495057;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.modal-body p {
  margin-bottom: 1rem;
  color: #6c757d;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  text-align: right;
}

/* Responsive */
@media (max-width: 768px) {
  .app-container {
    padding: 1rem;
  }

  .registration-form {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .registration-tabs {
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

  .account-type-options {
    grid-template-columns: 1fr;
  }

  table {
    font-size: 0.8rem;
  }

  th, td {
    padding: 0.5rem;
  }

  .modal-content {
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .registration-form {
    padding: 1rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .users-table {
    padding: 1rem;
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-footer {
    padding: 1rem;
  }
}
</style>
