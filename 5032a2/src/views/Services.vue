<template>
  <div class="services-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title">Our Healthcare Services</h1>
        <p class="hero-subtitle">Comprehensive medical care tailored to your community's needs</p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services-section">
      <div class="container">
        <div class="services-grid">
          <!-- GP Services -->
          <div class="service-card">
            <div class="service-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 14C20.49 12.54 22 10.79 22 8.5C22 5.42 19.58 3 16.5 3C14.76 3 13.25 3.89 12.36 5.27C11.47 3.89 9.96 3 8.22 3C5.14 3 2.72 5.42 2.72 8.5C2.72 10.79 4.23 12.54 5.72 14L12 20.27L19 14Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="service-content">
              <h3 class="service-title">General Practice (GP) Services</h3>
              <p class="service-description">
                Comprehensive primary healthcare including routine check-ups, preventive care,
                chronic disease management, and general medical consultations.
              </p>

              <!-- Service Rating Display -->
              <div class="service-rating">
                <div class="rating-summary">
                  <div class="stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ 'filled': i <= Math.round(services.gp.averageRating) }">★</span>
                  </div>
                  <span class="rating-score">{{ services.gp.averageRating.toFixed(1) }}</span>
                  <span class="rating-count">({{ services.gp.totalReviews }} reviews)</span>
                </div>

                <!-- Rating Breakdown -->
                <div class="rating-breakdown">
                  <div v-for="category in services.gp.categories" :key="category.name" class="rating-item">
                    <span class="category-name">{{ category.name }}</span>
                    <div class="rating-stars">
                      <span v-for="i in 5" :key="i" class="star small" :class="{ 'filled': i <= Math.round(category.rating) }">★</span>
                    </div>
                    <span class="category-score">{{ category.rating.toFixed(1) }}</span>
                  </div>
                </div>
              </div>

              <div class="service-actions">
                <router-link to="/appointment" class="btn btn-primary">Book Appointment</router-link>
                <router-link to="/rating/gp" class="btn btn-outline">Rate Service</router-link>
              </div>
            </div>
          </div>

          <!-- Specialist Services -->
          <div class="service-card">
            <div class="service-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V13C2 18.5 6.84 20.74 12 22C17.16 20.74 22 18.5 22 13V7L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="service-content">
              <h3 class="service-title">Specialist Consultations</h3>
              <p class="service-description">
                Access to specialized medical care including cardiology, dermatology,
                orthopedics, and other specialist services through our network.
              </p>

              <!-- Service Rating Display -->
              <div class="service-rating">
                <div class="rating-summary">
                  <div class="stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ 'filled': i <= Math.round(services.specialist.averageRating) }">★</span>
                  </div>
                  <span class="rating-score">{{ services.specialist.averageRating.toFixed(1) }}</span>
                  <span class="rating-count">({{ services.specialist.totalReviews }} reviews)</span>
                </div>

                <!-- Rating Breakdown -->
                <div class="rating-breakdown">
                  <div v-for="category in services.specialist.categories" :key="category.name" class="rating-item">
                    <span class="category-name">{{ category.name }}</span>
                    <div class="rating-stars">
                      <span v-for="i in 5" :key="i" class="star small" :class="{ 'filled': i <= Math.round(category.rating) }">★</span>
                    </div>
                    <span class="category-score">{{ category.rating.toFixed(1) }}</span>
                  </div>
                </div>
              </div>

              <div class="service-actions">
                <router-link to="/appointment" class="btn btn-primary">Book Appointment</router-link>
                <router-link to="/rating/specialist" class="btn btn-outline">Rate Service</router-link>
              </div>
            </div>
          </div>

          <!-- Mental Health Services -->
          <div class="service-card">
            <div class="service-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C13.66 3 15 4.34 15 6C15 7.66 13.66 9 12 9S9 7.66 9 6 10.34 3 12 3M12 21C10.34 21 9 19.66 9 18C9 16.34 10.34 15 12 15S15 16.34 15 18 13.66 21 12 21M12 13.5C11.17 13.5 10.5 12.83 10.5 12S11.17 10.5 12 10.5 13.5 11.17 13.5 12 12.83 13.5 12 13.5Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="service-content">
              <h3 class="service-title">Mental Health Services</h3>
              <p class="service-description">
                Professional mental health support including counseling, therapy,
                and psychiatric consultations to support your emotional wellbeing.
              </p>

              <!-- Service Rating Display -->
              <div class="service-rating">
                <div class="rating-summary">
                  <div class="stars">
                    <span v-for="i in 5" :key="i" class="star" :class="{ 'filled': i <= Math.round(services.mental.averageRating) }">★</span>
                  </div>
                  <span class="rating-score">{{ services.mental.averageRating.toFixed(1) }}</span>
                  <span class="rating-count">({{ services.mental.totalReviews }} reviews)</span>
                </div>

                <!-- Rating Breakdown -->
                <div class="rating-breakdown">
                  <div v-for="category in services.mental.categories" :key="category.name" class="rating-item">
                    <span class="category-name">{{ category.name }}</span>
                    <div class="rating-stars">
                      <span v-for="i in 5" :key="i" class="star small" :class="{ 'filled': i <= Math.round(category.rating) }">★</span>
                    </div>
                    <span class="category-score">{{ category.rating.toFixed(1) }}</span>
                  </div>
                </div>
              </div>

              <div class="service-actions">
                <router-link to="/appointment" class="btn btn-primary">Book Appointment</router-link>
                <router-link to="/rating/mental" class="btn btn-outline">Rate Service</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { initializeHealthcareData } from '@/utils/initData.js'

