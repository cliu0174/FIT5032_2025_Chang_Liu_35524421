<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>{{ title }}</h3>
      <div class="chart-controls">
        <select v-model="selectedChart" @change="updateChart" class="chart-selector">
          <option value="ratings">Service Ratings Overview</option>
          <option value="trends">Rating Trends</option>
          <option value="categories">Category Breakdown</option>
          <option value="users">User Statistics</option>
        </select>
        <button @click="refreshData" class="refresh-btn">🔄 Refresh</button>
      </div>
    </div>

    <div class="chart-content">
      <!-- 数据加载状态 -->
      <div v-if="isLoading" class="loading-state">
        <p>Loading chart data...</p>
      </div>

      <!-- 无数据状态 -->
      <div v-else-if="!hasData" class="no-data-state">
        <p>No data available. Try adding some ratings first!</p>
        <button @click="generateSampleData" class="btn-sample">Generate Sample Data</button>
      </div>

      <!-- 图表显示 -->
      <div v-else>
        <!-- 服务评分概览 -->
        <div v-if="selectedChart === 'ratings'" class="chart-wrapper">
          <canvas ref="ratingsChart" width="400" height="300"></canvas>
        </div>

        <!-- 评分趋势 -->
        <div v-else-if="selectedChart === 'trends'" class="chart-wrapper">
          <canvas ref="trendsChart" width="400" height="300"></canvas>
        </div>

        <!-- 分类细分 -->
        <div v-else-if="selectedChart === 'categories'" class="chart-wrapper">
          <canvas ref="categoriesChart" width="400" height="300"></canvas>
        </div>

        <!-- 用户统计 -->
        <div v-else-if="selectedChart === 'users'" class="chart-wrapper">
          <canvas ref="usersChart" width="400" height="300"></canvas>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h4>Total Ratings</h4>
            <p>{{ stats.totalRatings }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <h4>Average Rating</h4>
            <p>{{ stats.averageRating }}/5</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h4>Total Users</h4>
            <p>{{ stats.totalUsers }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <h4>This Month</h4>
            <p>{{ stats.thisMonth }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale
} from 'chart.js'
import { getUserStats } from '@/utils/users'

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  LineController,
  PointElement,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  RadarController,
  RadialLinearScale
)

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Healthcare Analytics Dashboard'
  }
})

// Refs
const selectedChart = ref('ratings')
const ratingsChart = ref(null)
const trendsChart = ref(null)
const categoriesChart = ref(null)
const usersChart = ref(null)

const isLoading = ref(false)
const hasData = ref(false)

// Data
const stats = ref({
  totalRatings: 0,
  averageRating: 0,
  totalUsers: 0,
  thisMonth: 0
})

let chartInstances = {}
let chartData = {}

// 颜色主题
const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8',
  danger: '#dc3545',
  light: '#f8f9fa',
  dark: '#343a40'
}

// 生成示例数据
const generateSampleData = () => {
  console.log('生成示例数据...')

  // 创建示例评分数据
  const sampleRatings = []
  const services = ['gp', 'specialist', 'mental']
  const serviceNames = {
    gp: 'General Practice Services',
    specialist: 'Specialist Consultations',
    mental: 'Mental Health Services'
  }

  // 生成过去6个月的数据
  for (let i = 0; i < 20; i++) {
    const service = services[Math.floor(Math.random() * services.length)]
    const date = new Date()
    date.setDate(date.getDate() - Math.random() * 180) // 过去6个月内的随机日期

    const rating = {
      id: `sample-${i + 1}`,
      service: service,
      serviceName: serviceNames[service],
      rating: {
        overall: Math.floor(Math.random() * 2) + 4, // 4-5分
        quality: Math.floor(Math.random() * 2) + 4,
        waitTime: Math.floor(Math.random() * 3) + 3, // 3-5分
        communication: Math.floor(Math.random() * 2) + 4,
        facilities: Math.floor(Math.random() * 3) + 3
      },
      user: { username: `user${i + 1}`, userId: `user${i + 1}` },
      timestamp: date.toISOString(),
      submittedAt: date.toLocaleDateString()
    }

    sampleRatings.push(rating)
  }

  // 保存到localStorage
  localStorage.setItem('healthcareRatings', JSON.stringify(sampleRatings))

  // 重新加载数据
  loadData()
}

