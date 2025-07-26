<template>
  <section class="contact-page">
    <h1>联系我们</h1>
    <p>如果你有任何问题或建议，欢迎给我们留言：</p>
    <form @submit.prevent="handleSubmit" class="contact-form">
      <div class="form-group">
        <label for="name">姓名</label>
        <input id="name" v-model="form.name" type="text" required />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input id="email" v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label for="message">留言内容</label>
        <textarea
          id="message"
          v-model="form.message"
          rows="5"
          required
        ></textarea>
      </div>
      <button type="submit">发送留言</button>
    </form>
  </section>
</template>

<script>
import { reactive } from 'vue'

export default {
  name: 'Contact',
  setup() {
    const form = reactive({
      name: '',
      email: '',
      message: ''
    })

    const handleSubmit = () => {
      // 这里可以换成真正的 API 调用
      console.log('Contact form submitted:', { ...form })
      alert('您的留言已发送，我们会尽快与您联系！')
      // 清空表单
      form.name = ''
      form.email = ''
      form.message = ''
    }

    return { form, handleSubmit }
  }
}
</script>

<style scoped>
.contact-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.contact-form .form-group {
  margin-bottom: 1rem;
}
.contact-form label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.contact-form button {
  padding: 0.6rem 1.2rem;
  border: none;
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  border-radius: 4px;
  cursor: pointer;
}
.contact-form button:hover {
  background-color: #35695a;
}
</style>
