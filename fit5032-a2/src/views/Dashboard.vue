<template>
  <div class="dashboard">
    <div class="container py-4">
      <!-- Welcome Section -->
      <div class="row mb-4">
        <div class="col-12">
          <h2>Welcome, {{ currentUser?.name }}!</h2>
          <p class="text-muted">
            Role: <span class="badge bg-primary">{{ currentUser?.role }}</span>
            Type: <span class="badge bg-secondary">{{ currentUser?.userType }}</span>
          </p>
        </div>
      </div>

      <!-- User Stats -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="fas fa-calendar-check fa-2x text-primary mb-2"></i>
              <h5>Member Since</h5>
              <p class="text-muted">{{ memberSince }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="fas fa-star fa-2x text-warning mb-2"></i>
              <h5>Ratings Given</h5>
              <p class="text-muted">{{ userStats.ratingsCount }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="fas fa-heart fa-2x text-danger mb-2"></i>
              <h5>Services Used</h5>
              <p class="text-muted">{{ userStats.servicesUsed }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card text-center">
            <div class="card-body">
              <i class="fas fa-clock fa-2x text-info mb-2"></i>
              <h5>Last Login</h5>
              <p class="text-muted">{{ lastLoginFormatted }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- My Ratings Section -->
      <div class="row mb-4">
        <div class="col-12">
          <h4>My Service Ratings</h4>
          <div v-if="myRatings.length === 0" class="alert alert-info">
            You haven't rated any services yet.
            <router-link to="/services">Explore our services</router-link> to get started!
          </div>
          <div v-else>
            <div class="row">
              <div class="col-md-6 mb-3" v-for="rating in myRatings" :key="rating.serviceId">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">{{ getServiceName(rating.serviceId) }}</h6>
                    <div class="stars mb-2">
                      <i v-for="n in 5" :key="n"
                         :class="n <= rating.rating ? 'fas fa-star text-warning' : 'far fa-star text-muted'">
                      </i>
                      <span class="ms-2">{{ rating.rating }}/5</span>
                    </div>
                    <p class="card-text small" v-if="rating.comment">
                      "{{ rating.comment }}"
                    </p>
                    <small class="text-muted">Rated on {{ formatDate(rating.timestamp) }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-4">
        <div class="col-12">
          <h4>Quick Actions</h4>
          <div class="row">
            <div class="col-md-4 mb-3">
              <router-link to="/services" class="btn btn-outline-primary w-100">
                <i class="fas fa-search me-2"></i>
                Browse Services
              </router-link>
            </div>
            <div class="col-md-4 mb-3">
              <button class="btn btn-outline-success w-100" @click="updatePreferences">
                <i class="fas fa-cog me-2"></i>
                Update Preferences
              </button>
            </div>
            <div class="col-md-4 mb-3">
              <a href="tel:+1-555-0100" class="btn btn-outline-danger w-100">
                <i class="fas fa-phone me-2"></i>
                Emergency Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Section (只有管理员可见 - 满足Category C要求：角色权限) -->
      <div v-if="currentUser?.role === 'admin'" class="row">
        <div class="col-12">
          <div class="alert alert-warning">
            <h5><i class="fas fa-shield-alt me-2"></i>Admin Functions</h5>
            <p>You have administrative privileges. Access the admin panel for advanced features.</p>
            <router-link to="/admin" class="btn btn-warning">
              Go to Admin Panel
            </router-link>
          </div>
        </div>
      </div>

      <!-- User Preferences -->
      <div class="row" v-if="showPreferences">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>My Preferences</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="savePreferences">
                <div class="mb-3">
                  <label class="form-label">Language</label>
                  <select v-model="preferences.language" class="form-select">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="ar">Arabic</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input v-model="preferences.notifications" class="form-check-input" type="checkbox" id="notifications">
                    <label class="form-check-label" for="notifications">
                      Receive email notifications
                    </label>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input v-model="preferences.newsletter" class="form-check-input" type="checkbox" id="newsletter">
                    <label class="form-check-label" for="newsletter">
                      Subscribe to newsletter
                    </label>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary me-2">Save Preferences</button>
                <button type="button" class="btn btn-secondary" @click="showPreferences = false">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { getRatings, getUserPreferences, setUserPreferences } from '../utils/storage.js'
import { getServiceById } from '../data/services.js'

export default {
  name: 'Dashboard',
  props: {
    currentUser: Object
  },
  setup(props) {
    const showPreferences = ref(false)
    const myRatings = ref([])
    const preferences = ref({
      language: 'en',
      notifications: true,
      newsletter: false
    })

    // 计算属性
    const memberSince = computed(() => {
      if (props.currentUser?.loginTime) {
        return new Date(props.currentUser.loginTime).toLocaleDateString()
      }
      return 'Recently'
    })

    const lastLoginFormatted = computed(() => {
      if (props.currentUser?.loginTime) {
        return new Date(props.currentUser.loginTime).toLocaleString()
      }
      return 'Now'
    })

    const userStats = computed(() => {
      return {
        ratingsCount: myRatings.value.length,
        servicesUsed: new Set(myRatings.value.map(r => r.serviceId)).size
      }
    })

    // 方法
    const loadUserRatings = () => {
      if (!props.currentUser) return

      const allRatings = getRatings()
      myRatings.value = Object.values(allRatings)
        .filter(rating => rating.userId === props.currentUser.id)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }

    const loadUserPreferences = () => {
      const stored = getUserPreferences()
      if (stored) {
        preferences.value = { ...stored }
      }
    }

    const getServiceName = (serviceId) => {
      const service = getServiceById(serviceId)
      return service ? service.title : 'Unknown Service'
    }

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleDateString()
    }

    const updatePreferences = () => {
      showPreferences.value = true
    }

    const savePreferences = () => {
      setUserPreferences(preferences.value)
      showPreferences.value = false
      alert('Preferences saved successfully!')
    }

    onMounted(() => {
      loadUserRatings()
      loadUserPreferences()
    })

    return {
      showPreferences,
      myRatings,
      preferences,
      memberSince,
      lastLoginFormatted,
      userStats,
      getServiceName,
      formatDate,
      updatePreferences,
      savePreferences
    }
  }
}
</script>

<style scoped>
.dashboard {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.stars i {
  font-size: 0.9rem;
}

.badge {
  font-size: 0.75rem;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
}
</style>
