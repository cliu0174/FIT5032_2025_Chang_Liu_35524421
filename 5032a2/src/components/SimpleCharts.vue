<template>
  <div class="charts-container">
    <div class="charts-header">
      <h3>{{ title }}</h3>
      <button @click="refreshData" class="refresh-btn">🔄 Refresh Data</button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card total">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h4>Total Ratings</h4>
          <p class="stat-number">{{ stats.totalRatings }}</p>
        </div>
      </div>

      <div class="stat-card average">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <h4>Average Rating</h4>
          <p class="stat-number">{{ stats.averageRating }}/5</p>
        </div>
      </div>

      <div class="stat-card users">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <h4>Total Users</h4>
          <p class="stat-number">{{ stats.totalUsers }}</p>
        </div>
      </div>

      <div class="stat-card recent">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <h4>This Month</h4>
          <p class="stat-number">{{ stats.thisMonth }}</p>
        </div>
      </div>
    </div>

    <!-- 服务评分条形图 -->
    <div class="chart-section">
      <h4>Service Ratings Overview</h4>
      <div class="service-bars">
        <div
          v-for="(service, key) in serviceRatings"
          :key="key"
          class="service-bar-item"
        >
          <div class="service-label">{{ service.name }}</div>
          <div class="bar-container">
            <div
              class="bar-fill"
              :style="{
                width: `${(service.rating / 5) * 100}%`,
                backgroundColor: service.color
              }"
            ></div>
            <span class="bar-value">{{ service.rating }}/5</span>
          </div>
          <div class="service-count">({{ service.count }} reviews)</div>
        </div>
      </div>
    </div>

    <!-- 分类细分雷达图（简化版） -->
    <div class="chart-section">
      <h4>Category Breakdown</h4>
      <div class="radar-chart">
        <div
          v-for="(category, index) in categoryData"
          :key="category.name"
          class="radar-item"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="category-label">{{ category.name }}</div>
          <div class="category-bar">
            <div
              class="category-fill"
              :style="{
                width: `${(category.value / 5) * 100}%`,
                animationDelay: `${index * 0.1}s`
              }"
            ></div>
            <span class="category-value">{{ category.value }}/5</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 趋势显示 -->
    <div class="chart-section">
      <h4>Recent Activity Trend</h4>
      <div class="trend-chart">
        <div
          v-for="(month, index) in trendData"
          :key="month.label"
          class="trend-bar"
          :style="{ '--height': `${(month.value / maxTrendValue) * 100}%` }"
        >
          <div class="trend-fill"></div>
          <div class="trend-label">{{ month.label }}</div>
          <div class="trend-value">{{ month.value }}</div>
        </div>
      </div>
    </div>

    <!-- 用户分布饼图（简化版） -->
    <div class="chart-section">
      <h4>User Distribution</h4>
      <div class="pie-chart">
        <div class="pie-item admin">
          <div class="pie-slice" :style="{ '--percentage': adminPercentage + '%' }"></div>
          <div class="pie-label">
            <span class="pie-color admin-color"></span>
            Admin Users: {{ userStats.adminUsers }}
          </div>
        </div>
        <div class="pie-item guest">
          <div class="pie-label">
            <span class="pie-color guest-color"></span>
            Guest Users: {{ userStats.guestUsers }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getUserStats } from '@/utils/users'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Healthcare Analytics Dashboard'
  }
})

// 响应式数据
const stats = ref({
  totalRatings: 0,
  averageRating: 0,
  totalUsers: 0,
  thisMonth: 0
})

const serviceRatings = ref({})
const categoryData = ref([])
const trendData = ref([])
const userStats = ref({})

// 计算属性
const adminPercentage = computed(() => {
  const total = userStats.value.totalUsers || 1
  return Math.round((userStats.value.adminUsers / total) * 100)
})

const maxTrendValue = computed(() => {
  return Math.max(...trendData.value.map(t => t.value), 1)
})