// Service rating data
const services = ref({
  gp: {
    averageRating: 0,
    totalReviews: 0,
    categories: [
      { name: 'Service Quality', rating: 0 },
      { name: 'Wait Time', rating: 0 },
      { name: 'Communication', rating: 0 },
      { name: 'Facilities', rating: 0 }
    ]
  },
  specialist: {
    averageRating: 0,
    totalReviews: 0,
    categories: [
      { name: 'Service Quality', rating: 0 },
      { name: 'Wait Time', rating: 0 },
      { name: 'Communication', rating: 0 },
      { name: 'Facilities', rating: 0 }
    ]
  },
  mental: {
    averageRating: 0,
    totalReviews: 0,
    categories: [
      { name: 'Service Quality', rating: 0 },
      { name: 'Wait Time', rating: 0 },
      { name: 'Communication', rating: 0 },
      { name: 'Facilities', rating: 0 }
    ]
  }
})

// Load service data from localStorage
const loadServicesData = () => {
  try {
    const savedData = localStorage.getItem('healthcareServicesData')
    if (savedData) {
      const data = JSON.parse(savedData)
      services.value = data
      console.log('Services data loaded:', data)
    }
  } catch (error) {
    console.error('Error loading services data:', error)
  }
}

// Calculate and update service statistics from all ratings
const updateServiceStatistics = () => {
  try {
    const ratings = JSON.parse(localStorage.getItem('healthcareRatings') || '[]')
    console.log('Total ratings found:', ratings.length)

    // Update each service
    Object.keys(services.value).forEach(serviceKey => {
      const serviceRatings = ratings.filter(r => r.service === serviceKey)
      const service = services.value[serviceKey]

      if (serviceRatings.length > 0) {
        // Calculate average overall rating
        const totalOverall = serviceRatings.reduce((sum, r) => sum + r.rating.overall, 0)
        service.averageRating = Number((totalOverall / serviceRatings.length).toFixed(1))
        service.totalReviews = serviceRatings.length

        // Calculate category averages
        const avgQuality = serviceRatings.reduce((sum, r) => sum + (r.rating.quality || 0), 0) / serviceRatings.length
        const avgWaitTime = serviceRatings.reduce((sum, r) => sum + (r.rating.waitTime || 0), 0) / serviceRatings.length
        const avgCommunication = serviceRatings.reduce((sum, r) => sum + (r.rating.communication || 0), 0) / serviceRatings.length
        const avgFacilities = serviceRatings.reduce((sum, r) => sum + (r.rating.facilities || 0), 0) / serviceRatings.length

        service.categories[0].rating = Number(avgQuality.toFixed(1))
        service.categories[1].rating = Number(avgWaitTime.toFixed(1))
        service.categories[2].rating = Number(avgCommunication.toFixed(1))
        service.categories[3].rating = Number(avgFacilities.toFixed(1))

        console.log(`${serviceKey}: ${service.averageRating}⭐ (${service.totalReviews} reviews)`)
      } else {
        // No ratings for this service
        service.averageRating = 0
        service.totalReviews = 0
        service.categories.forEach(cat => cat.rating = 0)
      }
    })

    // Save updated service data back to localStorage
    localStorage.setItem('healthcareServicesData', JSON.stringify(services.value))
    console.log('Service statistics updated and saved')
  } catch (error) {
    console.error('Error updating service statistics:', error)
  }
}

// Refresh data (useful when returning from rating page)
const refreshData = () => {
  console.log('Refreshing services data...')
  updateServiceStatistics()
  loadServicesData()
}

// Initialize component
onMounted(() => {
  console.log('Services page mounted')

  // Step 1: Initialize preset data if needed
  initializeHealthcareData()

  // Step 2: Update statistics from all ratings
  updateServiceStatistics()

  // Step 3: Load the updated data for display
  loadServicesData()
})

// Export refresh function for use by other components if needed
defineExpose({
  refreshData
})
</script>

<style scoped>
.services-page {
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Services Section */
.services-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.service-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
}

.service-icon svg {
  width: 30px;
  height: 30px;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.service-description {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* Rating Styles */
.service-rating {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.star.filled {
  color: #ffd700;
}

.star.small {
  font-size: 1rem;
}

.rating-score {
  font-weight: 600;
  color: #2c3e50;
}

.rating-count {
  color: #6c757d;
  font-size: 0.9rem;
}

.rating-breakdown {
  display: grid;
  gap: 0.5rem;
}

.rating-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0.5rem;
}

.category-name {
  font-size: 0.9rem;
  color: #6c757d;
}

.category-score {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
  min-width: 2rem;
}

.service-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border-color: #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .service-actions {
    flex-direction: column;
  }

  .rating-item {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style>
