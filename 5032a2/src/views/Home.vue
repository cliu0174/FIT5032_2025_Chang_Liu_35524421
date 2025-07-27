<template>
  <div class="home-page">
    <!-- Hero Section with Simple Carousel -->
    <section class="hero-section">
      <!-- Background Carousel -->
      <div class="hero-carousel">
        <div
          v-for="(image, index) in heroImages"
          :key="index"
          class="hero-slide"
          :class="{ 'active': currentSlide === index }"
          :style="{ backgroundImage: `url(${image.url})` }"
          @error="handleImageError(index)"
        >
          <!-- 添加调试用的当前幻灯片指示 -->
          <div class="debug-info" v-if="currentSlide === index">
            Slide {{ index + 1 }}
          </div>
        </div>
      </div>

      <!-- Hero Content (保持原样) -->
      <div class="container">
        <h1 class="hero-title">HarmoNest Health Foundation</h1>
        <p class="hero-subtitle">Making healthcare accessible and responsive to local needs</p>
        <div class="hero-actions">
          <router-link to="/services" class="btn btn-primary">Our Services</router-link>
          <router-link to="/appointment" class="btn btn-secondary">Book Appointment</router-link>
        </div>
      </div>

      <!-- Simple Indicators -->
      <div class="simple-indicators">
        <span
          v-for="(image, index) in heroImages"
          :key="index"
          class="dot"
          :class="{ 'active': currentSlide === index }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </section>

    <!-- Statistics Section (完全保持原样) -->
    <section class="statistics-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 14C20.49 12.54 22 10.79 22 8.5C22 5.42 19.58 3 16.5 3C14.76 3 13.25 3.89 12.36 5.27C11.47 3.89 9.96 3 8.22 3C5.14 3 2.72 5.42 2.72 8.5C2.72 10.79 4.23 12.54 5.72 14L12 20.27L19 14Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ animatedStats.gp }}+</h3>
              <p class="stat-description">Australians can not access a GP less than one hour from home *</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ animatedStats.indigenous }}+</h3>
              <p class="stat-description">Australians, including 9,132 (21.3%) of Indigenous Australians have NO access to any primary health care services within a 60-minute drive time. *</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 9.5V11.5L21 14V12L15.66 10L21 9ZM6.5 10H2.5C1.67 10 1 10.67 1 11.5S1.67 13 2.5 13H6.5C7.33 13 8 12.33 8 11.5S7.33 10 6.5 10Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-number">{{ animatedStats.mental }}+</h3>
              <p class="stat-description">Australians have no access to mental health services *</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Statement (修改内容避免雷同) -->
    <section class="mission-section">
      <div class="container">
        <div class="mission-content">
          <p class="mission-text">
            For more than two decades, <strong>The HarmoNest Health Foundation's Community Wellness Network</strong>
            has been collaborating with government agencies, local communities, and healthcare providers to ensure
            accessible, high-quality health and wellness services that meet the unique needs of each region.
          </p>
          <p class="source-text">*Source: Australian Health Services Research Institute 2020</p>
        </div>
      </div>
    </section>

    <!-- 移除：Good Health Made Easy 横幅 -->
    <!-- 已经移动到Hero区域内 -->

    <!-- Testimonial Section (修改见证内容和图片) -->
    <section class="testimonial-section">
      <div class="container">
        <div class="testimonial-content">
          <div class="testimonial-image">
            <img :src="testimonialImage" alt="Patient testimonial" />
          </div>
          <div class="testimonial-text">
            <div class="quote-icon">"</div>
            <div class="testimonial-quotes">
              <p>The care, dedication and professional excellence I received truly exceeded my expectations. What touched me most was the ongoing support and genuine concern shown by the entire team. I felt valued and heard throughout my journey.</p>

              <p>I want to express my heartfelt gratitude to every staff member who demonstrated such kindness and empathy.</p>

              <p><strong>Thank you from the bottom of my heart.</strong></p>

              <p>Our entire community benefits from your commitment, and we hope you'll continue serving us for many years ahead.</p>
            </div>
            <div class="testimonial-author">
              <strong>Margaret (Patient, June 2024)</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action (完全保持原样) -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Access Quality Healthcare?</h2>
        <p>Join thousands of Australians who trust our network for their healthcare needs</p>
        <div class="cta-actions">
          <router-link to="/appointment" class="btn btn-primary">Book an Appointment</router-link>
          <router-link to="/services" class="btn btn-outline">Learn More</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 方案1: 使用 import 导入本地图片
