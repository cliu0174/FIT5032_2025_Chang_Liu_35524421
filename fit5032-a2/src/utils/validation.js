// validation.js - 简化版表单验证工具
// 满足 Assignment Category B (B.1) 要求：至少两种不同类型的用户输入验证

// 1. 邮箱验证（第一种验证类型）
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: 'Email is required' }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' }
  }

  if (email.length > 254) {
    return { valid: false, message: 'Email address is too long' }
  }

  return { valid: true }
}

// 2. 密码强度验证（第二种验证类型）
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required' }
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }

  const checks = [
    { test: /[a-z]/.test(password), message: 'Password must contain lowercase letters' },
    { test: /[A-Z]/.test(password), message: 'Password must contain uppercase letters' },
    { test: /\d/.test(password), message: 'Password must contain numbers' }
  ]

  for (const check of checks) {
    if (!check.test) {
      return { valid: false, message: check.message }
    }
  }

  return { valid: true }
}

// 3. 姓名验证
export const validateName = (name) => {
  if (!name) {
    return { valid: false, message: 'Name is required' }
  }

  const trimmedName = name.trim()

  if (trimmedName.length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters long' }
  }

  if (trimmedName.length > 50) {
    return { valid: false, message: 'Name cannot exceed 50 characters' }
  }

  if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
    return { valid: false, message: 'Name can only contain letters and spaces' }
  }

  return { valid: true }
}

// 4. 通用必填验证
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || value.toString().trim() === '') {
    return { valid: false, message: `${fieldName} is required` }
  }
  return { valid: true }
}

// 5. XSS防护 (满足Category C要求：安全防护)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

// 6. 评分验证 (满足Category C要求：评分系统)
export const validateRating = (rating) => {
  const numRating = parseFloat(rating)

  if (isNaN(numRating)) {
    return { valid: false, message: 'Rating must be a number' }
  }

  if (numRating < 1 || numRating > 5) {
    return { valid: false, message: 'Rating must be between 1 and 5' }
  }

  return { valid: true }
}

export default {
  validateEmail,
  validatePassword,
  validateName,
  validateRequired,
  sanitizeInput,
  validateRating
}
