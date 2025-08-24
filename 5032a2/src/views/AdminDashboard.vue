<template>
  <div class="dashboard-container">
    <!-- Tab Navigation -->
    <ChartView title="Healthcare Analytics Dashboard" />

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

      <!-- Users 工具栏 -->
      <div class="users-toolbar">
        <input
          v-model="userSearch"
          @input="userCurrentPage=1"
          placeholder="Global search (username/email)"
          aria-label="Global search users"
        />
        <select
          v-model="userRole"
          @change="userCurrentPage=1"
          aria-label="Filter role globally"
        >
          <option value="all">All roles (global)</option>
          <option value="admin">admin (global)</option>
          <option value="guest">guest (global)</option>
        </select>

        <div class="spacer"></div>

        <button class="btn btn-export btn-sm" @click="exportUsersCSV" :disabled="!flatUsers.length">Export CSV</button>
        <button class="btn btn-export btn-sm" @click="exportUsersXLSX" :disabled="!flatUsers.length">Export XLSX</button>
        <button class="btn btn-export btn-sm" @click="exportUsersPDF" :disabled="!flatUsers.length">Export PDF</button>
      </div>

      <!-- 用户表格 -->
      <table class="users-table">
        <thead>
          <tr>
            <th @click="toggleUserSort('username')" style="cursor:pointer">
              Username <span>{{ sortIcon('username') }}</span>
            </th>
            <th @click="toggleUserSort('email')" style="cursor:pointer">
              Email <span>{{ sortIcon('email') }}</span>
            </th>
            <th @click="toggleUserSort('role')" style="cursor:pointer">
              Role <span>{{ sortIcon('role') }}</span>
            </th>
            <th>Delete</th>
          </tr>
          <!-- 每列搜索行 -->
          <tr class="search-row">
            <th>
              <input
                v-model="columnFilters.username"
                @input="userCurrentPage=1"
                placeholder="Search username..."
                class="column-search"
                aria-label="Search by username"
              />
            </th>
            <th>
              <input
                v-model="columnFilters.email"
                @input="userCurrentPage=1"
                placeholder="Search email..."
                class="column-search"
                aria-label="Search by email"
              />
            </th>
            <th>
              <select
                v-model="columnFilters.role"
                @change="userCurrentPage=1"
                class="column-search"
                aria-label="Filter by role"
              >
                <option value="">All roles</option>
                <option value="admin">admin</option>
                <option value="guest">guest</option>
              </select>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.username">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role || 'guest' }}</td>
            <td>
              <button
                @click="deleteUserByKey(user.username)"
                :disabled="user.role === 'admin' && user.username === 'admin'"
                class="btn btn-delete btn-sm">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页 -->
      <div class="pagination" v-if="userTotalPages > 1">
        <button
          class="btn btn-small"
          :disabled="userCurrentPage===1"
          @click="userCurrentPage = Math.max(1, userCurrentPage - 1)">
          Previous
        </button>
        <span>Page {{ userCurrentPage }} of {{ userTotalPages }} ({{ filteredUsers.length }} total users)</span>
        <button
          class="btn btn-small"
          :disabled="userCurrentPage===userTotalPages"
          @click="userCurrentPage = Math.min(userTotalPages, userCurrentPage + 1)">
          Next
        </button>
      </div>
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
            <label>Global Service Filter:</label>
            <select v-model="selectedService" @change="applyFilters">
              <option value="all">All Services</option>
              <option value="gp">General Practice</option>
              <option value="specialist">Specialist Consultations</option>
              <option value="mental">Mental Health Services</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Global Sort:</label>
            <select v-model="sortBy" @change="applyFilters">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Global Search:</label>
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

          <button @click="generateMockData" class="btn btn-success">
            Generate Mock Data
          </button>

          <button @click="clearAllRatings" class="btn btn-danger">
            Clear All Ratings
          </button>

          <button @click="exportRatingsCSV" class="btn btn-export">
            Export CSV
          </button>

          <button @click="exportRatingsXLSX" class="btn btn-export">
            Export XLSX
          </button>

          <button @click="exportRatingsPDF" class="btn btn-export">
            Export PDF
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
                <th @click="toggleRatingSort('timestamp')" style="cursor:pointer">
                  Date <span>{{ ratingSortIcon('timestamp') }}</span>
                </th>
                <th @click="toggleRatingSort('user')" style="cursor:pointer">
                  User <span>{{ ratingSortIcon('user') }}</span>
                </th>
                <th @click="toggleRatingSort('service')" style="cursor:pointer">
                  Service <span>{{ ratingSortIcon('service') }}</span>
                </th>
                <th @click="toggleRatingSort('rating')" style="cursor:pointer">
                  Overall Rating <span>{{ ratingSortIcon('rating') }}</span>
                </th>
                <th>Review</th>
                <th>Actions</th>
              </tr>
              <!-- 每列搜索行 -->
              <tr class="search-row">
                <th>
                  <input
                    v-model="ratingColumnFilters.date"
                    @input="currentPage=1"
                    placeholder="Search date..."
                    class="column-search"
                    aria-label="Search by date"
                  />
                </th>
                <th>
                  <input
                    v-model="ratingColumnFilters.user"
                    @input="currentPage=1"
                    placeholder="Search user..."
                    class="column-search"
                    aria-label="Search by user"
                  />
                </th>
                <th>
                  <select
                    v-model="ratingColumnFilters.service"
                    @change="currentPage=1"
                    class="column-search"
                    aria-label="Filter by service"
                  >
                    <option value="">All Services</option>
                    <option value="gp">General Practice</option>
                    <option value="specialist">Specialist</option>
                    <option value="mental">Mental Health</option>
                  </select>
                </th>
                <th>
                  <select
                    v-model="ratingColumnFilters.rating"
                    @change="currentPage=1"
                    class="column-search"
                    aria-label="Filter by rating"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </th>
                <th>
                  <input
                    v-model="ratingColumnFilters.review"
                    @input="currentPage=1"
                    placeholder="Search review..."
                    class="column-search"
                    aria-label="Search by review"
                  />
                </th>
                <th></th>
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
              Page {{ currentPage }} of {{ totalPages }} ({{ filteredRatings.length }} total ratings)
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

  <div class="api-demo" style="margin:1rem 0;padding:1rem;border:1px dashed #ddd;border-radius:8px;">
    <h3 style="margin:0 0 .5rem 0;">Cloud Functions Demo</h3>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem;">
      <button class="btn btn-export" @click="callEcho">Call /api/echo</button>
      <button class="btn btn-export" @click="callSummary">Call /api/summary</button>
    </div>

    <div v-if="apiErr" style="color:#dc3545;margin:.5rem 0;">❌ {{ apiErr }}</div>

    <div v-if="echoResp" style="background:#f8f9fa;padding:.5rem;border-radius:6px;margin:.25rem 0;">
      <strong>/api/echo</strong>
      <pre style="margin:.25rem 0;white-space:pre-wrap;">{{ echoResp }}</pre>
    </div>

    <div v-if="summaryResp" style="background:#f8f9fa;padding:.5rem;border-radius:6px;margin:.25rem 0;">
      <strong>/api/summary</strong>
      <pre style="margin:.25rem 0;white-space:pre-wrap;">{{ summaryResp }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { initializeHealthcareData } from '@/utils/initData.js'
import ChartView from '@/components/ChartView.vue'

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Tab management
const activeTab = ref('users')

// User management
const users = ref([])
const newUser = ref({
  username: '',
  email: '',
  password: '',
  role: 'guest'
})

// 用户表格 - 全局过滤和搜索
const userSearch = ref('')
const userRole = ref('all')
const userSortKey = ref('username')
const userSortAsc = ref(true)
const userCurrentPage = ref(1)
const userItemsPerPage = 10

// 用户表格 - 按列过滤
const columnFilters = ref({
  username: '',
  email: '',
  role: ''
})

// Ratings management
const ratings = ref([])
const selectedService = ref('all')
const sortBy = ref('newest')
const searchTerm = ref('')
const expandedRows = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

// 评分表格 - 按列过滤和排序
const ratingColumnFilters = ref({
  date: '',
  user: '',
  service: '',
  rating: '',
  review: ''
})

const ratingSortKey = ref('timestamp')
const ratingSortAsc = ref(false) // 日期默认降序（最新的在前）

// Service names mapping
const serviceNames = {
  gp: 'General Practice Services',
  specialist: 'Specialist Consultations',
  mental: 'Mental Health Services'
}

// 用户过滤逻辑（增强版）
const filteredUsers = computed(() => {
  let arr = [...users.value]

  // 按列过滤
  if (columnFilters.value.username) {
    const term = columnFilters.value.username.toLowerCase()
    arr = arr.filter(u => (u.username || '').toLowerCase().includes(term))
  }

  if (columnFilters.value.email) {
    const term = columnFilters.value.email.toLowerCase()
    arr = arr.filter(u => (u.email || '').toLowerCase().includes(term))
  }

  if (columnFilters.value.role) {
    arr = arr.filter(u => (u.role || 'guest') === columnFilters.value.role)
  }

  // 全局搜索（保留原有功能）
  if (userSearch.value) {
    const term = userSearch.value.toLowerCase()
    arr = arr.filter(u =>
      (u.username || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term)
    )
  }

  // 角色筛选（保留原有功能）
  if (userRole.value !== 'all') {
    arr = arr.filter(u => (u.role || 'guest') === userRole.value)
  }

  // 排序
  arr.sort((a, b) => {
    const A = (a[userSortKey.value] ?? '').toString().toLowerCase()
    const B = (b[userSortKey.value] ?? '').toString().toLowerCase()
    if (A < B) return userSortAsc.value ? -1 : 1
    if (A > B) return userSortAsc.value ? 1 : -1
    return 0
  })

  return arr
})

const userTotalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / userItemsPerPage) || 1
)