import hero1 from '@/assets/hero1.png'
import hero2 from '@/assets/hero2.png'
import hero3 from '@/assets/hero3.png'
import hero4 from '@/assets/hero4.png'

// 导入见证图片
import testimonialImage from '@/assets/testimonial.png'

// 轮播图片 (使用导入的图片)
const heroImages = ref([
  { url: hero1 },
  { url: hero2 },
  { url: hero3 },
  { url: hero4 }
])

// 备用方案：如果import失败，使用直接路径
const fallbackImages = ref([
  { url: '/src/assets/hero1.png' },
  { url: '/src/assets/hero2.png' },
  { url: '/src/assets/hero3.png' },
  { url: '/src/assets/hero4.png' }
])

// 在线备用图片
const onlineBackup = [
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
]

const currentSlide = ref(0)
let carouselTimer = null

// 轮播控制
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroImages.value.length
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// 图片加载错误处理
const handleImageError = (index) => {
  console.log(`图片 ${index + 1} 加载失败，尝试备用方案`)

  // 先尝试直接路径
  if (heroImages.value[index].url.includes('assets')) {
    console.log('尝试使用直接路径')
    heroImages.value[index].url = fallbackImages.value[index].url
  } else {
    // 最后使用在线图片
    console.log('使用在线备用图片')
    heroImages.value[index].url = onlineBackup[index]
  }
}

// 调试：打印当前状态
const logCurrentState = () => {
  console.log('当前轮播状态:', {
    currentSlide: currentSlide.value,
    totalSlides: heroImages.value.length,
    images: heroImages.value.map(img => img.url)
  })
}

// 测试图片加载
const testImageLoad = () => {
  heroImages.value.forEach((img, index) => {
    const testImg = new Image()
    testImg.onload = () => console.log(`图片 ${index + 1} 加载成功:`, img.url)
    testImg.onerror = () => {
      console.log(`图片 ${index + 1} 加载失败:`, img.url)
      handleImageError(index)
    }
    testImg.src = img.url
  })
}

// 动画统计数据 (保持原样)
const animatedStats = ref({
  gp: 0,
  indigenous: 0,
  mental: 0
})

// 目标数据 (保持原样)
const targetStats = {
  gp: 65000,
  indigenous: 42800,
  mental: 106800
}

// 数字动画函数 (保持原样)
function animateNumber(target, current, key, duration = 2000) {
  const increment = target / (duration / 16) // 60fps
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      animatedStats.value[key] = target.toLocaleString()
      clearInterval(timer)
    } else {
      animatedStats.value[key] = Math.floor(current).toLocaleString()
    }
  }, 16)
}

// 组件挂载时启动动画和轮播
onMounted(() => {
  // 测试图片加载
  testImageLoad()

  // 启动轮播
  carouselTimer = setInterval(nextSlide, 4000)

  // 调试信息
  console.log('轮播组件已挂载')
  console.log('图片导入结果:', { hero1, hero2, hero3, hero4 })
  logCurrentState()

  // 启动统计动画 (保持原样)
  setTimeout(() => {
    animateNumber(targetStats.gp, 0, 'gp', 2000)
  }, 500)

  setTimeout(() => {
    animateNumber(targetStats.indigenous, 0, 'indigenous', 2500)
  }, 800)

  setTimeout(() => {
    animateNumber(targetStats.mental, 0, 'mental', 3000)
  }, 1100)
})

