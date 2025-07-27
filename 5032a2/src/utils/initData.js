// src/utils/initData.js
// 初始化医疗服务评分数据

export const initializeHealthcareData = () => {
  console.log('Initializing healthcare data...')

  // 预设评分数据
  const presetRatings = [
    {
      id: '1001',
      service: 'gp',
      serviceName: 'General Practice Services',
      rating: {
        overall: 5,
        quality: 5,
        waitTime: 4,
        communication: 5,
        facilities: 4,
        review: 'Excellent service, very professional staff.'
      },
      user: { username: 'john_doe', userId: 'john_doe' },
      timestamp: '2025-01-20T10:30:00.000Z',
      submittedAt: 'January 20, 2025 at 10:30 AM'
    },
    {
      id: '1002',
      service: 'gp',
      serviceName: 'General Practice Services',
      rating: {
        overall: 4,
        quality: 4,
        waitTime: 3,
        communication: 4,
        facilities: 4,
        review: 'Good experience overall.'
      },
      user: { username: 'mary_smith', userId: 'mary_smith' },
      timestamp: '2025-01-19T14:15:00.000Z',
      submittedAt: 'January 19, 2025 at 02:15 PM'
    },
    {
      id: '1003',
      service: 'specialist',
      serviceName: 'Specialist Consultations',
      rating: {
        overall: 5,
        quality: 5,
        waitTime: 4,
        communication: 5,
        facilities: 5,
        review: 'Outstanding specialist care.'
      },
      user: { username: 'david_chen', userId: 'david_chen' },
      timestamp: '2025-01-18T09:45:00.000Z',
      submittedAt: 'January 18, 2025 at 09:45 AM'
    },
    {
      id: '1004',
      service: 'specialist',
      serviceName: 'Specialist Consultations',
      rating: {
        overall: 4,
        quality: 4,
        waitTime: 3,
        communication: 4,
        facilities: 4,
        review: 'Professional and thorough.'
      },
      user: { username: 'sarah_wilson', userId: 'sarah_wilson' },
      timestamp: '2025-01-17T16:20:00.000Z',
      submittedAt: 'January 17, 2025 at 04:20 PM'
    },
    {
      id: '1005',
      service: 'mental',
      serviceName: 'Mental Health Services',
      rating: {
        overall: 5,
        quality: 5,
        waitTime: 5,
        communication: 5,
        facilities: 4,
        review: 'Compassionate and helpful counseling.'
      },
      user: { username: 'mike_brown', userId: 'mike_brown' },
      timestamp: '2025-01-16T11:00:00.000Z',
      submittedAt: 'January 16, 2025 at 11:00 AM'
    },
    {
      id: '1006',
      service: 'mental',
      serviceName: 'Mental Health Services',
      rating: {
        overall: 4,
        quality: 4,
        waitTime: 4,
        communication: 5,
        facilities: 3,
        review: 'Very supportive staff.'
      },
      user: { username: 'lisa_davis', userId: 'lisa_davis' },
      timestamp: '2025-01-15T13:30:00.000Z',
      submittedAt: 'January 15, 2025 at 01:30 PM'
    }
  ]

  // 预设服务统计数据
  const presetServicesData = {
    gp: {
      averageRating: 4.5,
      totalReviews: 2,
      categories: [
        { name: 'Service Quality', rating: 4.5, key: 'quality' },
        { name: 'Wait Time', rating: 3.5, key: 'waitTime' },
        { name: 'Communication', rating: 4.5, key: 'communication' },
        { name: 'Facilities', rating: 4.0, key: 'facilities' }
      ],
      recentRatings: [
        { id: '1001', overall: 5, review: 'Excellent service, very professional staff.', user: 'john_doe', date: 'January 20, 2025 at 10:30 AM' },
        { id: '1002', overall: 4, review: 'Good experience overall.', user: 'mary_smith', date: 'January 19, 2025 at 02:15 PM' }
      ]
    },
    specialist: {
      averageRating: 4.5,
      totalReviews: 2,
      categories: [
        { name: 'Service Quality', rating: 4.5, key: 'quality' },
        { name: 'Wait Time', rating: 3.5, key: 'waitTime' },
        { name: 'Communication', rating: 4.5, key: 'communication' },
        { name: 'Facilities', rating: 4.5, key: 'facilities' }
      ],
      recentRatings: [
        { id: '1003', overall: 5, review: 'Outstanding specialist care.', user: 'david_chen', date: 'January 18, 2025 at 09:45 AM' },
        { id: '1004', overall: 4, review: 'Professional and thorough.', user: 'sarah_wilson', date: 'January 17, 2025 at 04:20 PM' }
      ]
    },
    mental: {
      averageRating: 4.5,
      totalReviews: 2,
      categories: [
        { name: 'Service Quality', rating: 4.5, key: 'quality' },
        { name: 'Wait Time', rating: 4.5, key: 'waitTime' },
        { name: 'Communication', rating: 5.0, key: 'communication' },
        { name: 'Facilities', rating: 3.5, key: 'facilities' }
      ],
      recentRatings: [
        { id: '1005', overall: 5, review: 'Compassionate and helpful counseling.', user: 'mike_brown', date: 'January 16, 2025 at 11:00 AM' },
        { id: '1006', overall: 4, review: 'Very supportive staff.', user: 'lisa_davis', date: 'January 15, 2025 at 01:30 PM' }
      ]
    }
  }

  // 预设管理员汇总数据
  const presetAdminSummary = {
    totalRatings: 6,
    averageOverallRating: 4.5,
    lastUpdated: new Date().toISOString(),
    serviceBreakdown: presetServicesData
  }

  try {
    // 只在没有数据时添加预设数据
    const existingRatings = JSON.parse(localStorage.getItem('healthcareRatings') || '[]')
    if (existingRatings.length === 0) {
      localStorage.setItem('healthcareRatings', JSON.stringify(presetRatings))
      console.log('✅ Preset rating data initialized')
    }

    if (!localStorage.getItem('healthcareServicesData')) {
      localStorage.setItem('healthcareServicesData', JSON.stringify(presetServicesData))
      console.log('✅ Preset services data initialized')
    }

    if (!localStorage.getItem('healthcareAdminSummary')) {
      localStorage.setItem('healthcareAdminSummary', JSON.stringify(presetAdminSummary))
      console.log('✅ Preset admin summary initialized')
    }

    return true
  } catch (error) {
    console.error('❌ Error initializing healthcare data:', error)
    return false
  }
}

// 清除所有数据的工具函数（开发时使用）
export const clearAllHealthcareData = () => {
  localStorage.removeItem('healthcareRatings')
  localStorage.removeItem('healthcareServicesData')
  localStorage.removeItem('healthcareAdminSummary')
  console.log('🗑️ All healthcare data cleared')
}