const paginatedUsers = computed(() => {
  const start = (userCurrentPage.value - 1) * userItemsPerPage
  return filteredUsers.value.slice(start, start + userItemsPerPage)
})

// 用户表格相关方法
function toggleUserSort(key) {
  if (userSortKey.value === key) {
    userSortAsc.value = !userSortAsc.value
  } else {
    userSortKey.value = key
    userSortAsc.value = true
  }
}

function sortIcon(key) {
  return userSortKey.value === key ? (userSortAsc.value ? '▲' : '▼') : ''
}

function deleteUserByKey(username) {
  const idx = users.value.findIndex(u => u.username === username)
  if (idx > -1) deleteUser(idx)
}

// 评分表格排序方法
function toggleRatingSort(key) {
  if (ratingSortKey.value === key) {
    ratingSortAsc.value = !ratingSortAsc.value
  } else {
    ratingSortKey.value = key
    ratingSortAsc.value = key === 'timestamp' ? false : true // 日期默认降序，其他升序
  }
}

function ratingSortIcon(key) {
  return ratingSortKey.value === key ? (ratingSortAsc.value ? '▲' : '▼') : ''
}

// Load users
function loadUsers() {
  let loaded = JSON.parse(localStorage.getItem('users') || '[]')
  loaded.forEach(u => {
    if (!u.role) u.role = 'guest'
  })
  users.value = loaded
  localStorage.setItem('users', JSON.stringify(loaded))
}