// 清理定时器
onUnmounted(() => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Hero Section - 只修改这部分添加轮播 */
.hero-section {
  position: relative;
  color: white;
  padding: 4rem 0;
  text-align: center;
  overflow: hidden;
  /* 确保有最小高度 */
  min-height: 400px;
}

/* 轮播背景 */
.hero-carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  /* 添加备用背景色 */
  background-color: #667eea;
}

.hero-slide.active {
  opacity: 1;
}

/* 调试信息样式 */
.debug-info {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
}

/* 确保内容在背景之上 */
.hero-section .container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 添加轻微的遮罩确保文字清晰 */
.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

/* 简单的指示器 */
.simple-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s ease;
}

.dot.active {
  background: white;
}

/* 以下所有样式完全保持原样 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.2;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  font-weight: 400;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Statistics Section */
.statistics-section {
  background: #f8f9fa;
  padding: 4rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card:nth-child(1) .stat-icon {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
}

.stat-card:nth-child(2) .stat-icon {
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
}

.stat-card:nth-child(3) .stat-icon {
  background: linear-gradient(135deg, #45b7d1, #96c93d);
  color: white;
}

.stat-icon svg {
  width: 30px;
  height: 30px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.stat-description {
  color: #6c757d;
  line-height: 1.5;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
}

/* Mission Section */
.mission-section {
  background: white;
  padding: 3rem 0;
  text-align: center;
}

.mission-content {
  max-width: 800px;
  margin: 0 auto;
}

.mission-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 400;
}

.source-text {
  font-size: 0.9rem;
  color: #6c757d;
  font-style: italic;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Hero Section内的健康横幅 */
.health-banner-overlay {
  background: rgba(102, 51, 153, 0.95);
  padding: 1.5rem 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
}

.health-banner-overlay .banner-title {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
  text-transform: lowercase;
  letter-spacing: 2px;
  text-align: center;
}

.health-banner-overlay .banner-title span {
  display: inline-block;
  margin: 0 0.3rem;
}

.health-banner-overlay .good {
  color: #00bcd4; /* 青色 */
}

.health-banner-overlay .health {
  color: #e91e63; /* 粉色 */
}

.health-banner-overlay .made {
  color: #2196f3; /* 蓝色 */
}

.health-banner-overlay .easy {
  color: #4caf50; /* 绿色 */
}

.health-banner-overlay .banner-subtitle {
  font-size: 1rem;
  line-height: 1.6;
  text-align: center;
  color: white;
}

.health-banner-overlay .highlight-teal {
  color: #00bcd4;
  font-weight: 600;
}

.health-banner-overlay .highlight-pink {
  color: #e91e63;
  font-weight: 600;
}

.health-banner-overlay .highlight-blue {
  color: #2196f3;
  font-weight: 600;
}

.health-banner-overlay .highlight-green {
  color: #4caf50;
  font-weight: 600;
}

/* Testimonial Section */
.testimonial-section {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding: 4rem 0;
}

.testimonial-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: center;
}

.testimonial-image {
  position: relative;
}

.testimonial-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.testimonial-text {
  position: relative;
}

.quote-icon {
  font-size: 4rem;
  color: #667eea;
  font-family: serif;
  line-height: 1;
  margin-bottom: 1rem;
}

.testimonial-quotes p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 400;
}

.testimonial-author {
  color: #667eea;
  font-size: 1.1rem;
  margin-top: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  background: #2c3e50;
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
}

.cta-section p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 400;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-primary:hover {
  background: #5a67d8;
  border-color: #5a67d8;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background: white;
  color: #667eea;
}

.btn-outline {
  background: transparent;
  color: white;
  border-color: white;
}

.btn-outline:hover {
  background: white;
  color: #2c3e50;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .testimonial-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .testimonial-image img {
    height: 300px;
  }

  .cta-section h2 {
    font-size: 2rem;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 1.8rem;
  }

  .health-banner-overlay .banner-title {
    font-size: 1.5rem;
  }

  .health-banner-overlay .banner-subtitle {
    font-size: 0.8rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .mission-text {
    font-size: 1rem;
  }

  .testimonial-quotes p {
    font-size: 1rem;
  }
}
</style>
