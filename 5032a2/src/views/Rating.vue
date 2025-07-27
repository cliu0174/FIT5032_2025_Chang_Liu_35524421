<template>
  <div class="rating-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <button @click="goBack" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/>
          </svg>
          Back
        </button>
        <h1>Rate Your Experience</h1>
      </div>

      <!-- Service Info Card -->
      <div class="service-info-card">
        <div class="service-header">
          <div class="service-icon" :class="serviceType">
            <svg v-if="serviceType === 'gp'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 14C20.49 12.54 22 10.79 22 8.5C22 5.42 19.58 3 16.5 3C14.76 3 13.25 3.89 12.36 5.27C11.47 3.89 9.96 3 8.22 3C5.14 3 2.72 5.42 2.72 8.5C2.72 10.79 4.23 12.54 5.72 14L12 20.27L19 14Z" fill="currentColor"/>
            </svg>
            <svg v-else-if="serviceType === 'specialist'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V13C2 18.5 6.84 20.74 12 22C17.16 20.74 22 18.5 22 13V7L12 2Z" fill="currentColor"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3C13.66 3 15 4.34 15 6C15 7.66 13.66 9 12 9S9 7.66 9 6 10.34 3 12 3M12 21C10.34 21 9 19.66 9 18C9 16.34 10.34 15 12 15S15 16.34 15 18 13.66 21 12 21M12 13.5C11.17 13.5 10.5 12.83 10.5 12S11.17 10.5 12 10.5 13.5 11.17 13.5 12 12.83 13.5 12 13.5Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h2>{{ serviceName }}</h2>
            <p class="service-description">{{ serviceDescription }}</p>
          </div>
        </div>
      </div>

      <!-- Rating Form -->
      <form @submit.prevent="submitRating" class="rating-form" @click.stop>
        <!-- Overall Rating -->
        <div class="rating-section">
          <h3>Overall Experience <span class="required">*</span></h3>
          <p class="section-description">How would you rate your overall experience with this service?</p>
          <div class="rating-stars-container">
            <div class="interactive-stars large">
              <span
                v-for="i in 5"
                :key="i"
                class="star"
                :class="{ 'filled': i <= ratings.overall, 'hover': i <= hoverRating.overall }"
                @click="setRating('overall', i)"
                @mouseenter="setHoverRating('overall', i)"
                @mouseleave="setHoverRating('overall', 0)"
              >★</span>
            </div>
            <span class="rating-label">{{ getRatingLabel(ratings.overall) }}</span>
          </div>
        </div>

        <!-- Category Ratings -->
        <div class="rating-section">
          <h3>Rate Specific Aspects</h3>
          <p class="section-description">Help us understand your experience better by rating these specific areas:</p>

          <div class="category-ratings">
            <div v-for="category in categories" :key="category.key" class="category-item">
              <div class="category-header">
                <h4>{{ category.label }}</h4>
                <p class="category-description">{{ category.description }}</p>
              </div>
              <div class="rating-row">
                <div class="interactive-stars">
                  <span
                    v-for="i in 5"
                    :key="`${category.key}-${i}`"
                    class="star"
                    :class="{ 'filled': i <= ratings[category.key], 'hover': i <= hoverRating[category.key] }"
                    @click.prevent="setRating(category.key, i)"
                    @mouseenter="setHoverRating(category.key, i)"
                    @mouseleave="setHoverRating(category.key, 0)"
                  >★</span>
                </div>
                <span class="rating-value">{{ ratings[category.key] > 0 ? `${ratings[category.key]}/5` : 'Not rated' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Written Review -->
        <div class="rating-section">
          <h3>Share Your Experience</h3>
          <p class="section-description">Your feedback helps other patients and helps us improve our services</p>
          <textarea
            v-model="reviewText"
            placeholder="Tell us about your experience... What went well? What could be improved?"
            rows="6"
            class="review-textarea"
            maxlength="500"
          ></textarea>
          <div class="character-count">{{ reviewText.length }}/500 characters</div>
        </div>

        <!-- Submit Section -->
        <div class="submit-section">
          <button type="button" @click="goBack" class="btn btn-secondary" :disabled="isSubmitting">Cancel</button>
          <button
            type="submit"
            @click="submitRating"
            class="btn btn-primary"
            :disabled="!canSubmit || isSubmitting"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Rating' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Define props if using props: true in router
const props = defineProps({
  service: {
    type: String,
    default: 'gp'
  }
})

// Get service type from props or route params
const serviceType = ref(props.service || route.params.service || 'gp')

// Service information
const serviceInfo = {
  gp: {
    name: 'General Practice Services',
    description: 'Primary healthcare including routine check-ups and general consultations'
  },
  specialist: {
    name: 'Specialist Consultations',
    description: 'Specialized medical care from expert physicians'
  },
  mental: {
    name: 'Mental Health Services',
    description: 'Professional mental health support and counseling'
  }
}

const serviceName = computed(() => serviceInfo[serviceType.value]?.name || 'Healthcare Service')
const serviceDescription = computed(() => serviceInfo[serviceType.value]?.description || '')

// Rating categories
const categories = [
  {
    key: 'quality',
    label: 'Service Quality',
    description: 'The quality of medical care and treatment received'
  },
  {
    key: 'waitTime',
    label: 'Wait Time',
    description: 'How long you waited for your appointment'
  },
  {
    key: 'communication',
    label: 'Communication',
    description: 'How well the staff communicated with you'
  },
  {
    key: 'facilities',
    label: 'Facilities',
    description: 'The cleanliness and comfort of the facility'
  }
]

// Rating data
const ratings = ref({
  overall: 0,
  quality: 0,
  waitTime: 0,
  communication: 0,
  facilities: 0
})

const hoverRating = ref({
  overall: 0,
  quality: 0,
  waitTime: 0,
  communication: 0,
  facilities: 0
})

const reviewText = ref('')
const isSubmitting = ref(false)

// Check if user is logged in
const checkUserLogin = () => {
  const currentUser = localStorage.getItem('currentUser')
  if (!currentUser) {
    alert('Please login to rate services')
    router.push('/login')
    return null
  }
  return JSON.parse(currentUser)
}

// Reset all rating data
const resetRatingData = () => {
  ratings.value = {
    overall: 0,
    quality: 0,
    waitTime: 0,
    communication: 0,
    facilities: 0
  }
  hoverRating.value = {
    overall: 0,
    quality: 0,
    waitTime: 0,
    communication: 0,
    facilities: 0
  }
  reviewText.value = ''
}

// Watch for route changes to reset data
watch(() => route.params.service, (newService) => {
  if (newService) {
    serviceType.value = newService
    resetRatingData()
  }
})

// Get rating label
const getRatingLabel = (rating) => {
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  return labels[rating] || 'Click to rate'
}

// Set rating
const setRating = (category, value) => {
  console.log(`Setting ${category} rating to ${value}`)
  ratings.value[category] = value
}

// Set hover rating
const setHoverRating = (category, value) => {
  hoverRating.value[category] = value
}

// Check if can submit
const canSubmit = computed(() => {
  return ratings.value.overall > 0
})

// Go back to services page
const goBack = () => {
  // Reset data before leaving
  resetRatingData()
  // Go to services page
  router.push('/services')
}

// Submit rating
const submitRating = async () => {
  console.log('Submit rating clicked!')
  console.log('Current ratings:', ratings.value)
  console.log('Can submit:', canSubmit.value)
  console.log('Is submitting:', isSubmitting.value)

  if (isSubmitting.value) {
    console.log('Already submitting, returning')
    return
  }

  const user = checkUserLogin()
  console.log('Current user:', user)
  if (!user) {
    console.log('No user found, redirecting to login')
    return
  }

  if (!canSubmit.value) {
    console.log('Cannot submit - overall rating:', ratings.value.overall)
    alert('Please provide an overall rating before submitting')
    return
  }

  console.log('Starting submission process...')
  isSubmitting.value = true

  try {
    // Create rating object with more detailed information
    const ratingData = {
      id: Date.now().toString(),
      service: serviceType.value,
      serviceName: serviceName.value,
      rating: {
        overall: ratings.value.overall,
        quality: ratings.value.quality,
        waitTime: ratings.value.waitTime,
        communication: ratings.value.communication,
        facilities: ratings.value.facilities,
        review: reviewText.value.trim()
      },
      user: {
        username: user.username,
        userId: user.id || user.username
      },
      timestamp: new Date().toISOString(),
      submittedAt: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    console.log('Rating data to save:', ratingData)

    // Get existing ratings from localStorage
    const existingRatings = JSON.parse(localStorage.getItem('healthcareRatings') || '[]')
    console.log('Existing ratings count:', existingRatings.length)

    // Add new rating to the beginning of the array (newest first)
    existingRatings.unshift(ratingData)

    // Save updated ratings to localStorage
    localStorage.setItem('healthcareRatings', JSON.stringify(existingRatings))
    console.log('Rating saved to localStorage')
    console.log('Total ratings in storage:', existingRatings.length)

    // Update service statistics
    updateServiceStatistics()
    console.log('Service statistics updated')

    // Show success message
    alert('Thank you for your feedback! Your rating has been submitted successfully.')

    // Reset form data
    resetRatingData()
    console.log('Form data reset')

    // Navigate to services page after successful submission
    console.log('Navigating to services page...')
    setTimeout(() => {
      router.push('/services')
    }, 500)

  } catch (error) {
    console.error('Error submitting rating:', error)
    alert(`An error occurred while submitting your rating: ${error.message}. Please try again.`)
  } finally {
    isSubmitting.value = false
    console.log('Submit process completed')
  }
}

// Update service statistics for dashboard/analytics
const updateServiceStatistics = () => {
  try {
    const ratings = JSON.parse(localStorage.getItem('healthcareRatings') || '[]')
    let servicesData = JSON.parse(localStorage.getItem('healthcareServicesData') || '{}')

    // Initialize all services if not exists
    const serviceTypes = ['gp', 'specialist', 'mental']
    serviceTypes.forEach(serviceKey => {
      if (!servicesData[serviceKey]) {
        servicesData[serviceKey] = {
          averageRating: 0,
          totalReviews: 0,
          categories: [
            { name: 'Service Quality', rating: 0, key: 'quality' },
            { name: 'Wait Time', rating: 0, key: 'waitTime' },
            { name: 'Communication', rating: 0, key: 'communication' },
            { name: 'Facilities', rating: 0, key: 'facilities' }
          ],
          recentRatings: []
        }
      }
    })

    // Calculate statistics for each service
    serviceTypes.forEach(serviceKey => {
      const serviceRatings = ratings.filter(r => r.service === serviceKey)
      const service = servicesData[serviceKey]

      if (serviceRatings.length > 0) {
        // Calculate average overall rating
        const totalOverall = serviceRatings.reduce((sum, r) => sum + r.rating.overall, 0)
        service.averageRating = Number((totalOverall / serviceRatings.length).toFixed(1))
        service.totalReviews = serviceRatings.length

        // Calculate category averages
        service.categories[0].rating = Number((serviceRatings.reduce((sum, r) => sum + (r.rating.quality || 0), 0) / serviceRatings.length).toFixed(1))
        service.categories[1].rating = Number((serviceRatings.reduce((sum, r) => sum + (r.rating.waitTime || 0), 0) / serviceRatings.length).toFixed(1))
        service.categories[2].rating = Number((serviceRatings.reduce((sum, r) => sum + (r.rating.communication || 0), 0) / serviceRatings.length).toFixed(1))
        service.categories[3].rating = Number((serviceRatings.reduce((sum, r) => sum + (r.rating.facilities || 0), 0) / serviceRatings.length).toFixed(1))

        // Store recent ratings (last 5)
        service.recentRatings = serviceRatings.slice(0, 5).map(r => ({
          id: r.id,
          overall: r.rating.overall,
          review: r.rating.review,
          user: r.user?.username || 'Anonymous',
          date: r.submittedAt || r.timestamp
        }))
      } else {
        service.averageRating = 0
        service.totalReviews = 0
        service.categories.forEach(cat => cat.rating = 0)
        service.recentRatings = []
      }
    })

    // Save updated service data
    localStorage.setItem('healthcareServicesData', JSON.stringify(servicesData))

    // Also create a summary for admin dashboard
    const adminSummary = {
      totalRatings: ratings.length,
      averageOverallRating: ratings.length > 0 ?
        Number((ratings.reduce((sum, r) => sum + r.rating.overall, 0) / ratings.length).toFixed(1)) : 0,
      lastUpdated: new Date().toISOString(),
      serviceBreakdown: servicesData
    }

    localStorage.setItem('healthcareAdminSummary', JSON.stringify(adminSummary))

    console.log('Service statistics updated:', servicesData)
  } catch (error) {
    console.error('Error updating service statistics:', error)
  }
}

// Initialize component
onMounted(() => {
  try {
    // Reset data on mount
    resetRatingData()

    // Check login status
    const user = checkUserLogin()
    if (!user) return

    // Log for debugging
    console.log('Rating page mounted for service:', serviceType.value)

    // Initialize localStorage data if not exists
    if (!localStorage.getItem('healthcareServicesData')) {
      const initialServicesData = {
        gp: {
          averageRating: 0,
          totalReviews: 0,
          categories: [
            { name: 'Service Quality', rating: 0, key: 'quality' },
            { name: 'Wait Time', rating: 0, key: 'waitTime' },
            { name: 'Communication', rating: 0, key: 'communication' },
            { name: 'Facilities', rating: 0, key: 'facilities' }
          ],
          recentRatings: []
        },
        specialist: {
          averageRating: 0,
          totalReviews: 0,
          categories: [
            { name: 'Service Quality', rating: 0, key: 'quality' },
            { name: 'Wait Time', rating: 0, key: 'waitTime' },
            { name: 'Communication', rating: 0, key: 'communication' },
            { name: 'Facilities', rating: 0, key: 'facilities' }
          ],
          recentRatings: []
        },
        mental: {
          averageRating: 0,
          totalReviews: 0,
          categories: [
            { name: 'Service Quality', rating: 0, key: 'quality' },
            { name: 'Wait Time', rating: 0, key: 'waitTime' },
            { name: 'Communication', rating: 0, key: 'communication' },
            { name: 'Facilities', rating: 0, key: 'facilities' }
          ],
          recentRatings: []
        }
      }
      localStorage.setItem('healthcareServicesData', JSON.stringify(initialServicesData))
    }

    if (!localStorage.getItem('healthcareRatings')) {
      localStorage.setItem('healthcareRatings', JSON.stringify([]))
    }

    if (!localStorage.getItem('healthcareAdminSummary')) {
      const initialSummary = {
        totalRatings: 0,
        averageOverallRating: 0,
        lastUpdated: new Date().toISOString(),
        serviceBreakdown: {}
      }
      localStorage.setItem('healthcareAdminSummary', JSON.stringify(initialSummary))
    }
  } catch (error) {
    console.error('Error initializing rating page:', error)
  }
})
</script>

<style scoped>
.rating-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.page-header {
  margin-bottom: 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  color: #495057;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.back-button:hover {
  background: #f8f9fa;
  transform: translateX(-2px);
}

.page-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0;
}

/* Service Info Card */
.service-info-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.service-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.service-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.service-icon.gp { background: linear-gradient(135deg, #667eea, #764ba2); }
.service-icon.specialist { background: linear-gradient(135deg, #00c896, #00a67e); }
.service-icon.mental { background: linear-gradient(135deg, #f093fb, #f5576c); }

.service-icon svg {
  width: 30px;
  height: 30px;
}

.service-header h2 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.service-description {
  margin: 0;
  color: #6c757d;
}

/* Rating Form */
.rating-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  z-index: 1;
}

.rating-section {
  margin-bottom: 2.5rem;
}

.rating-section h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.required {
  color: #dc3545;
}

.section-description {
  color: #6c757d;
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

/* Rating Stars */
.rating-stars-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.interactive-stars {
  display: flex;
  gap: 4px;
  position: relative;
  z-index: 10;
}

.interactive-stars.large .star {
  font-size: 2.5rem;
}

.star {
  font-size: 1.75rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  position: relative;
  z-index: 20;
  display: inline-block;
  padding: 0.25rem;
}

.star.filled {
  color: #ffd700;
}

.star.hover {
  color: #ffed4e;
  transform: scale(1.1);
}

.rating-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

/* Category Ratings */
.category-ratings {
  display: grid;
  gap: 1.5rem;
}

.category-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.category-header h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.category-description {
  margin: 0 0 0.75rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.rating-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-value {
  color: #6c757d;
  font-weight: 500;
  min-width: 80px;
  text-align: right;
}

/* Review Textarea */
.review-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s;
}

.review-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.character-count {
  text-align: right;
  color: #6c757d;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Submit Section */
.submit-section {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
}

/* Buttons */
.btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #c5cae9;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Responsive */
@media (max-width: 768px) {
  .service-header {
    flex-direction: column;
    text-align: center;
  }

  .rating-stars-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .rating-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .rating-value {
    text-align: left;
  }

  .submit-section {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
