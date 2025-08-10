<template>
  <div class="container text-center mt-5">
    <h1>🚪 Logging out...</h1>
    <p v-if="signedOut">✅ You have been successfully signed out.</p>
    <p v-else>Processing logout...</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "vue-router"

const auth = getAuth()
const router = useRouter()
const signedOut = ref(false)

onMounted(() => {
  signOut(auth)
    .then(() => {
      console.log("✅ User signed out")
      console.log("Current user after sign out:", auth.currentUser) // 应该为 null
      signedOut.value = true

      // 延迟跳转到登录页
      setTimeout(() => {
        router.push("/FireLogin")
      }, 1500)
    })
    .catch((error) => {
      console.log("❌ Logout error:", error)
    })
})
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
