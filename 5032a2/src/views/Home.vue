<template>
  <section>
    <h1>欢迎来到健康服务平台</h1>
    <p>我们提供专业的医疗服务，在线咨询及快速预约。</p>
    <ServiceCard v-for="svc in featured" :key="svc.id" :service="svc" />
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import ServiceCard from '@/components/ServiceCard.vue'

export default {
  components: { ServiceCard },
  setup() {
    const featured = ref([])
    onMounted(async () => {
      // 模拟接口调用
      featured.value = await fetch('/api/featured-services').then(r => r.json())
    })
    return { featured }
  },
}
</script>
