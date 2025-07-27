<template>
  <div class="dashboard-container">
    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <button
        @click="activeTab = 'users'"
        :class="{ active: activeTab === 'users' }"
        class="tab-button"
      >
        User Management
      </button>
      <button
        @click="activeTab = 'ratings'"
        :class="{ active: activeTab === 'ratings' }"
        class="tab-button"
      >
        Ratings Management
      </button>
    </div>

    <!-- User Management Tab -->
    <div v-if="activeTab === 'users'" class="tab-content">
      <h1>Admin Dashboard</h1>
      <h2>All Registered Users</h2>

      <!-- 添加新用户表单 -->
      <form class="add-user-form" @submit.prevent="addUser">
        <input v-model="newUser.username" placeholder="Username" required />
        <input v-model="newUser.email" placeholder="Email" required />
        <input v-model="newUser.password" placeholder="Password" required type="password" />
        <select v-model="newUser.role" required>
          <option value="guest">guest</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <!-- 用户表格 -->
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, idx) in users" :key="user.username">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="deleteUser(idx)" :disabled="user.role === 'admin' && user.username === 'admin'">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Ratings Management Tab -->
    <div v-if="activeTab === 'ratings'" class="tab-content">
      <h1>Ratings Management</h1>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon total">📊</div>
          <div class="stat-content">
            <h3>Total Ratings</h3>
            <p class="stat-number">{{ ratingsStats.totalRatings }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon average">⭐</div>
          <div class="stat-content">
            <h3>Average Rating</h3>
            <p class="stat-number">{{ ratingsStats.averageRating }}/5</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon recent">🕐</div>
          <div class="stat-content">
            <h3>Recent (30 days)</h3>
            <p class="stat-number">{{ ratingsStats.recentRatings }}</p>
          </div>
        </div>
      </div>

      <!-- Service Breakdown -->
      <div class="service-breakdown">
        <h3>Service Ratings Overview</h3>
        <div class="breakdown-grid">
          <div v-for="(service, key) in serviceStats" :key="key" class="breakdown-item">
            <div class="service-info">
              <h4>{{ getServiceName(key) }}</h4>
              <div class="service-stats">
                <span class="rating">{{ service.average }}/5</span>
                <span class="count">({{ service.count }} reviews)</span>
              </div>
            </div>
            <div class="rating-stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ 'filled': i <= Math.round(service.average) }">★</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filters">
          <div class="filter-group">
            <label>Service:</label>
            <select v-model="selectedService" @change="applyFilters">
              <option value="all">All Services</option>
              <option value="gp">General Practice</option>
              <option value="specialist">Specialist Consultations</option>
              <option value="mental">Mental Health Services</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Sort by:</label>
            <select v-model="sortBy" @change="applyFilters">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Search:</label>
            <input
              v-model="searchTerm"
              @input="applyFilters"
              type="text"
              placeholder="Search by name or review..."
            />
          </div>
        </div>

        <div class="action-buttons">
          <button @click="refreshData" class="btn btn-refresh">
            Refresh Data
          </button>

          <button @click="exportRatingsData" class="btn btn-export">
            Export Ratings
          </button>

          <button @click="clearAllRatings" class="btn btn-danger">
            Clear All Ratings
          </button>
        </div>
      </div>

      <!-- Ratings Table -->
      <div class="ratings-table-container">
        <div class="table-header">
          <h3>All Ratings ({{ filteredRatings.length }})</h3>
        </div>

        <div class="table-wrapper" v-if="filteredRatings.length > 0">
          <table class="ratings-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Service</th>
                <th>Overall Rating</th>
                <th>Review</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rating in paginatedRatings" :key="rating.id" class="rating-row">
                <td class="date-cell">
                  {{ formatDate(rating.timestamp) }}
                </td>
                <td class="user-cell">
                  <div class="user-info">
                    <div class="user-avatar">{{ getUserName(rating).charAt(0).toUpperCase() }}</div>
                    <span>{{ getUserName(rating) }}</span>
                  </div>
                </td>
                <td class="service-cell">
                  <span class="service-badge" :class="rating.service">
                    {{ rating.serviceName }}
                  </span>
                </td>
                <td class="rating-cell">
                  <div class="rating-display">
                    <div class="stars">
                      <span v-for="i in 5" :key="i" class="star" :class="{ 'filled': i <= rating.rating.overall }">★</span>
                    </div>
                    <span class="rating-number">{{ rating.rating.overall }}/5</span>
                  </div>
                </td>
                <td class="review-cell">
                  <div class="review-text" :title="rating.rating.review">
                    {{ rating.rating.review || 'No review provided' }}
                  </div>
                </td>
                <td class="actions-cell">
                  <button @click="toggleDetails(rating.id)" class="btn btn-small">
                    {{ expandedRows.includes(rating.id) ? 'Hide' : 'Details' }}
                  </button>
                  <button @click="deleteRating(rating.id)" class="btn btn-delete">
                    Delete
                  </button>
                </td>
              </tr>

              <!-- Expanded Row Details -->
              <tr v-for="rating in paginatedRatings" :key="`details-${rating.id}`" v-show="expandedRows.includes(rating.id)" class="details-row">
                <td colspan="6">
                  <div class="rating-details">
                    <h4>Rating Details:</h4>
                    <div class="details-grid">
                      <div class="detail-item">
                        <span class="label">Service Quality:</span>
                        <div class="detail-rating">
                          <span v-for="i in 5" :key="i" class="star small" :class="{ 'filled': i <= rating.rating.quality }">★</span>
                          <span>{{ rating.rating.quality || 0 }}/5</span>
                        </div>
                      </div>
                      <div class="detail-item">
                        <span class="label">Wait Time:</span>
                        <div class="detail-rating">
                          <span v-for="i in 5" :key="i" class="star small" :class="{ 'filled': i <= rating.rating.waitTime }">★</span>
                          <span>{{ rating.rating.waitTime || 0 }}/5</span>
                        </div>
                      </div>
                      <div class="detail-item">
                        <span class="label">Communication:</span>
                        <div class="detail-rating">
                          <span v-for="i in 5" :key="i" class="star small" :class="{ 'filled': i <= rating.rating.communication }">★</span>
                          <span>{{ rating.rating.communication || 0 }}/5</span>
                        </div>
                      </div>
                      <div class="detail-item">
                        <span class="label">Facilities:</span>
                        <div class="detail-rating">
                          <span v-for="i in 5" :key="i" class="star small" :class="{ 'filled': i <= rating.rating.facilities }">★</span>
                          <span>{{ rating.rating.facilities || 0 }}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="btn btn-small"
            >
              Previous
            </button>

            <span class="page-info">
              Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="btn btn-small"
            >
              Next
            </button>
          </div>
        </div>

        <div v-else class="no-ratings-message">
          <p>No ratings found. Initialize preset data or wait for users to submit ratings.</p>
          <button @click="refreshData" class="btn btn-refresh">
            Load Preset Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { initializeHealthcareData } from '@/utils/initData.js'

// Tab management
const activeTab = ref('users')

// User management (existing functionality)
const users = ref([])
const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'guest'
})