// Add user
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

// Delete user
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

// Get user name from rating
function getUserName(rating) {
  return rating.user?.username || rating.rating?.userName || 'Unknown User'
}

// 导出功能
function flattenRatings(arr) {
  return (arr || []).map(r => ({
    id: r.id,
    service: r.service,
    serviceName: r.serviceName,
    overall: r.rating?.overall ?? '',
    quality: r.rating?.quality ?? '',
    waitTime: r.rating?.waitTime ?? '',
    communication: r.rating?.communication ?? '',
    facilities: r.rating?.facilities ?? '',
    review: r.rating?.review ?? '',
    user: typeof r.user === 'string' ? r.user : (r.user?.username ?? ''),
    timestamp: r.timestamp
  }))
}

function exportRatingsCSV() {
  const rows = flattenRatings(filteredRatings.value)
  exportCsv(rows, 'ratings.csv')
}

function exportRatingsXLSX() {
  const rows = flattenRatings(filteredRatings.value)
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Ratings')
  XLSX.writeFile(wb, 'ratings.xlsx')
}

function exportRatingsPDF() {
  const rows = flattenRatings(filteredRatings.value)
  const doc = new jsPDF()
  const head = [Object.keys(rows[0] || { id:'', service:'', serviceName:'', overall:'', quality:'', waitTime:'', communication:'', facilities:'', review:'', user:'', timestamp:'' })]
  const body = rows.map(r => Object.values(r))
  autoTable(doc, { head, body })
  doc.save('ratings.pdf')
}

