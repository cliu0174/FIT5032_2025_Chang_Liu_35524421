<template>
  <div class="accessibility-toolbar">
    <button @click="increaseFont" aria-label="Increase font size">A+</button>
    <button @click="decreaseFont" aria-label="Decrease font size">A-</button>
    <button @click="resetFont" aria-label="Reset font size">A</button>
    <button @click="toggleContrast" aria-label="Toggle high contrast">
      {{ isHighContrast ? '☀ Normal' : '🌙 High Contrast' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fontSize = ref(100) // 百分比
const isHighContrast = ref(false)

function applyFontSize() {
  document.documentElement.style.fontSize = fontSize.value + '%'
}

function increaseFont() {
  fontSize.value = Math.min(fontSize.value + 10, 150)
  applyFontSize()
}

function decreaseFont() {
  fontSize.value = Math.max(fontSize.value - 10, 70)
  applyFontSize()
}

function resetFont() {
  fontSize.value = 100
  applyFontSize()
}

function toggleContrast() {
  isHighContrast.value = !isHighContrast.value
  document.body.classList.toggle('high-contrast', isHighContrast.value)
}
</script>

<style scoped>
.accessibility-toolbar {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 8px;
  z-index: 9999;
}

button {
  padding: 0.3rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

button:hover {
  background: #f1f1f1;
}

.high-contrast * {
  background: black !important;
  color: yellow !important;
  border-color: yellow !important;
}
</style>
