// src/store/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ info: null }),
  actions: {
    async login(credentials) {
      this.info = await fetch('/api/login', { method: 'POST', body: JSON.stringify(credentials) })
        .then(r => r.json())
    },
    logout() { this.info = null }
  }
})
