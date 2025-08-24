<script setup>
import { onMounted, ref, onBeforeUnmount, computed } from 'vue'

// --- 持久化 Key ---
const KEY_FONT = 'a11y_font_pct'
const KEY_CONTRAST = 'a11y_high_contrast'
const KEY_REDUCEMOTION = 'a11y_reduce_motion'

// --- 字体百分比与范围(逐级增减) ---
const MIN = 70
const MAX = 200
const STEP = 20
const fontPct = ref(100) // 100% = 默认

// --- 其它设置 ---
const showModal = ref(false)
const highContrast = ref(false)
const reduceMotion = ref(false)

// 映射：弹窗三档按钮的“激活态”
const pillSmall = 90
const pillNormal = 100
const pillLarge = 120
const activePill = computed(() => {
  if (Math.abs(fontPct.value - pillSmall) <= 1) return 'small'
  if (Math.abs(fontPct.value - pillNormal) <= 1) return 'normal'
  if (Math.abs(fontPct.value - pillLarge) <= 1) return 'large'
  return ''
})

// 应用字体（同时设置 html font-size 与 可选 CSS 变量）
function applyFont() {
  document.documentElement.style.fontSize = fontPct.value + '%'
  // 若你样式里想用变量缩放，也可使用 --font-scale
  document.body.style.setProperty('--font-scale', String(fontPct.value / 100))
  localStorage.setItem(KEY_FONT, String(fontPct.value))
}

// 右下角快捷三键
function inc() {
  fontPct.value = Math.min(MAX, fontPct.value + STEP)
  applyFont()
}
function dec() {
  fontPct.value = Math.max(MIN, fontPct.value - STEP)
  applyFont()
}
function reset() {
  fontPct.value = 100
  applyFont()
}

// 弹窗里的开关
function applyContrast(on) {
  document.documentElement.setAttribute('data-contrast', on ? 'high' : 'normal')
  localStorage.setItem(KEY_CONTRAST, on ? '1' : '0')
}
function applyReduceMotion(on) {
  document.documentElement.setAttribute('data-reduced-motion', on ? '1' : '0')
  localStorage.setItem(KEY_REDUCEMOTION, on ? '1' : '0')
}

// 弹窗开关
function openModal(){ showModal.value = true }
function closeModal(){ showModal.value = false }
function handleKey(e){ if (e.key === 'Escape' && showModal.value) closeModal() }

onMounted(() => {
  // 恢复字体
  const saved = parseInt(localStorage.getItem(KEY_FONT) || '100', 10)
  fontPct.value = Number.isFinite(saved) ? Math.min(MAX, Math.max(MIN, saved)) : 100
  applyFont()

  // 恢复对比度/动效
  highContrast.value = localStorage.getItem(KEY_CONTRAST) === '1'
  applyContrast(highContrast.value)
  reduceMotion.value = localStorage.getItem(KEY_REDUCEMOTION) === '1'
  applyReduceMotion(reduceMotion.value)

  window.addEventListener('keydown', handleKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))
</script>

<template>
  <!-- 右下角：快捷三键 + 入口按钮 -->
  <div class="a11y-fab" role="group" aria-label="Accessibility quick controls">
    <button
      class="qbtn"
      :disabled="fontPct<=70"
      @click="dec"
      aria-label="Decrease font size"
      title="A-"
    >A-</button>

    <button
      class="qbtn mid"
      @click="reset"
      aria-label="Reset font size"
      title="A"
    >A</button>

    <button
      class="qbtn"
      :disabled="fontPct>=200"
      @click="inc"
      aria-label="Increase font size"
      title="A+"
    >A+</button>

    <button class="fab" @click="openModal" aria-label="Open accessibility panel" title="Accessibility">
      ☺
    </button>
  </div>

  <!-- 居中弹窗：更多设置 -->
  <div v-if="showModal" class="a11y-modal" role="dialog" aria-modal="true" aria-label="Accessibility Settings">
    <div class="a11y-backdrop" @click="closeModal"></div>
    <div class="a11y-card">
      <div class="a11y-card-hd">
        <h3>Accessibility Settings</h3>
        <button class="close" @click="closeModal" aria-label="Close">×</button>
      </div>

      <div class="a11y-card-bd">
        <div class="row">
          <div class="label">Font Size</div>
          <div class="controls">
            <button
              class="pill"
              :class="{on: activePill==='small'}"
              @click="fontPct=pillSmall;applyFont()"
            >Small</button>

            <button
              class="pill"
              :class="{on: activePill==='normal'}"
              @click="fontPct=pillNormal;applyFont()"
            >Normal</button>

            <button
              class="pill"
              :class="{on: activePill==='large'}"
              @click="fontPct=pillLarge;applyFont()"
            >Large</button>
          </div>
        </div>

        <div class="row">
          <div class="label">High Contrast</div>
          <label class="switch">
            <input type="checkbox" v-model="highContrast" @change="applyContrast(highContrast)" />
            <span></span>
          </label>
        </div>

        <div class="row">
          <div class="label">Reduce Motion</div>
          <label class="switch">
            <input type="checkbox" v-model="reduceMotion" @change="applyReduceMotion(reduceMotion)" />
            <span></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 右下角区域 */
.a11y-fab{
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 9999;
}
.qbtn{
  background:#28a745;
  color:#fff;
  border:none;
  border-radius:8px;
  padding:.45rem .6rem;
  font-weight:700;
  cursor:pointer;
  line-height:1;
  box-shadow:0 2px 8px rgba(0,0,0,.15);
}
.qbtn.mid{ background:#20c997; }
.qbtn:disabled{ background:#94d3a2; cursor:not-allowed; }
.fab{
  width:44px;height:44px;border-radius:50%;
  background:#1976d2;color:#fff;border:none;cursor:pointer;
  box-shadow:0 3px 12px rgba(0,0,0,.2);font-size:18px;font-weight:700;
}

/* 居中弹窗 */
.a11y-modal{position:fixed;inset:0;z-index:10000;}
.a11y-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.35);}
.a11y-card{
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  width:min(520px,92vw);background:#fff;border-radius:12px;overflow:hidden;
  box-shadow:0 12px 40px rgba(0,0,0,.25);
}
.a11y-card-hd{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px;border-bottom:1px solid #eee;
}
.a11y-card-hd h3{margin:0;font-size:18px;font-weight:700;}
.close{border:none;background:none;font-size:22px;cursor:pointer;line-height:1;}
.a11y-card-bd{padding:16px;display:grid;gap:14px;}
.row{display:flex;align-items:center;justify-content:space-between;gap:12px}
.label{color:#555;font-weight:600;}
.controls{display:flex;gap:8px}
.pill{
  border:1px solid #d0cfe0;background:#f7f7fb;color:#333;
  padding:.4rem .8rem;border-radius:999px;cursor:pointer;font-weight:600;
}
.pill.on{background:#1976d2;color:#fff;border-color:#1976d2}

/* 开关 */
.switch{position:relative;width:48px;height:26px;display:inline-block}
.switch input{display:none}
.switch span{
  position:absolute;inset:0;background:#ddd;border-radius:13px;transition:.2s;
}
.switch span:before{
  content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;
  background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2);
}
.switch input:checked + span{background:#28a745}
.switch input:checked + span:before{transform:translateX(22px)}
</style>