// 获取数据
const loadData = () => {
  try {
    isLoading.value = true

    // 获取评分数据
    const ratings = JSON.parse(localStorage.getItem('healthcareRatings') || '[]')
    const services = JSON.parse(localStorage.getItem('healthcareServicesData') || '{}')
    const userStats = getUserStats()

    console.log('加载的数据:', { ratings: ratings.length, services: Object.keys(services) })

    // 检查是否有数据
    hasData.value = ratings.length > 0

    // 计算统计数据
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthRatings = ratings.filter(r => new Date(r.timestamp) >= thisMonthStart)

    stats.value = {
      totalRatings: ratings.length,
      averageRating: ratings.length > 0 ?
        (ratings.reduce((sum, r) => sum + r.rating.overall, 0) / ratings.length).toFixed(1) : 0,
      totalUsers: userStats.totalUsers || 0,
      thisMonth: thisMonthRatings.length
    }

    // 存储图表数据
    chartData = { ratings, services, userStats }

    isLoading.value = false
    return chartData
  } catch (error) {
    console.error('加载图表数据错误:', error)
    isLoading.value = false
    hasData.value = false
    return { ratings: [], services: {}, userStats: {} }
  }
}

// 创建服务评分图表
const createRatingsChart = (data) => {
  const canvas = ratingsChart.value
  if (!canvas) {
    console.log('Canvas not found for ratings chart')
    return
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.log('Context not available')
    return
  }

  // 清除之前的图表
  if (chartInstances.ratings) {
    chartInstances.ratings.destroy()
  }

  // 计算每个服务的评分
  const services = ['gp', 'specialist', 'mental']
  const serviceNames = {
    gp: 'General Practice',
    specialist: 'Specialist Care',
    mental: 'Mental Health'
  }

  const chartDataPoints = services.map(service => {
    const serviceRatings = data.ratings.filter(r => r.service === service)
    if (serviceRatings.length === 0) return 0

    const avgRating = serviceRatings.reduce((sum, r) => sum + r.rating.overall, 0) / serviceRatings.length
    return Number(avgRating.toFixed(1))
  })

  console.log('Service ratings data:', chartDataPoints)

  chartInstances.ratings = new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: services.map(s => serviceNames[s]),
      datasets: [{
        label: 'Average Rating',
        data: chartDataPoints,
        backgroundColor: [colors.primary, colors.secondary, colors.info],
        borderColor: [colors.primary, colors.secondary, colors.info],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Service Ratings (Average Score)',
          font: { size: 16, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          grid: { color: '#e9ecef' },
          ticks: { stepSize: 1 }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  })
}

// 创建趋势图表
const createTrendsChart = (data) => {
  const canvas = trendsChart.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (chartInstances.trends) {
    chartInstances.trends.destroy()
  }

  // 按月份分组评分数据
  const monthlyData = {}
  data.ratings.forEach(rating => {
    const date = new Date(rating.timestamp)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = []
    }
    monthlyData[monthKey].push(rating.rating.overall)
  })

  const labels = Object.keys(monthlyData).sort().slice(-6) // 最近6个月
  const avgData = labels.map(month => {
    const ratings = monthlyData[month] || []
    return ratings.length > 0 ?
      Number((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)) : 0
  })
  const countData = labels.map(month => monthlyData[month]?.length || 0)

  console.log('Trends data:', { labels, avgData, countData })

  chartInstances.trends = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: labels.map(label => {
        const [year, month] = label.split('-')
        return `${month}/${year.slice(2)}`
      }),
      datasets: [
        {
          label: 'Average Rating',
          data: avgData,
          borderColor: colors.primary,
          backgroundColor: colors.primary + '20',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Number of Ratings',
          data: countData,
          borderColor: colors.warning,
          backgroundColor: colors.warning + '20',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Rating Trends Over Time',
          font: { size: 16, weight: 'bold' }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          max: 5,
          title: { display: true, text: 'Average Rating' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          beginAtZero: true,
          title: { display: true, text: 'Count' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  })
}

// 创建分类细分图表
const createCategoriesChart = (data) => {
  const canvas = categoriesChart.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (chartInstances.categories) {
    chartInstances.categories.destroy()
  }

  const categories = ['quality', 'waitTime', 'communication', 'facilities']
  const categoryNames = {
    quality: 'Service Quality',
    waitTime: 'Wait Time',
    communication: 'Communication',
    facilities: 'Facilities'
  }

  // 计算每个分类的平均分
  const categoryData = categories.map(category => {
    let total = 0
    let count = 0

    data.ratings.forEach(rating => {
      if (rating.rating[category]) {
        total += rating.rating[category]
        count++
      }
    })

    return count > 0 ? Number((total / count).toFixed(1)) : 0
  })

  console.log('Categories data:', categoryData)

  chartInstances.categories = new ChartJS(ctx, {
    type: 'radar',
    data: {
      labels: categories.map(c => categoryNames[c]),
      datasets: [{
        label: 'Average Ratings',
        data: categoryData,
        backgroundColor: colors.primary + '30',
        borderColor: colors.primary,
        borderWidth: 2,
        pointBackgroundColor: colors.primary,
        pointBorderColor: '#fff',
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Service Category Breakdown',
          font: { size: 16, weight: 'bold' }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 5,
          stepSize: 1,
          grid: { color: '#e9ecef' },
          angleLines: { color: '#e9ecef' }
        }
      }
    }
  })
}

// 创建用户统计图表
const createUsersChart = (data) => {
  const canvas = usersChart.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  if (chartInstances.users) {
    chartInstances.users.destroy()
  }

  const userStats = data.userStats
  console.log('User stats:', userStats)

  chartInstances.users = new ChartJS(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Admin Users', 'Guest Users'],
      datasets: [{
        data: [
          userStats.adminUsers || 0,
          userStats.guestUsers || 0
        ],
        backgroundColor: [colors.danger, colors.primary],
        borderColor: [colors.danger, colors.primary],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'User Distribution',
          font: { size: 16, weight: 'bold' }
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

// 更新图表
const updateChart = async () => {
  if (!hasData.value) return

  await nextTick()

  console.log('Updating chart:', selectedChart.value)

  switch (selectedChart.value) {
    case 'ratings':
      createRatingsChart(chartData)
      break
    case 'trends':
      createTrendsChart(chartData)
      break
    case 'categories':
      createCategoriesChart(chartData)
      break
    case 'users':
      createUsersChart(chartData)
      break
  }
}

// 刷新数据
const refreshData = () => {
  loadData()
  if (hasData.value) {
    updateChart()
  }
}

// 监听图表选择变化
watch(selectedChart, () => {
  updateChart()
})

// 生命周期
onMounted(async () => {
  loadData()
  await nextTick()
  if (hasData.value) {
    updateChart()
  }
})

onUnmounted(() => {
  // 清理所有图表实例
  Object.values(chartInstances).forEach(chart => {
    if (chart) chart.destroy()
  })
})

// 暴露刷新方法
defineExpose({
  refresh: refreshData
})
</script>

<style scoped>
.chart-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chart-selector {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  color: #495057;
  cursor: pointer;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.refresh-btn:hover {
  background: #5a67d8;
}

.chart-content {
  display: grid;
  gap: 2rem;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
}

.loading-state,
.no-data-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.btn-sample {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.btn-sample:hover {
  background: #218838;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
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

.stat-info p {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 1rem;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .chart-wrapper {
    height: 300px;
  }

  .stats-cards {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
