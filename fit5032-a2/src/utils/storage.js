// storage.js - 简化版本地存储管理
// 满足 Assignment Category B (B.2) 要求：持久化数据超出当前会话

const STORAGE_KEYS = {
  USER: 'migrant_health_user',
  PREFERENCES: 'migrant_health_preferences',
  RATINGS: 'migrant_health_ratings'
}

// 安全的localStorage操作
const safeStorage = {
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Storage error:', error)
      return false
    }
  },

  getItem(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Storage error:', error)
      return null
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Storage error:', error)
      return false
    }
  }
}

// 用户数据管理
export const setStoredUser = (user) => {
  const userData = {
    ...user,
    loginTime: new Date().toISOString()
  }
  return safeStorage.setItem(STORAGE_KEYS.USER, userData)
}

export const getStoredUser = () => {
  return safeStorage.getItem(STORAGE_KEYS.USER)
}

export const clearStoredUser = () => {
  return safeStorage.removeItem(STORAGE_KEYS.USER)
}

// 用户偏好设置
export const setUserPreferences = (preferences) => {
  return safeStorage.setItem(STORAGE_KEYS.PREFERENCES, preferences)
}

export const getUserPreferences = () => {
  return safeStorage.getItem(STORAGE_KEYS.PREFERENCES) || {
    language: 'en',
    theme: 'light',
    notifications: true
  }
}

// 评分数据管理 (满足Category C要求：评分系统)
export const saveRating = (serviceId, rating, comment = '') => {
  const ratings = getRatings()
  const user = getStoredUser()

  if (!user) return false

  const ratingData = {
    serviceId,
    rating,
    comment,
    userId: user.id,
    timestamp: new Date().toISOString()
  }

  ratings[`${serviceId}_${user.id}`] = ratingData
  return safeStorage.setItem(STORAGE_KEYS.RATINGS, ratings)
}

export const getRatings = () => {
  return safeStorage.getItem(STORAGE_KEYS.RATINGS) || {}
}

export const getUserRating = (serviceId) => {
  const user = getStoredUser()
  if (!user) return null

  const ratings = getRatings()
  return ratings[`${serviceId}_${user.id}`] || null
}

export const getServiceRatings = (serviceId) => {
  const allRatings = getRatings()
  const serviceRatings = Object.values(allRatings)
    .filter(rating => rating.serviceId === serviceId)

  if (serviceRatings.length === 0) {
    return { average: 0, count: 0 }
  }

  const sum = serviceRatings.reduce((total, rating) => total + rating.rating, 0)
  const average = (sum / serviceRatings.length).toFixed(1)

  return {
    average: parseFloat(average),
    count: serviceRatings.length,
    ratings: serviceRatings
  }
}

export default {
  setStoredUser,
  getStoredUser,
  clearStoredUser,
  setUserPreferences,
  getUserPreferences,
  saveRating,
  getRatings,
  getUserRating,
  getServiceRatings
}
