<template>
  <section>
    <h1>在线预约</h1>
    <AppointmentForm @submitted="onSubmit" />
  </section>
</template>

<script>
import AppointmentForm from '@/components/AppointmentForm.vue'

export default {
  components: { AppointmentForm },
  methods: {
    onSubmit(data) {
      // 提交预约
      console.log('预约数据：', data)
      alert('预约成功！')
    }
  }
}
</script>
