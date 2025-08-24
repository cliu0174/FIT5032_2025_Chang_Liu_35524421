// src/utils/authUtils.js

// 获取当前用户信息
export const getCurrentUser = () => {
  try {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!isLoggedIn) return null

    const currentUser = localStorage.getItem('currentUser')
    const currentRole = localStorage.getItem('currentRole') || 'guest'
    const authProvider = localStorage.getItem('authProvider') || 'legacy'

    return {
      username: currentUser,
      role: currentRole,
      authProvider: authProvider,
      isLoggedIn: true
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// 检查是否为管理员
export const isAdmin = () => {
  const user = getCurrentUser()
  return user && user.role === 'admin'
}

// 检查是否为普通用户
export const isGuest = () => {
  const user = getCurrentUser()
  return user && user.role === 'guest'
}

// 检查是否可以删除预约 (只有管理员可以)
export const canDeleteAppointment = () => {
  return isAdmin()
}

// 检查是否可以管理所有预约 (只有管理员可以)
export const canManageAllAppointments = () => {
  return isAdmin()
}

// 检查是否可以查看预约详情 (所有登录用户都可以)
export const canViewAppointment = () => {
  const user = getCurrentUser()
  return user && user.isLoggedIn
}

// 获取用户显示名称
export const getUserDisplayName = () => {
  const user = getCurrentUser()
  if (!user) return 'Not logged in'

  const roleNames = {
    'admin': 'Administrator',
    'guest': 'User'
  }

  return `${user.username} (${roleNames[user.role] || 'User'})`
}

// 获取权限描述
export const getPermissionText = () => {
  const user = getCurrentUser()
  if (!user) return 'Not logged in'

  return user.role === 'admin' ? 'Full Access' : 'View Only'
}

// 获取权限样式类
export const getPermissionClass = () => {
  const user = getCurrentUser()
  if (!user) return 'no-access'

  return user.role === 'admin' ? 'admin-access' : 'user-access'
}
