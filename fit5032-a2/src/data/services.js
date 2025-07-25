// services.js - 服务数据文件
// 满足Category B要求：动态数据展示 - 从JavaScript数据结构获取数据

export const servicesData = [
  {
    id: 1,
    title: 'Healthcare Navigation',
    description: 'Get help understanding the healthcare system, finding doctors, and accessing medical services.',
    icon: 'fas fa-hospital',
    availability: 'Mon-Fri 9AM-5PM',
    languages: ['English', 'Spanish', 'Arabic'],
    contactLink: 'tel:+1-555-0101',
    category: 'healthcare',
    featured: true
  },
  {
    id: 2,
    title: 'Mental Health Support',
    description: 'Confidential counseling and mental health services for individuals and families.',
    icon: 'fas fa-brain',
    availability: '24/7 Crisis Line',
    languages: ['English', 'Spanish', 'Mandarin'],
    contactLink: 'tel:+1-555-0102',
    category: 'mental-health',
    featured: true
  },
  {
    id: 3,
    title: 'Legal Aid Services',
    description: 'Immigration law assistance, document preparation, and legal consultation.',
    icon: 'fas fa-gavel',
    availability: 'Tue, Thu 10AM-4PM',
    languages: ['English', 'Spanish', 'French'],
    contactLink: 'mailto:legal@migranthealth.org',
    category: 'legal',
    featured: true
  },
  {
    id: 4,
    title: 'Language Learning',
    description: 'English classes and language exchange programs for all skill levels.',
    icon: 'fas fa-language',
    availability: 'Mon-Wed 6PM-8PM',
    languages: ['Multiple languages supported'],
    contactLink: 'mailto:language@migranthealth.org',
    category: 'education',
    featured: false
  },
  {
    id: 5,
    title: 'Employment Training',
    description: 'Job search assistance, resume building, and skills training programs.',
    icon: 'fas fa-briefcase',
    availability: 'Mon-Fri 9AM-3PM',
    languages: ['English', 'Spanish'],
    contactLink: 'tel:+1-555-0105',
    category: 'employment',
    featured: false
  },
  {
    id: 6,
    title: 'Family Services',
    description: 'Support for families including childcare resources and parenting classes.',
    icon: 'fas fa-home',
    availability: 'Mon-Fri 10AM-6PM',
    languages: ['English', 'Spanish', 'Arabic', 'Somali'],
    contactLink: 'tel:+1-555-0106',
    category: 'family',
    featured: false
  }
]

// 获取所有服务
export const getServices = () => {
  return servicesData
}

// 获取特色服务
export const getFeaturedServices = () => {
  return servicesData.filter(service => service.featured)
}

// 根据分类获取服务
export const getServicesByCategory = (category) => {
  return servicesData.filter(service => service.category === category)
}

// 根据ID获取服务
export const getServiceById = (id) => {
  return servicesData.find(service => service.id === parseInt(id))
}

// 获取服务分类
export const getServiceCategories = () => {
  const categories = [...new Set(servicesData.map(service => service.category))]
  return categories.map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
    count: servicesData.filter(service => service.category === category).length
  }))
}

export default {
  servicesData,
  getServices,
  getFeaturedServices,
  getServicesByCategory,
  getServiceById,
  getServiceCategories
}
