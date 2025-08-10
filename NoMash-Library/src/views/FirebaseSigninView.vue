<template>
  <h1>Sign in</h1>
  <p>
    <input
      type="text"
      placeholder="Email"
      v-model="email"
    />
  </p>
  <p>
    <input
      type="password"
      placeholder="Password"
      v-model="password"
    />
  </p>
  <p>
    <button @click="signin">Sign in via Firebase</button>
  </p>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const signin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user 

    console.log("✅ Firebase Login Successful:", user.email)
    console.log("🛠️ Trying to get doc for:", user.email)


    const userRef = doc(db, "users", user.email)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const role = userSnap.data().role
      console.log("🎭 User role:", role)

      if (role === "admin") {
        console.log("🚀 This is admin")
      } else {
        console.log("👤 Normal user")
      }
    } else {
      console.log("⚠️ No role info found for this user")
    }

    router.push("/") 
  } catch (error) {
    console.log("❌ Login error:", error.code)
  }
}

</script>
