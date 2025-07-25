<template>
  <div class="services">
    <div class="container py-5">
      <!-- Page Header -->
      <div class="row mb-5">
        <div class="col-12 text-center">
          <h1 class="display-4">Our Services</h1>
          <p class="lead">Comprehensive support for migrant communities</p>
        </div>
      </div>

      <!-- Filter Buttons -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="btn-group d-flex flex-wrap justify-content-center" role="group">
            <button
              class="btn"
              :class="selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'"
              @click="filterServices('all')"
            >
              All Services
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              class="btn"
              :class="selectedCategory === category.id ? 'btn-primary' : 'btn-outline-primary'"
              @click="filterServices(category.id)"
            >
              {{ category.name }} ({{ category.count }})
            </button>
          </div>
        </div>
      </div>

      <!-- Services Grid -->
      <div class="row">
        <div class="col-md-6 col-lg-4 mb-4" v-for="service in filteredServices" :key="service.id">
          <ServiceCard :service="service" @rate="handleServiceRating" />
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredServices.length === 0" class="row">
        <div class="col-12 text-center">
          <div class="alert alert-info">
            <h4>No services found</h4>
            <p>Try selecting a different category or check back later for new services.</p>
          </div>
        </div>
      </div>

      <!-- Emergency Contact -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="alert alert-warning">
            <h5><i class="fas fa-exclamation-triangle me-2"></i>Emergency Services</h5>
            <p class="mb-0">
              If you need immediate assistance, please call our 24/7 helpline:
              <strong><a href="tel:+1-555-0100" class="alert-link">+1-555-0100</a></strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import ServiceCard from '../components/ServiceCard.vue'
import { getServices, getServiceCategories } from '../data/services.js'

export default {
  name: 'Services',
  components: {
    ServiceCard
  },
  setup() {
    const services = ref([])
    const categories = ref([])
    const selectedCategory = ref('all')

    // 计算过滤后的服务
    const filteredServices = computed(() => {
      if (selectedCategory.value === 'all') {
        return services.value
      }
      return services.value.filter(service => service.category === selectedCategory.value)
    })

    // 加载数据
    const loadData = () => {
      services.value = getServices()
      categories.value = getServiceCategories()
    }

    // 过滤服务
    const filterServices = (category) => {
      selectedCategory.value = category
    }

    // 处理服务评分
    const handleServiceRating = (serviceId, rating) => {
      console.log(`Service ${serviceId} rated: ${rating}`)
      // 这里可以添加更多评分处理逻辑
    }

    onMounted(() => {
      loadData()
    })

    return {
      services,
      categories,
      selectedCategory,
      filteredServices,
      filterServices,
      handleServiceRating
    }
  }
}
</script>

<style scoped>
.services {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.btn-group .btn {
  margin: 2px;
  border-radius: 20px;
}

.alert-warning {
  border-left: 4px solid #ffc107;
}

.alert-link {
  color: inherit;
  font-weight: bold;
}
</style>
