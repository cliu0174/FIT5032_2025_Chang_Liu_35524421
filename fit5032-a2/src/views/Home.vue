<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background"></div>
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <div class="hero-content">
              <div class="hero-badge">
                <i class="fas fa-heart me-2"></i>
                Supporting Communities
              </div>
              <h1 class="hero-title">
                Empowering <span class="text-gradient">Migrant Health</span>
                Through Compassionate Care
              </h1>
              <p class="hero-description">
                We provide essential health services, resources, and support to help migrant
                communities navigate healthcare systems and build healthier, more prosperous lives.
              </p>
              <div class="hero-actions">
                <router-link to="/services" class="btn btn-primary btn-lg me-3">
                  <i class="fas fa-hand-holding-heart me-2"></i>
                  Explore Services
                </router-link>
                <a href="tel:+1-555-0100" class="btn btn-outline-primary btn-lg">
                  <i class="fas fa-phone me-2"></i>
                  Get Help Now
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-visual">
              <div class="floating-card card-1">
                <i class="fas fa-user-md"></i>
                <span>Healthcare Navigation</span>
              </div>
              <div class="floating-card card-2">
                <i class="fas fa-language"></i>
                <span>12 Languages</span>
              </div>
              <div class="floating-card card-3">
                <i class="fas fa-users"></i>
                <span>5,000+ Helped</span>
              </div>
              <div class="hero-image">
                <div class="image-placeholder">
                  <i class="fas fa-globe-americas fa-8x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3 mb-4" v-for="(stat, index) in statistics" :key="stat.label">
            <div class="stat-card" :style="{ animationDelay: `${index * 0.1}s` }">
              <div class="stat-icon">
                <i :class="stat.icon"></i>
              </div>
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Preview -->
    <section class="services-preview py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title">Our Core Services</h2>
          <p class="section-subtitle">Comprehensive support designed for migrant communities</p>
          <div class="title-decoration"></div>
        </div>

        <div class="row">
          <div class="col-md-4 mb-4" v-for="(service, index) in featuredServices" :key="service.id">
            <div class="service-preview-card" :style="{ animationDelay: `${index * 0.2}s` }">
              <ServiceCard :service="service" @rate="handleRating" />
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <router-link to="/services" class="btn btn-primary btn-lg">
            <i class="fas fa-arrow-right me-2"></i>
            View All Services
          </router-link>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2 class="section-title text-white">Community Stories</h2>
          <p class="section-subtitle text-white opacity-75">Real experiences from our community members</p>
          <div class="title-decoration bg-white"></div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4" v-for="(testimonial, index) in recentTestimonials" :key="testimonial.id">
            <div class="testimonial-card" :style="{ animationDelay: `${index * 0.3}s` }">
              <div class="testimonial-content">
                <div class="quote-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <p class="testimonial-text">"{{ testimonial.text }}"</p>
                <div class="testimonial-footer">
                  <div class="stars">
                    <i v-for="n in 5" :key="n"
                       :class="n <= testimonial.rating ? 'fas fa-star' : 'far fa-star'">
                    </i>
                  </div>
                  <div class="author">
                    <strong>{{ testimonial.author }}</strong>
                    <small class="text-muted">Community Member</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta py-5">
      <div class="container">
        <div class="cta-card">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <h3 class="cta-title">Need Immediate Assistance?</h3>
              <p class="cta-description">
                Our 24/7 helpline provides emergency support in multiple languages.
                Don't hesitate to reach out when you need help.
              </p>
            </div>
            <div class="col-lg-4 text-lg-end">
              <a href="tel:+1-555-0100" class="btn btn-danger btn-lg pulse-btn">
                <i class="fas fa-phone-alt me-2"></i>
                Call +1-555-0100
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import ServiceCard from '../components/ServiceCard.vue'
import { getServices } from '../data/services.js'
import { getTestimonials } from '../data/testimonials.js'

export default {
  name: 'Home',
  components: {
    ServiceCard
  },
  setup() {
    const statistics = ref([
      { label: 'People Helped', value: '5,000+', icon: 'fas fa-users' },
      { label: 'Languages Supported', value: '12', icon: 'fas fa-globe' },
      { label: 'Service Locations', value: '25+', icon: 'fas fa-map-marker-alt' },
      { label: 'Healthcare Partners', value: '50+', icon: 'fas fa-hospital' }
    ])

    const featuredServices = ref([])
    const recentTestimonials = ref([])

    const loadData = () => {
      const allServices = getServices()
      featuredServices.value = allServices.slice(0, 3)

      const allTestimonials = getTestimonials()
      recentTestimonials.value = allTestimonials.slice(0, 2)
    }

    const handleRating = (serviceId, rating) => {
      console.log(`Service ${serviceId} rated: ${rating}`)
    }

    onMounted(() => {
      loadData()
    })

    return {
      statistics,
      featuredServices,
      recentTestimonials,
      handleRating
    }
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.05;
  z-index: -1;
}

.hero-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
}

.hero-content {
  padding: 2rem 0;
  animation: slideInLeft 1s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 500;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(37, 99, 235, 0.2);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #111827;
}

.text-gradient {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  color: white;
  text-decoration: none;
}

.btn-outline-primary {
  background: transparent;
  color: #2563eb;
  border: 2px solid #2563eb;
}

.btn-outline-primary:hover {
  background: #2563eb;
  color: white;
  transform: translateY(-2px);
  text-decoration: none;
}

.btn-lg {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.hero-visual {
  position: relative;
  height: 500px;
  animation: slideInRight 1s ease-out;
}

.hero-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: float 3s ease-in-out infinite;
}

.floating-card {
  position: absolute;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: #374151;
  animation: float 3s ease-in-out infinite;
}

.floating-card i {
  color: #2563eb;
  font-size: 1.25rem;
}

.card-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 20%;
  right: 10%;
  animation-delay: 1s;
}

.card-3 {
  bottom: 20%;
  left: 5%;
  animation-delay: 2s;
}

.stats {
  background: white;
  position: relative;
}

.stat-card {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease-out both;
}

.stat-card:hover {
  transform: translateY(-10px);
}

.stat-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 2rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  color: #6b7280;
  font-weight: 500;
}

.services-preview {
  background: #f9fafb;
}

.section-header {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.title-decoration {
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  margin: 0 auto;
  border-radius: 2px;
}

.title-decoration.bg-white {
  background: white;
}

.service-preview-card {
  animation: fadeInUp 0.8s ease-out both;
}

.testimonials {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  position: relative;
  overflow: hidden;
}

.testimonials::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.testimonial-card {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  height: 100%;
  position: relative;
  animation: fadeInUp 0.8s ease-out both;
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.quote-icon {
  position: absolute;
  top: -10px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.testimonial-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #374151;
  margin: 1.5rem 0;
  font-style: italic;
}

.testimonial-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stars {
  color: #f59e0b;
  font-size: 1rem;
}

.author strong {
  display: block;
  color: #111827;
}

.author small {
  color: #6b7280;
}

.cta {
  background: white;
}

.cta-card {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border-radius: 1rem;
  padding: 3rem;
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.1rem;
  margin-bottom: 0;
  opacity: 0.9;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  color: white;
  text-decoration: none;
}

.pulse-btn {
  animation: pulse 2s infinite;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

/* 动画 */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-visual {
    height: 300px;
    margin-top: 2rem;
  }

  .hero-image {
    width: 200px;
    height: 200px;
  }

  .floating-card {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-card {
    padding: 2rem;
    text-align: center;
  }

  .cta-title {
    font-size: 1.5rem;
  }
}
</style>