function exportCsv(rows, filename) {
  if (!rows?.length) return
  const keys = Object.keys(rows[0])
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Users 扁平化（不导出密码）
const flatUsers = computed(() => (users.value || []).map(u => ({
  username: u.username || '',
  email: u.email || '',
  role: u.role || 'guest',
  createdAt: u.createdAt || '',
  lastLogin: u.lastLogin || ''
})))

// 通用 CSV 导出小函数
function downloadCsv(rows, filename = 'data.csv') {
  if (!rows?.length) { alert('No data to export'); return }
  const headers = Object.keys(rows[0])
  const esc = v => JSON.stringify(v ?? '')
  const csv = [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// Users 导出
function exportUsersCSV() {
  const rows = flatUsers.value
  if (!rows.length) { alert('No users to export'); return }
  downloadCsv(rows, 'users.csv')
}

function exportUsersXLSX() {
  const rows = flatUsers.value
  if (!rows.length) { alert('No users to export'); return }
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Users')
  XLSX.writeFile(wb, 'users.xlsx')
}

function exportUsersPDF() {
  const rows = flatUsers.value
  if (!rows.length) { alert('No users to export'); return }
  const doc = new jsPDF()
  const head = [Object.keys(rows[0])]
  const body = rows.map(r => Object.values(r))
  autoTable(doc, { head, body })
  doc.save('users.pdf')
}

// 生成模拟数据的函数
function generateMockRatings(count = 50) {
  const services = [
    { key: 'gp', name: 'General Practice Services' },
    { key: 'specialist', name: 'Specialist Consultations' },
    { key: 'mental', name: 'Mental Health Services' }
  ]

  const users = [
    'alice_johnson', 'bob_smith', 'carol_davis', 'david_wilson', 'eva_brown',
    'frank_miller', 'grace_lee', 'henry_clark', 'iris_taylor', 'jack_white',
    'kate_green', 'liam_hall', 'mia_adams', 'noah_baker', 'olivia_carter',
    'paul_evans', 'quinn_fisher', 'ruby_garcia', 'sam_harris', 'tina_jones'
  ]

  const reviewTemplates = [
    'Excellent service, very professional staff.',
    'Good experience overall, would recommend.',
    'Professional and thorough consultation.',
    'Staff was friendly and helpful.',
    'Quick and efficient service.',
    'Outstanding care and attention to detail.',
    'Very satisfied with the treatment.',
    'Clean facilities and modern equipment.',
    'Doctor took time to explain everything.',
    'Convenient location and easy parking.',
    'Wait time was reasonable.',
    'Compassionate and understanding staff.',
    'Highly recommend this service.',
    'Great follow-up care and support.',
    'State-of-the-art medical facilities.'
  ]

  const mockRatings = []

  for (let i = 0; i < count; i++) {
    const service = services[Math.floor(Math.random() * services.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const review = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)]

    // 生成相关性评分（总体评分影响其他评分）
    const overall = Math.floor(Math.random() * 5) + 1
    const variance = Math.floor(Math.random() * 2) - 1 // -1, 0, or 1

    const rating = {
      id: 'mock-' + Date.now() + '-' + i.toString().padStart(3, '0'),
      service: service.key,
      serviceName: service.name,
      user: { username: user },
      rating: {
        overall: overall,
        quality: Math.max(1, Math.min(5, overall + variance)),
        waitTime: Math.max(1, Math.min(5, overall + Math.floor(Math.random() * 3) - 1)),
        communication: Math.max(1, Math.min(5, overall + variance)),
        facilities: Math.max(1, Math.min(5, overall + Math.floor(Math.random() * 2))),
        review: review + (overall === 5 ? ' Exceptional experience!' : '')
      },
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString()
    }

    mockRatings.push(rating)
  }

  return mockRatings
}

// 生成模拟数据的处理函数
const generateMockData = () => {
  const count = prompt('请输入要生成的评分数量 (建议20-100):', '50')
  if (!count || isNaN(count)) return

  const newRatings = generateMockRatings(parseInt(count))
  const existingRatings = JSON.parse(localStorage.getItem('healthcareRatings') || '[]')

  // 合并新旧数据
  const allRatings = [...existingRatings, ...newRatings]

  // 保存到localStorage
  localStorage.setItem('healthcareRatings', JSON.stringify(allRatings))

  // 重新加载数据
  loadRatings()
  updateServiceStatistics()

  alert(`成功生成 ${count} 条评分数据！`)
}

// 评分统计计算
const ratingsStats = computed(() => {
  const total = ratings.value.length
  const average = total > 0 ?
    (ratings.value.reduce((sum, r) => sum + r.rating.overall, 0) / total).toFixed(1) : '0.0'

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

// 评分过滤逻辑（增强版）
const filteredRatings = computed(() => {
  let filtered = ratings.value

  // 按列过滤
  if (ratingColumnFilters.value.date) {
    const term = ratingColumnFilters.value.date.toLowerCase()
    filtered = filtered.filter(r => formatDate(r.timestamp).toLowerCase().includes(term))
  }

  if (ratingColumnFilters.value.user) {
    const term = ratingColumnFilters.value.user.toLowerCase()
    filtered = filtered.filter(r => getUserName(r).toLowerCase().includes(term))
  }

  if (ratingColumnFilters.value.service) {
    filtered = filtered.filter(r => r.service === ratingColumnFilters.value.service)
  }

  if (ratingColumnFilters.value.rating) {
    filtered = filtered.filter(r => r.rating.overall.toString() === ratingColumnFilters.value.rating)
  }

  if (ratingColumnFilters.value.review) {
    const term = ratingColumnFilters.value.review.toLowerCase()
    filtered = filtered.filter(r => (r.rating.review || '').toLowerCase().includes(term))
  }

  // 保留原有的全局过滤功能
  if (selectedService.value !== 'all') {
    filtered = filtered.filter(r => r.service === selectedService.value)
  }

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

  // 新的排序逻辑
  filtered.sort((a, b) => {
    let aVal, bVal

    switch (ratingSortKey.value) {
      case 'timestamp':
        aVal = new Date(a.timestamp)
        bVal = new Date(b.timestamp)
        break
      case 'user':
        aVal = getUserName(a).toLowerCase()
        bVal = getUserName(b).toLowerCase()
        break
      case 'service':
        aVal = a.serviceName || a.service
        bVal = b.serviceName || b.service
        break
      case 'rating':
        aVal = a.rating.overall
        bVal = b.rating.overall
        break
      default:
        // 如果没有匹配的排序键，使用原有的排序逻辑
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
    }

    if (aVal < bVal) return ratingSortAsc.value ? -1 : 1
    if (aVal > bVal) return ratingSortAsc.value ? 1 : -1
    return 0
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
    updateServiceStatistics()

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

    serviceTypes.forEach(serviceKey => {
      const serviceRatings = ratings.filter(r => r.service === serviceKey)
      const service = servicesData[serviceKey]

      if (serviceRatings.length > 0) {
        const totalOverall = serviceRatings.reduce((sum, r) => sum + r.rating.overall, 0)
        service.averageRating = Number((totalOverall / serviceRatings.length).toFixed(1))
        service.totalReviews = serviceRatings.length

        service.categories[0].rating = Number((serviceRatings.reduce((sum, r) => sum + (r.rating.quality || 0), 0) / serviceRatings.length).toFixed(1))
        service.categories[1].rating = Number((serviceRatings.reduce((sum, r) => sum + (r.rating.waitTime || 0), 0) / serviceRatings.length).toFixed(1))
        service.categories[2].rating = Number((serviceRatings.reduce((sum, r) => sum + (r.rating.communication || 0), 0) / serviceRatings.length).toFixed(1))
        service.categories[3].rating = Number((serviceRatings.reduce((sum, r) => sum + (r.rating.facilities || 0), 0) / serviceRatings.length).toFixed(1))

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

    localStorage.setItem('healthcareServicesData', JSON.stringify(servicesData))

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

const refreshData = () => {
  console.log('Refreshing admin dashboard data...')
  initializeHealthcareData()
  loadRatings()
  updateServiceStatistics()
}

onMounted(() => {
  console.log('Admin dashboard mounted')
  initializeHealthcareData()
  loadUsers()
  loadRatings()
  updateServiceStatistics()
})


import { postJSON } from '@/utils/api'   // 你刚建好的工具函数（路径别名保持你项目一致）

const echoResp = ref(null)
const summaryResp = ref(null)
const apiErr = ref('')

async function callEcho () {
  apiErr.value = ''; echoResp.value = null
  try {
    echoResp.value = await postJSON('/api/echo', { hello: 'world', when: Date.now() })
  } catch (e) {
    apiErr.value = e.message
  }
}

async function callSummary () {
  apiErr.value = ''; summaryResp.value = null
  try {
    // 演示用：1..5；你也可以把这里改成页面上输入的数组
    summaryResp.value = await postJSON('/api/summary', { numbers: [1,2,3,4,5] })
  } catch (e) {
    apiErr.value = e.message
  }
}
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

/* User Management Styles */
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

.add-user-form button:hover {
  background: #1565c0;
}

/* Users 工具栏 */
.users-toolbar {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin: 0.8rem 0 1rem;
}

.users-toolbar .spacer {
  flex: 1;
}

.users-toolbar input,
.users-toolbar select {
  padding: 0.4rem 0.7rem;
  border: 1px solid #aaa;
  border-radius: 4px;
  min-width: 120px;
  font-size: 0.9rem;
  outline: none;
  box-shadow: none;
}

.users-toolbar input:focus,
.users-toolbar select:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 0.15rem rgba(25,118,210,.15);
}

/* 表格样式 */
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
  font-weight: 600;
  color: #2c3e50;
}

/* 搜索行样式 */
.search-row {
  background: #f0f8ff !important;
}

.column-search {
  width: 100%;
  padding: 0.3rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.8rem;
  box-sizing: border-box;
}

.column-search:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 3px rgba(25, 118, 210, 0.3);
}

/* 确保表格标题可点击的视觉提示 */
th[style*="cursor:pointer"]:hover {
  background-color: #e9ecef;
  transition: background-color 0.2s;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-sm {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
}

.btn-export {
  background: #28a745;
  color: white;
}

.btn-export:hover {
  background: #218838;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
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

.btn-refresh {
  background: #17a2b8;
  color: white;
}

.btn-refresh:hover {
  background: #138496;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  margin-top: 1rem;
}

.page-info {
  color: #6c757d;
  font-size: 0.9rem;
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
  flex-wrap: wrap;
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

.no-ratings-message {
  padding: 3rem;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

/* 响应式设计 */
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

  .users-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .users-toolbar .spacer {
    display: none;
  }
}
/* 修复后的按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  min-height: 36px;
}

.btn-sm {
  padding: 0.5rem 0.8rem;
  font-size: 0.85rem;
  min-height: 32px;
}

.btn-export {
  background: #28a745;
  color: white;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
}

.btn-export:hover {
  background: #218838;
}

.btn-delete {
  background: #dc3545;
  color: white;
  padding: 0.5rem 0.8rem;
  font-size: 0.85rem;
}

.btn-delete:hover {
  background: #c82333;
}

.btn-small {
  padding: 0.5rem 0.8rem;
  font-size: 0.85rem;
  background: #6c757d;
  color: white;
  min-height: 32px;
}

.btn-small:hover {
  background: #5a6268;
}

.btn-refresh {
  background: #17a2b8;
  color: white;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
}

.btn-refresh:hover {
  background: #138496;
}

.btn-danger {
  background: #dc3545;
  color: white;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background: #c82333;
}

.btn:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* 确保添加用户表单的按钮也有合适的大小 */
.add-user-form button {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  min-height: 36px;
}

.add-user-form button:hover {
  background: #1565c0;
}

/* 工具栏中的导出按钮保持一致 */
.users-toolbar .btn {
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  min-height: 36px;
}

.btn-success {
  background: #28a745;
  color: white;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
}

.btn-success:hover {
  background: #218838;
}

</style>
