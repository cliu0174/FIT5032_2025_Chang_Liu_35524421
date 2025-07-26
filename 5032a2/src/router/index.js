import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Services from '../views/Services.vue'
import Appointment from '../views/Appointment.vue'
import Contact from '../views/Contact.vue'
import Login from '../views/Login.vue'    // ← 新增

const routes = [
  { path: '/', component: Home },
  { path: '/services', component: Services },
  { path: '/appointment', component: Appointment },
  { path: '/contact', component: Contact },
  { path: '/login', component: Login },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
