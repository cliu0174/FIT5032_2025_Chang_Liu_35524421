// testimonials.js - 评价数据文件
// 用于展示社区成员的反馈和评价

export const testimonialsData = [
  {
    id: 1,
    text: 'The healthcare navigation service helped me find a doctor who speaks my language. I finally feel comfortable getting the medical care I need.',
    author: 'Maria G.',
    rating: 5,
    serviceId: 1,
    date: '2024-01-15'
  },
  {
    id: 2,
    text: 'The mental health support team was incredibly understanding and helped my family during a very difficult time.',
    author: 'Ahmed K.',
    rating: 5,
    serviceId: 2,
    date: '2024-01-10'
  },
  {
    id: 3,
    text: 'Legal aid services helped me understand my rights and guided me through the immigration process step by step.',
    author: 'Chen L.',
    rating: 4,
    serviceId: 3,
    date: '2024-01-08'
  },
  {
    id: 4,
    text: 'The English classes are well-structured and the teachers are very patient. My confidence in speaking has improved significantly.',
    author: 'Fatima A.',
    rating: 5,
    serviceId: 4,
    date: '2024-01-05'
  },
  {
    id: 5,
    text: 'Thanks to the employment training program, I was able to update my resume and find a job in my field within two months.',
    author: 'Roberto M.',
    rating: 4,
    serviceId: 5,
    date: '2024-01-02'
  },
  {
    id: 6,
    text: 'The family services team provided excellent childcare resources and helped me connect with other parents in the community.',
    author: 'Amara S.',
    rating: 5,
    serviceId: 6,
    date: '2023-12-28'
  }
]

// 获取所有评价
export const getTestimonials = () => {
  return testimonialsData.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// 获取特定服务的评价
export const getTestimonialsByService = (serviceId) => {
  return testimonialsData
    .filter(testimonial => testimonial.serviceId === parseInt(serviceId))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

// 获取最高评分的评价
export const getTopRatedTestimonials = (limit = 3) => {
  return testimonialsData
    .filter(testimonial => testimonial.rating >= 4)
    .sort((a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

// 获取最近的评价
export const getRecentTestimonials = (limit = 5) => {
  return testimonialsData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

// 计算平均评分
export const getAverageRating = () => {
  if (testimonialsData.length === 0) return 0

  const sum = testimonialsData.reduce((total, testimonial) => total + testimonial.rating, 0)
  return (sum / testimonialsData.length).toFixed(1)
}

// 按评分统计
export const getRatingStats = () => {
  const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  testimonialsData.forEach(testimonial => {
    stats[testimonial.rating]++
  })

  return stats
}

export default {
  testimonialsData,
  getTestimonials,
  getTestimonialsByService,
  getTopRatedTestimonials,
  getRecentTestimonials,
  getAverageRating,
  getRatingStats
}
