<template>
  <div>
    <header class="header">
      <!-- 第一行：Logo + 登录 -->
      <div class="header-top">
        <img class="logo" :src="logo" alt="HarmoNest Logo" />
        <div class="header-top-right">
          <!-- 新增的小图标 -->
          <img class="login-icon" :src="loginIcon" alt="Icon" />
          <router-link to="/login" class="auth-button">Login</router-link>
          <router-link to="/register" class="auth-button">Register</router-link>
        </div>
      </div>

      <!-- 第二行：主导航 -->
      <nav class="header-bottom">
        <router-link to="/" exact>首页</router-link>
        <router-link to="/services">服务</router-link>
        <router-link to="/appointment">预约</router-link>
        <router-link to="/contact">联系我们</router-link>
      </nav>
    </header>

    <main><router-view/></main>

    <footer class="footer">© 2025 健康服务平台</footer>
  </div>
</template>

<script setup>
// 如果 logo 放在 src/assets
import logo from '@/assets/logo.png'
import loginIcon from '@/assets/login-icon.png'
</script>

<style>
/* @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap'); */

/* 2. 全局或局部应用字体
body {
  font-family: 'Indie Flower', cursive;
} */

/* 如果你只想给按钮和导航用，也可以写成： */
.auth-button,
.header-bottom a {
  font-family:
    "Microsoft YaHei",
    "PingFang SC",
    "Helvetica Neue",
    Arial,
    sans-serif;
}


/* 整个 header 用两行布局 */
.header {
  /* background: var(--primary-color); */
  color: var(--text-on-primary);
}

/* 第一行：左右分布 */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
}

/* Logo 大小 */
.logo {
  max-height: 80px;
  height: auto;
  width: auto;
}

.header-top-right {
  display: flex;
  align-items: center;
}

/* 新增：小图标样式 */
.login-icon {
  height: 80px;       /* 根据需求调整大小 */
  width: auto;
  margin-right: 3rem;
}

/* 通用彩色按钮 */
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
}
.auth-button:hover {
  opacity: 0.8;
}


/* 第二行：导航居中 */
.header-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--primary-color);
  border-top: 1px solid rgba(255,255,255,0.2);
}

/* 导航链接通用样式 */
.header-bottom a {
  position: relative;
  padding: 1rem 1.5rem;
  color: var(--text-on-primary);
  text-decoration: none;
  transition: color .2s;
}

/* hover 效果 */
.header-bottom a:hover {
  opacity: 0.8;
}

/* 激活态文字变灰 */
.header-bottom a.router-link-exact-active {
  color: #888;
}

/* 激活态上方横杠 */
.header-bottom a.router-link-exact-active::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: #888;
}

/* 搜索栏靠右 */
.search-box {
  display: flex;
  align-items: center;
}
.search-box input {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px 0 0 4px;
  outline: none;
}
.search-box button {
  padding: 0.4rem 0.8rem;
  border: none;
  background: var(--text-on-primary);
  color: var(--primary-color);
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: opacity 0.2s;
}
.search-box button:hover {
  opacity: 0.8;
}

/* footer 保持不变 */
.footer {
  text-align: center;
  padding: 1rem;
  background: var(--primary-color);
  color: var(--text-on-primary);
}
</style>
