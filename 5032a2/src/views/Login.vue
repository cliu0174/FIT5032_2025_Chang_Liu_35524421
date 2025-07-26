<template>
  <section class="login-page">
    <h1>用户登录</h1>
    <form @submit.prevent="onLogin" class="login-form">
      <div class="form-group">
        <label for="username">用户名</label>
        <input id="username" v-model="form.username" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const error = ref('')

// ← 这里是「硬验证」账号列表
const allowedUsers = [
  { username: 'admin', password: '123456' },
  { username: 'guest', password: 'guest' },
]

function onLogin() {
  const match = allowedUsers.find(
    u => u.username === form.username && u.password === form.password
  )
  if (match) {
-    // 登录成功：把状态存到 localStorage
-    localStorage.setItem('isLoggedIn', 'true')
-    // 跳回首页（或你想去的页面）
-    router.push('/')
+    // 登录成功：把状态存到 localStorage
+    localStorage.setItem('isLoggedIn', 'true')
+    // 弹窗提示
+    alert(`欢迎回来，${form.username}，登录成功！`)
+    // 跳回首页（或你想去的页面）
+    router.push('/')
  } else {
    error.value = '用户名或密码错误'
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.login-form .form-group {
  margin-bottom: 1rem;
}
.login-form label {
  display: block;
  margin-bottom: .5rem;
}
.login-form input {
  width: 100%;
  padding: .5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.login-form button {
  padding: .6rem 1.2rem;
  background: var(--primary-color);
  color: var(--text-on-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.login-form button:hover {
  background: var(--primary-hover);
}
</style>