// 加载数据
const loadData = () => {
  try {
    // 获取评分数据
    const ratings = JSON.parse(localStorage.getItem('healthcareRatings') || '[]')
    const services = JSON.parse(localStorage.getItem('healthcareServicesData') || '{}')
    const users = getUserStats()

    // 计算基础统计
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthRatings = ratings.filter(r => new Date(r.timestamp) >= thisMonthStart)

    stats.value = {
      totalRatings: ratings.length,
      averageRating: ratings.length > 0 ?
        (ratings.reduce((sum, r) => sum + r.rating.overall, 0) / ratings.length).toFixed(1) : 0,
      totalUsers: users.totalUsers,
      thisMonth: thisMonthRatings.length
    }

    // 服务评分数据
    const serviceNames = {
      gp: 'General Practice',
      specialist: 'Specialist Care',
      mental: 'Mental Health'
    }
    const serviceColors = {
      gp: '#667eea',
      specialist: '#764ba2',
      mental: '#17a2b8'
    }

    serviceRatings.value = {}
    Object.keys(serviceNames).forEach(key => {
      const serviceData = services[key] || { averageRating: 0, totalReviews: 0 }
      serviceRatings.value[key] = {
        name: serviceNames[key],
        rating: serviceData.averageRating || 0,
        count: serviceData.totalReviews || 0,
        color: serviceColors[key]
      }
    })

    // 分类数据
    const categories = ['quality', 'waitTime', 'communication', 'facilities']
    const categoryNames = {
      quality: 'Service Quality',
      waitTime: 'Wait Time',
      communication: 'Communication',
      facilities: 'Facilities'
    }

    categoryData.value = categories.map(category => {
      let total = 0
      let count = 0

      ratings.forEach(rating => {
        if (rating.rating[category]) {
          total += rating.rating[category]
          count++
        }
      })

      return {
        name: categoryNames[category],
        value: count > 0 ? Number((total / count).toFixed(1)) : 0
      }
    })

    // 趋势数据（最近6个月）
    const monthlyData = {}
    ratings.forEach(rating => {
      const date = new Date(rating.timestamp)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
    })

    const sortedMonths = Object.keys(monthlyData).sort().slice(-6)
    trendData.value = sortedMonths.map(month => {
      const [year, monthNum] = month.split('-')
      return {
        label: `${monthNum}/${year}`,
        value: monthlyData[month]
      }
    })

    // 确保至少有一些数据显示
    if (trendData.value.length === 0) {
      trendData.value = [
        { label: '12/2024', value: 2 },
        { label: '01/2025', value: 4 },
        { label: '02/2025', value: 1 }
      ]
    }

    userStats.value = users

    console.log('📊 Chart data loaded successfully')
  } catch (error) {
    console.error('❌ Error loading chart data:', error)
  }
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 生命周期
onMounted(() => {
  loadData()
})

// 暴露方法
defineExpose({
  refresh: loadData
})
</script>

<style scoped>
.charts-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.charts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.charts-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.refresh-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.refresh-btn:hover {
  background: #5a67d8;
}

/* 统计卡片 */
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
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.total { border-left: 4px solid #667eea; }
.stat-card.average { border-left: 4px solid #28a745; }
.stat-card.users { border-left: 4px solid #ffc107; }
.stat-card.recent { border-left: 4px solid #17a2b8; }

.stat-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-info h4 {
  margin: 0 0 0.5rem 0;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-number {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

/* 图表部分 */
.chart-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-section h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

/* 服务评分条形图 */
.service-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.service-bar-item {
  display: grid;
  grid-template-columns: 150px 1fr 100px;
  align-items: center;
  gap: 1rem;
}

.service-label {
  font-weight: 500;
  color: #495057;
}

.bar-container {
  position: relative;
  background: #e9ecef;
  border-radius: 20px;
  height: 20px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 20px;
  transition: width 1s ease;
  animation: slideIn 1s ease;
}

.bar-value {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: #2c3e50;
}

.service-count {
  font-size: 0.8rem;
  color: #6c757d;
}

/* 分类细分 */
.radar-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radar-item {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 1rem;
}

.category-label {
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
}

.category-bar {
  position: relative;
  background: #e9ecef;
  border-radius: 15px;
  height: 15px;
}

.category-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 15px;
  animation: fillAnimation 1.5s ease;
}

.category-value {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7rem;
  font-weight: 600;
  color: #2c3e50;
}

/* 趋势图 */
.trend-chart {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 150px;
  padding: 1rem 0;
}

.trend-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  position: relative;
}

.trend-fill {
  width: 100%;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 4px 4px 0 0;
  height: var(--height);
  transition: height 1s ease;
  animation: growUp 1s ease;
}

.trend-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.5rem;
}

.trend-value {
  position: absolute;
  top: calc(100% - var(--height) - 20px);
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
}

/* 用户分布 */
.pie-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pie-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.pie-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.admin-color { background: #dc3545; }
.guest-color { background: #667eea; }

/* 动画 */
@keyframes slideIn {
  from { width: 0; }
  to { width: var(--width); }
}

@keyframes fillAnimation {
  from { width: 0; }
}

@keyframes growUp {
  from { height: 0; }
}

/* 响应式 */
@media (max-width: 768px) {
  .charts-container {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .service-bar-item,
  .radar-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .trend-chart {
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
