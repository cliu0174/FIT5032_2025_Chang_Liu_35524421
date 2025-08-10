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
        </ul>
      </div>

      <!-- Registration form -->
      <div class="registration-form">
        <form @submit.prevent="onRegister">
          <!-- First row: Username and Gender -->
          <div class="form-row">
            <div class="form-group">
              <label for="username" class="form-label">Username</label>
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
              <label for="gender" class="form-label">Gender</label>
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
              </select>
              <div v-if="errors.gender" class="field-error">{{ errors.gender }}</div>
            </div>
          </div>

          <!-- Second row: Password and Confirm Password -->
          <div class="form-row">
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="form-control"
                :class="{ 'error': errors.password }"
                placeholder="••••••••••"
                @blur="validatePassword(true)"
                @input="validatePassword(false)"
              />
              <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
            </div>

            <div class="form-group">
              <label for="confirm" class="form-label">Confirm password</label>
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

          <!-- Checkbox -->
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                id="isCitizen"
                v-model="form.isCitizen"
                type="checkbox"
                class="form-check-input"
              />
              Australian Resident?
            </label>
          </div>

          <!-- Email and Phone -->
          <div class="form-row">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
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
              <label for="phone" class="form-label">Phone (10 digits)</label>
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
            <label for="address" class="form-label">Suburb</label>
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
            <button type="submit" class="btn btn-submit" :disabled="!isFormValid">Submit</button>
            <button type="button" class="btn btn-clear" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>

      <!-- Registered users table -->
      <div v-if="registeredUsers.length > 0" class="users-table">
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
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
// import { addUser } from '@/utils/users'

const router = useRouter()
const registeredUsers = ref([])
registeredUsers.value = JSON.parse(localStorage.getItem('users') || '[]')


const form = reactive({
  username: '',
  email: '',
  password: '',
  confirm: '',
  phone: '',
  address: '',
  isCitizen: false,
  gender: '',
})

const errors = reactive({
  username: null,
  email: null,
  password: null,
  confirm: null,
  phone: null,
  address: null,
  gender: null,
})

// Computed property: Check if there are validation errors
const hasValidationErrors = computed(() => {
  return Object.values(errors).some(error => error !== null)
})

// Computed property: Check if form is valid
const isFormValid = computed(() => {
  return form.username.trim() &&
         form.email.trim() &&
         form.password.length >= 6 &&
         form.confirm &&
         form.phone.trim() &&
         form.address.trim() &&
         form.gender &&
         !hasValidationErrors.value
})

// Validation functions
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

// Clear form
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
  })
  Object.keys(errors).forEach(k => (errors[k] = null))
}

// Submit form
const onRegister = () => {
  // Trigger all validations
  validateUsername(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validatePhone(true)
  validateAddress(true)
  validateGender()

  // Check if there are any errors
  if (Object.values(errors).every(e => !e)) {
    // Add user to list (simulate database)
    // 1. Get existing registered users from local storage
    let users = JSON.parse(localStorage.getItem('users') || '[]')

    // 2. Check if username already exists (optional)
    if (users.some(u => u.username === form.username)) {
      alert('Username already exists!')
      return
    }

    // 3. Add new user
    const newUser = {
      username: form.username,
      email: form.email,
      gender: form.gender,
      isCitizen: form.isCitizen,
      address: form.address,
      password: form.password  // For login convenience
    }
    // 4. Save to local storage
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    // 5. Update page list as well
    registeredUsers.value = users

    alert('Registration successful!')
    clearForm()
    // router.push('/login')

    // addUser({ username: form.username, password: form.password })
    alert('Registration successful!')
    clearForm()
    // router.push('/login')
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-content {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.validation-summary {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 2rem;
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

.registration-form {
  background: white;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

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

.checkbox-group {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e50;
}

.form-check-input {
  width: 18px !important;
  height: 18px;
  margin-right: 0.75rem;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-start;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: capitalize;
}

.btn-submit {
  background: #007bff;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,123,255,0.3);
}

.btn-submit:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.btn-clear {
  background: #6c757d;
  color: white;
}

.btn-clear:hover {
  background: #545b62;
  transform: translateY(-1px);
}

.users-table {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
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

th,
td {
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 1rem;
  }

  .registration-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  table {
    font-size: 0.8rem;
  }

  th, td {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .registration-form {
    padding: 1rem;
  }
}
</style>
