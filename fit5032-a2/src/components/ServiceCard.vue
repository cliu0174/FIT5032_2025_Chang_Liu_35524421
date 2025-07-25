<template>
  <div class="service-card">
    <div class="card">
      <div class="card-header">
        <div class="service-icon">
          <i :class="service.icon"></i>
        </div>
        <div class="rating-display">
          <div class="stars">
            <i v-for="n in 5" :key="n"
               :class="n <= Math.round(serviceRating.average) ? 'fas fa-star' : 'far fa-star'">
            </i>
          </div>
          <small class="rating-count">({{ serviceRating.count }} reviews)</small>
        </div>
      </div>

      <div class="card-body">
        <h5 class="service-title">{{ service.title }}</h5>
        <p class="service-description">{{ service.description }}</p>

        <div class="service-meta">
          <div class="meta-item">
            <i class="fas fa-clock"></i>
            <span>{{ service.availability }}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-globe"></i>
            <span>{{ service.languages.slice(0, 2).join(', ') }}{{ service.languages.length > 2 ? '+' + (service.languages.length - 2) : '' }}</span>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <!-- Enhanced Rating System -->
        <div v-if="showRating" class="rating-section">
          <div class="rating-header">
            <h6>Rate this service</h6>
            <button class="btn-close-rating" @click="cancelRating">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="interactive-stars">
            <button
              v-for="n in 5"
              :key="n"
              class="star-btn"
              :class="{ 'active': n <= userRating, 'hovered': n <= hoveredRating }"
              @click="setRating(n)"
              @mouseenter="hoveredRating = n"
              @mouseleave="hoveredRating = 0"
            >
              <i class="fas fa-star"></i>
            </button>
          </div>

          <div class="rating-labels">
            <span class="rating-label">{{ getRatingLabel(userRating || hoveredRating) }}</span>
          </div>

          <textarea
            v-model="userComment"
            class="comment-input"
            rows="3"
            placeholder="Share your experience (optional)..."
            maxlength="200">
          </textarea>
          <small class="char-count">{{ userComment.length }}/200</small>

          <div class="rating-actions">
            <button
              class="btn btn-primary"
              @click="submitRating"
              :disabled="!userRating"
            >
              <i class="fas fa-paper-plane me-1"></i>
              Submit Review
            </button>
            <button class="btn btn-secondary" @click="cancelRating">
              Cancel
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-else class="action-buttons">
          <button class="btn btn-outline-primary" @click="toggleRating">
            <i class="fas fa-star me-1"></i>
            Rate Service
          </button>
          <a :href="service.contactLink" class="btn btn-primary">
            <i class="fas fa-phone me-1"></i>
            Contact
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { saveRating, getUserRating, getServiceRatings } from '../utils/storage.js'
import { validateRating, sanitizeInput } from '../utils/validation.js'

export default {
  name: 'ServiceCard',
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  emits: ['rate'],
  setup(props, { emit }) {
    const showRating = ref(false)
    const userRating = ref(0)
    const hoveredRating = ref(0)
    const userComment = ref('')
    const serviceRating = ref({ average: 0, count: 0 })

    const ratingLabels = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    }

    const getRatingLabel = (rating) => {
      return ratingLabels[rating] || 'Select Rating'
    }

    const loadServiceRating = () => {
      serviceRating.value = getServiceRatings(props.service.id)
    }

    const toggleRating = () => {
      showRating.value = !showRating.value
      if (showRating.value) {
        loadExistingRating()
      }
    }

    const loadExistingRating = () => {
      const existing = getUserRating(props.service.id)
      if (existing) {
        userRating.value = existing.rating
        userComment.value = existing.comment
      }
    }

    const setRating = (rating) => {
      userRating.value = rating
    }

    const submitRating = () => {
      const ratingValidation = validateRating(userRating.value)
      if (!ratingValidation.valid) {
        alert(ratingValidation.message)
        return
      }

      const cleanComment = sanitizeInput(userComment.value)
      const success = saveRating(props.service.id, userRating.value, cleanComment)

      if (success) {
        loadServiceRating()
        showRating.value = false
        emit('rate', props.service.id, userRating.value)

        // Show success message
        const notification = document.createElement('div')
        notification.className = 'toast-notification success'
        notification.innerHTML = `
          <i class="fas fa-check-circle me-2"></i>
          Thank you for your review!
        `
        document.body.appendChild(notification)

        setTimeout(() => {
          notification.remove()
        }, 3000)
      } else {
        alert('Please log in to rate services.')
      }
    }

    const cancelRating = () => {
      showRating.value = false
      userRating.value = 0
      hoveredRating.value = 0
      userComment.value = ''
    }

    onMounted(() => {
      loadServiceRating()
    })

    return {
      showRating,
      userRating,
      hoveredRating,
      userComment,
      serviceRating,
      getRatingLabel,
      toggleRating,
      setRating,
      submitRating,
      cancelRating
    }
  }
}
</script>

<style scoped>
.service-card {
  height: 100%;
}

.card {
  height: 100%;
  border: none;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.card-header {
  padding: 2rem 2rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
}

.service-icon {
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
  animation: float 3s ease-in-out infinite;
}

.rating-display {
  text-align: right;
}

.stars {
  color: var(--warning);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.stars i {
  margin: 0 1px;
}

.rating-count {
  color: var(--gray-500);
  font-size: 0.8rem;
  display: block;
}

.card-body {
  padding: 1rem 2rem;
  flex: 1;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.service-description {
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--gray-600);
}

.meta-item i {
  color: var(--primary);
  width: 16px;
  flex-shrink: 0;
}

.card-footer {
  padding: 1.5rem 2rem 2rem;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.rating-section {
  animation: fadeInUp 0.3s ease-out;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.rating-header h6 {
  margin: 0;
  font-weight: 600;
  color: var(--gray-800);
}

.btn-close-rating {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
}

.btn-close-rating:hover {
  color: var(--gray-600);
  background: var(--gray-100);
}

.interactive-stars {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--gray-300);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
}

.star-btn:hover,
.star-btn.hovered {
  color: var(--warning);
  transform: scale(1.1);
}

.star-btn.active {
  color: var(--warning);
  animation: starPulse 0.3s ease-out;
}

.rating-labels {
  text-align: center;
  margin-bottom: 1rem;
}

.rating-label {
  font-weight: 500;
  color: var(--gray-700);
  font-size: 0.9rem;
}

.comment-input {
  width: 100%;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 0.75rem;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.3s ease;
  margin-bottom: 0.25rem;
}

.comment-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.char-count {
  color: var(--gray-500);
  font-size: 0.75rem;
  text-align: right;
  display: block;
  margin-bottom: 1rem;
}

.rating-actions {
  display: flex;
  gap: 0.75rem;
}

.rating-actions .btn {
  flex: 1;
  padding: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius);
  transition: all 0.3s ease;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-buttons .btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-weight: 500;
  border-radius: var(--radius);
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-outline-primary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-outline-primary:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--gray-500);
  color: white;
  border: none;
}

.btn-secondary:hover {
  background: var(--gray-600);
  transform: translateY(-1px);
}

/* Toast notification styles */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--success);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
  display: flex;
  align-items: center;
}

/* 动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes starPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header,
  .card-body,
  .card-footer {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .service-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .action-buttons,
  .rating-actions {
    flex-direction: column;
  }

  .interactive-stars {
    gap: 0.5rem;
  }

  .star-btn {
    font-size: 1.5rem;
  }
}
</style>
