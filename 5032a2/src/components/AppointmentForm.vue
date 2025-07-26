<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>姓名：</label>
      <input v-model="form.name" required />
    </div>
    <div>
      <label>手机：</label>
      <input v-model="form.phone" required pattern="^1[3-9]\d{9}$" />
    </div>
    <div>
      <label>预约日期：</label>
      <input type="date" v-model="form.date" required />
    </div>
    <button type="submit">提交预约</button>
  </form>
</template>

<script>
import { reactive } from 'vue'

export default {
  emits: ['submitted'],
  setup(_, { emit }) {
    const form = reactive({ name: '', phone: '', date: '' })
    const handleSubmit = () => {
      emit('submitted', { ...form })
    }
    return { form, handleSubmit }
  }
}
</script>
