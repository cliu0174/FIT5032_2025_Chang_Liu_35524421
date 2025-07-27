<template>
  <div class="unauthorized-page container my-5 text-center">
    <h1 class="display-4">403 - Unauthorized</h1>
    <p class="lead">You do not have permission to access this page.</p>
    <router-link to="/" class="btn btn-primary">Go to Home</router-link>
  </div>
</template>

<script setup>
// This component displays when user tries to access a restricted page
</script>

<style scoped>
.unauthorized-page {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}
.btn-primary:hover {
  opacity: 0.9;
}
</style>