// Ratings management
const ratings = ref([])
const selectedService = ref('all')
const sortBy = ref('newest')
const searchTerm = ref('')
const expandedRows = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

// Service names mapping
const serviceNames = {
  gp: 'General Practice Services',
  specialist: 'Specialist Consultations',
  mental: 'Mental Health Services'
}

// Load users (existing functionality)
function loadUsers() {
  let loaded = JSON.parse(localStorage.getItem('users') || '[]')
  loaded.forEach(u => {
    if (!u.role) u.role = 'guest'
  })
  users.value = loaded
  localStorage.setItem('users', JSON.stringify(loaded))
}

// Add user (existing functionality)
function addUser() {
  if (users.value.some(u => u.username === newUser.value.username)) {
    alert('Username already exists!')
    return
  }
  users.value.push({ ...newUser.value })
  localStorage.setItem('users', JSON.stringify(users.value))
  Object.assign(newUser.value, {
    username: '',
    email: '',
    password: '',
    role: 'guest'
  })
}

// Delete user (existing functionality)
function deleteUser(idx) {
  if (users.value[idx].role === 'admin' && users.value[idx].username === 'admin') {
    alert('Cannot delete default admin!')
    return
  }
  users.value.splice(idx, 1)
  localStorage.setItem('users', JSON.stringify(users.value))
}

