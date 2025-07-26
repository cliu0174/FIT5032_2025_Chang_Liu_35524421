<template>
  <section>
    <h1>全部服务</h1>
    <ServiceCard v-for="s in services" :key="s.id" :service="s" />
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import ServiceCard from '@/components/ServiceCard.vue'

export default {
  components: { ServiceCard },
  setup() {
    const services = ref([])
    onMounted(async () => {
      services.value = await fetch('/api/services').then(r => r.json())
    })
    return { services }
  },
}
</script>
