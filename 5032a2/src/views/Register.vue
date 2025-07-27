<template>
  <div class="app-container">
    <!-- 主要内容区域 -->
    <div class="main-content">

      <!-- 验证错误汇总 -->
      <div v-if="hasValidationErrors" class="validation-summary">
        <h4>请修正以下错误：</h4>
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

      <!-- 注册表单 -->
      <div class="registration-form">
        <form @submit.prevent="onRegister">
          <!-- 第一行：用户名和性别 -->
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
                <option value="">请选择</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div v-if="errors.gender" class="field-error">{{ errors.gender }}</div>
            </div>
          </div>

          <!-- 第二行：密码和确认密码 -->
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

          <!-- 复选框 -->
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

          <!-- 邮箱和电话 -->
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

          <!-- 地址 -->
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

          <!-- 提交按钮 -->
          <div class="form-actions">
            <button type="submit" class="btn btn-submit" :disabled="!isFormValid">Submit</button>
            <button type="button" class="btn btn-clear" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>

      <!-- 注册用户表格 -->
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

// 计算属性：检查是否有验证错误
const hasValidationErrors = computed(() => {
  return Object.values(errors).some(error => error !== null)
})

// 计算属性：表单是否有效
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

// 验证函数
const validateUsername = (blur) => {
  if (!form.username.trim()) {
    if (blur) errors.username = '用户名不能为空'
  } else if (form.username.length < 3) {
    if (blur) errors.username = '用户名至少3位'
  } else if (!/^[A-Za-z0-9]+$/.test(form.username)) {
    if (blur) errors.username = '用户名只能包含字母/数字'
  } else {
    errors.username = null
  }
}

const validateEmail = (blur) => {
  const re = /^\S+@\S+\.\S+$/
  if (!form.email.trim()) {
    if (blur) errors.email = '邮箱不能为空'
  } else if (!re.test(form.email)) {
    if (blur) errors.email = '邮箱格式不正确'
  } else {
    errors.email = null
  }
}

const validatePassword = (blur) => {
  if (!form.password.trim()) {
    if (blur) errors.password = '密码不能为空'
  } else if (form.password.length < 6) {
    if (blur) errors.password = '密码至少6位'
  } else {
    errors.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (!form.confirm.trim()) {
    if (blur) errors.confirm = '请确认密码'
  } else if (form.confirm !== form.password) {
    if (blur) errors.confirm = '两次密码不一致'
  } else {
    errors.confirm = null
  }
}

const validatePhone = (blur) => {
  if (!form.phone.trim()) {
    if (blur) errors.phone = '手机号不能为空'
  } else if (!/^\d{10}$/.test(form.phone)) {
    if (blur) errors.phone = '手机号需为10位数字'
  } else {
    errors.phone = null
  }
}

const validateAddress = (blur) => {
  if (!form.address.trim()) {
    if (blur) errors.address = '住址不能为空'
  } else {
    errors.address = null
  }
}

const validateGender = () => {
  if (!form.gender) {
    errors.gender = '请选择性别'
  } else {
    errors.gender = null
  }
}

// 清空表单
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

// 提交表单
const onRegister = () => {
  // 触发所有验证
  validateUsername(true)
  validateEmail(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validatePhone(true)
  validateAddress(true)
  validateGender()

  // 检查是否有错误
  if (Object.values(errors).every(e => !e)) {
    // 添加用户到列表（模拟数据库）
    // 1. 先取本地已注册用户
let users = JSON.parse(localStorage.getItem('users') || '[]')

// 2. 检查用户名是否已存在（可选）
if (users.some(u => u.username === form.username)) {
  alert('Username already exists!')
  return
}

// 3. 添加新用户
const newUser = {
  username: form.username,
  email: form.email,
  gender: form.gender,
  isCitizen: form.isCitizen,
  address: form.address,
  password: form.password  // 方便登录用
}
// 4. 写入本地
users.push(newUser)
localStorage.setItem('users', JSON.stringify(users))

// 5. 页面内列表也更新
registeredUsers.value = users

alert('注册成功！')
clearForm()
// router.push('/login')


    // addUser({ username: form.username, password: form.password })
    alert('注册成功！')
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