// Load ratings data
function loadRatings() {
  try {
    const savedRatings = localStorage.getItem('healthcareRatings')
    if (savedRatings) {
      ratings.value = JSON.parse(savedRatings)
      console.log('Loaded ratings:', ratings.value.length)
    } else {
      ratings.value = []
    }
  } catch (error) {
    console.error('Error loading ratings:', error)
    ratings.value = []
  }
}

// Get user name from rating (handle different data structures)
function getUserName(rating) {
  return rating.user?.username || rating.rating?.userName || 'Unknown User'
}

// Computed properties for ratings
const ratingsStats = computed(() => {
  const total = ratings.value.length
  const average = total > 0 ?
    (ratings.value.reduce((sum, r) => sum + r.rating.overall, 0) / total).toFixed(1) : '0.0'

  // Recent ratings (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recent = ratings.value.filter(r => new Date(r.timestamp) > thirtyDaysAgo).length

  return {
    totalRatings: total,
    averageRating: average,
    recentRatings: recent
  }
})

const serviceStats = computed(() => {
  const stats = {}
  Object.keys(serviceNames).forEach(key => {
    const serviceRatings = ratings.value.filter(r => r.service === key)
    stats[key] = {
      count: serviceRatings.length,
      average: serviceRatings.length > 0 ?
        (serviceRatings.reduce((sum, r) => sum + r.rating.overall, 0) / serviceRatings.length).toFixed(1) : '0.0'
    }
  })
  return stats
})

const filteredRatings = computed(() => {
  let filtered = ratings.value

  // Filter by service
  if (selectedService.value !== 'all') {
    filtered = filtered.filter(r => r.service === selectedService.value)
  }

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(r => {
      const userName = getUserName(r).toLowerCase()
      const review = (r.rating.review || '').toLowerCase()
      const serviceName = (r.serviceName || '').toLowerCase()

      return userName.includes(term) ||
             review.includes(term) ||
             serviceName.includes(term)
    })
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.timestamp) - new Date(a.timestamp)
      case 'oldest':
        return new Date(a.timestamp) - new Date(b.timestamp)
      case 'highest':
        return b.rating.overall - a.rating.overall
      case 'lowest':
        return a.rating.overall - b.rating.overall
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredRatings.value.length / itemsPerPage)
})

const paginatedRatings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRatings.value.slice(start, end)
})

// Methods
const getServiceName = (key) => {
  return serviceNames[key] || key
}

const formatDate = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

const applyFilters = () => {
  currentPage.value = 1
}

const toggleDetails = (ratingId) => {
  const index = expandedRows.value.indexOf(ratingId)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(ratingId)
  }
}

const deleteRating = (ratingId) => {
  if (confirm('Are you sure you want to delete this rating?')) {
    ratings.value = ratings.value.filter(r => r.id !== ratingId)
    localStorage.setItem('healthcareRatings', JSON.stringify(ratings.value))

    // Update service statistics
    updateServiceStatistics()

    // Also remove from expanded rows if it was expanded
    const expandedIndex = expandedRows.value.indexOf(ratingId)
    if (expandedIndex > -1) {
      expandedRows.value.splice(expandedIndex, 1)
    }
  }
}

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
          user: getUserName(r),
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
    console.log('Service statistics updated from admin dashboard')
  } catch (error) {
    console.error('Error updating service statistics:', error)
  }
}

