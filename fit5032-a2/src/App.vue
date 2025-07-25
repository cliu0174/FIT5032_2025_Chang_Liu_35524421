<template>
  <div id="app">
    <Header @login="showLogin = true" :current-user="currentUser" @logout="handleLogout" />

    <main class="main-content">
      <router-view :current-user="currentUser" @user-updated="handleUserUpdate" />
    </main>

    <Footer />

    <!-- Simple Login Modal -->
    <div v-if="showLogin" class="modal-overlay" @click="showLogin = false">
      <div class="modal-content" @click.stop>
        <LoginForm @login-success="handleLoginSuccess" @close="showLogin = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import LoginForm from './components/LoginForm.vue'
import { getStoredUser, clearStoredUser } from './utils/storage.js'

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    LoginForm
  },
  setup() {
    const currentUser = ref(null)
    const showLogin = ref(false)

    const handleLoginSuccess = (user) => {
      currentUser.value = user
      showLogin.value = false
    }

    const handleLogout = () => {
      clearStoredUser()
      currentUser.value = null
    }

    const handleUserUpdate = (updatedUser) => {
      currentUser.value = updatedUser
    }

    onMounted(() => {
      const stored = getStoredUser()
      if (stored) {
        currentUser.value = stored
      }
    })

    return {
      currentUser,
      showLogin,
      handleLoginSuccess,
      handleLogout,
      handleUserUpdate
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px;
}

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
  padding: 20px;
  width: 90%;
  max-width: 400px;
}
</style>
