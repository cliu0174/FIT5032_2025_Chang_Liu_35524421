<template>
  <div class="card">
    <img :src="service.image" alt="service.name" />
    <h2>{{ service.name }}</h2>
    <p>{{ service.description }}</p>
  </div>
</template>

<script>
export default {
  props: { service: Object },
}
</script>

<style scoped>
.card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin: 1rem; }
.card img { width: 100%; height: auto; border-radius: 4px; }
</style>