const exportRatingsData = () => {
  const dataStr = JSON.stringify(ratings.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `healthcare-ratings-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const clearAllRatings = () => {
  if (confirm('Are you sure you want to clear all rating data? This action cannot be undone.')) {
    ratings.value = []
    localStorage.removeItem('healthcareRatings')
    localStorage.removeItem('healthcareServicesData')
    localStorage.removeItem('healthcareAdminSummary')
    expandedRows.value = []
    console.log('All ratings data cleared')
  }
}

// Refresh all data
const refreshData = () => {
  console.log('Refreshing admin dashboard data...')

  // First initialize preset data if needed
  initializeHealthcareData()

  // Then load the data
  loadRatings()

  // Update statistics to ensure everything is in sync
  updateServiceStatistics()
}

onMounted(() => {
  console.log('Admin dashboard mounted')

  // Initialize preset data if needed
  initializeHealthcareData()

  // Load user data
  loadUsers()

  // Load and initialize ratings data
  loadRatings()

  // Update statistics to ensure everything is in sync
  updateServiceStatistics()
})
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  overflow: hidden;
}

/* Tab Navigation */
.tab-navigation {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.tab-button {
  flex: 1;
  padding: 1rem 2rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #6c757d;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: #e9ecef;
  color: #495057;
}

.tab-button.active {
  background: #fff;
  color: #1976d2;
  border-bottom: 3px solid #1976d2;
}

.tab-content {
  padding: 2rem;
}

/* User Management Styles (existing) */
.add-user-form {
  margin-bottom: 2rem;
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.add-user-form input, .add-user-form select {
  padding: 0.4rem 0.7rem;
  border-radius: 4px;
  border: 1px solid #aaa;
  min-width: 120px;
}

.add-user-form button {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 1.2rem;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.2rem;
}

th, td {
  border-bottom: 1px solid #e0e0e0;
  padding: 0.7rem 0.3rem;
  text-align: left;
}

th {
  background: #f9f9fb;
}

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Ratings Management Styles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.total { background: #e3f2fd; }
.stat-icon.average { background: #fff3e0; }
.stat-icon.recent { background: #f3e5f5; }

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-number {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.service-breakdown {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.service-breakdown h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.breakdown-grid {
  display: grid;
  gap: 1rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 6px;
}

.service-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.service-stats {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.service-stats .rating {
  font-weight: 600;
  color: #1976d2;
}

.service-stats .count {
  color: #6c757d;
  font-size: 0.9rem;
}

.filters-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #6c757d;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh {
  background: #17a2b8;
  color: white;
}

.btn-refresh:hover {
  background: #138496;
}

.btn-export {
  background: #28a745;
  color: white;
}

.btn-export:hover {
  background: #218838;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  background: #6c757d;
  color: white;
}

.btn-small:hover {
  background: #5a6268;
}

.btn-delete {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
}

.btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.ratings-table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.table-header {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.table-header h3 {
  margin: 0;
  color: #2c3e50;
}

.table-wrapper {
  overflow-x: auto;
}

.ratings-table {
  width: 100%;
  border-collapse: collapse;
}

.ratings-table th,
.ratings-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.ratings-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.service-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.service-badge.gp { background: #007bff; }
.service-badge.specialist { background: #28a745; }
.service-badge.mental { background: #ffc107; color: #212529; }

.rating-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 0.9rem;
}

.star.filled {
  color: #ffd700;
}

.star.small {
  font-size: 0.7rem;
}

.rating-number {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.8rem;
}

.review-text {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.details-row {
  background: #f8f9fa;
}

.rating-details {
  padding: 1rem;
}

.rating-details h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  font-weight: 500;
  color: #6c757d;
}

.detail-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
}

.page-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.no-ratings-message {
  padding: 3rem;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    margin: 1rem;
  }

  .tab-content {
    padding: 1rem;
  }

  .filters {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .breakdown-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .actions-cell {
    flex-direction: column;
  }
}
</style>
