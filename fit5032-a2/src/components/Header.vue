<template>
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <div class="brand-content">
          <div class="brand-icon">
            <i class="fas fa-heart"></i>
          </div>
          <span class="brand-text">Migrant Health Support</span>
        </div>
      </router-link>

      <button class="navbar-toggler" @click="showMenu = !showMenu" :class="{ 'active': showMenu }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="navbar-collapse" :class="{ 'show': showMenu }">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="showMenu = false">
              <i class="fas fa-home me-1"></i>Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/services" @click="showMenu = false">
              <i class="fas fa-hand-holding-heart me-1"></i>Services
            </router-link>
          </li>
          <li class="nav-item" v-if="currentUser">
            <router-link class="nav-link" to="/dashboard" @click="showMenu = false">
              <i class="fas fa-tachometer-alt me-1"></i>Dashboard
            </router-link>
          </li>
          <li class="nav-item" v-if="currentUser && currentUser.role === 'admin'">
            <router-link class="nav-link" to="/admin" @click="showMenu = false">
              <i class="fas fa-cog me-1"></i>Admin
            </router-link>
          </li>
        </ul>

        <div class="navbar-actions">
          <div v-if="!currentUser" class="auth-buttons">
            <button class="btn btn-outline-primary me-2" @click="$emit('login'); showMenu = false">
              <i class="fas fa-sign-in-alt me-1"></i>Login
            </button>
          </div>
          <div v-else class="user-menu dropdown">
            <button class="btn btn-user dropdown-toggle" @click="showUserMenu = !showUserMenu">
              <div class="user-avatar">
                <i class="fas fa-user"></i>
              </div>
              <span class="user-name">{{ currentUser.name }}</span>
              <span v-if="currentUser.role === 'admin'" class="admin-badge">Admin</span>
            </button>
            <ul class="dropdown-menu" :class="{ 'show': showUserMenu }" @click="showUserMenu = false">
              <li class="dropdown-header">
                <div class="user-info">
                  <strong>{{ currentUser.name }}</strong>
                  <small class="text-muted">{{ currentUser.email }}</small>
                </div>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <router-link class="dropdown-item" to="/dashboard">
                  <i class="fas fa-user me-2"></i>Profile
                </router-link>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click="$emit('logout')">
                  <i class="fas fa-sign-out-alt me-2"></i>Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Header',
  props: {
    currentUser: Object
  },
  emits: ['login', 'logout'],
  setup() {
    const showMenu = ref(false)
    const showUserMenu = ref(false)

    return {
      showMenu,
      showUserMenu
    }
  }
}
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(37, 99, 235, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 1rem 0;
}

.navbar-brand {
  text-decoration: none;
  color: inherit;
}

.brand-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

.brand-text {
  font-weight: 700;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 自定义汉堡菜单 */
.navbar-toggler {
  border: none;
  background: none;
  padding: 0.5rem;
  width: 30px;
  height: 30px;
  position: relative;
  cursor: pointer;
}

.navbar-toggler span {
  display: block;
  width: 20px;
  height: 2px;
  background: #2563eb;
  margin: 3px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.navbar-toggler.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.navbar-toggler.active span:nth-child(2) {
  opacity: 0;
}

.navbar-toggler.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.navbar-nav {
  gap: 0.5rem;
}

.nav-link {
  color: #374151 !important;
  font-weight: 500;
  padding: 0.75rem 1rem !important;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: #2563eb !important;
  background: rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  color: #2563eb !important;
  background: rgba(37, 99, 235, 0.1);
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #2563eb;
  border-radius: 1px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-buttons .btn {
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  border-radius: 25px;
}

.btn-outline-primary {
  background: transparent;
  color: #2563eb;
  border: 2px solid #2563eb;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background: #2563eb;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.btn-user {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-user:hover {
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
}

.user-name {
  font-weight: 600;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-badge {
  background: #f59e0b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  min-width: 250px;
  padding: 0.5rem 0;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 16px;
  height: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-bottom: none;
  border-right: none;
  transform: rotate(45deg);
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0.5rem;
}

.user-info strong {
  display: block;
  color: #1f2937;
}

.user-info small {
  color: #6b7280;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.dropdown-item:hover {
  background: #f9fafb;
  color: #2563eb;
  padding-left: 1.25rem;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-color: #e5e7eb;
}

/* 移动端样式 */
@media (max-width: 991.98px) {
  .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-top: none;
    border-radius: 0 0 0.75rem 0.75rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    padding: 1rem;
    transform: translateY(-10px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .navbar-collapse.show {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .navbar-nav {
    flex-direction: column;
    gap: 0;
    margin-bottom: 1rem;
  }

  .nav-link {
    padding: 1rem !important;
    border-radius: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .navbar-actions {
    justify-content: center;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .btn-user {
    width: 100%;
    justify-content: center;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: 1px solid #e5e7eb;
    margin-top: 0.5rem;
    transform: none;
    opacity: 1;
    visibility: visible;
  }

  .dropdown-menu::before {
    display: none;
  }
}

/* 动画 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
