// src/utils/users.js
// 升级版用户管理工具 - 独立版本，无Firebase依赖

// 初始化默认用户数据
const defaultUsers = [
  {
    id: 'admin-001',
    username: 'admin',
    email: 'admin@harmonest.com',
    password: '123456',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLogin: null
  },
  {
    id: 'guest-001',
    username: 'guest',
    email: 'guest@harmonest.com',
    password: 'guest123',
    role: 'guest',
    createdAt: new Date().toISOString(),
    lastLogin: null
  },
  {
    id: 'john-001',
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'guest',
    createdAt: new Date().toISOString(),
    lastLogin: null
  }
]

// 初始化用户数据
export const initializeUsers = () => {
  try {
    const existingUsers = localStorage.getItem('users')
    if (!existingUsers) {
      localStorage.setItem('users', JSON.stringify(defaultUsers))
      console.log('✅ Default users initialized')
      return defaultUsers
    }

    // 确保现有用户有必要的字段
    const users = JSON.parse(existingUsers)
    const updatedUsers = users.map(user => ({
      id: user.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      username: user.username,
      email: user.email || '',
      password: user.password,
      role: user.role || 'guest',
      createdAt: user.createdAt || new Date().toISOString(),
      lastLogin: user.lastLogin || null,
      ...user
    }))

    localStorage.setItem('users', JSON.stringify(updatedUsers))
    return updatedUsers
  } catch (error) {
    console.error('❌ Error initializing users:', error)
    localStorage.setItem('users', JSON.stringify(defaultUsers))
    return defaultUsers
  }
}

// 获取所有用户
export const getUsers = () => {
  try {
    const users = localStorage.getItem('users')
    if (!users) {
      return initializeUsers()
    }
    return JSON.parse(users)
  } catch (error) {
    console.error('❌ Error getting users:', error)
    return initializeUsers()
  }
}

// 根据用户名查找用户
export const getUserByUsername = (username) => {
  try {
    const users = getUsers()
    return users.find(user => user.username === username)
  } catch (error) {
    console.error('❌ Error finding user by username:', error)
    return null
  }
}

// 根据邮箱查找用户
export const getUserByEmail = (email) => {
  try {
    const users = getUsers()
    return users.find(user => user.email === email)
  } catch (error) {
    console.error('❌ Error finding user by email:', error)
    return null
  }
}

// 添加新用户
export const addUser = (userData) => {
  try {
    const users = getUsers()

    // 验证必要字段
    if (!userData.username || !userData.password) {
      return {
        success: false,
        message: 'Username and password are required'
      }
    }

    // 检查用户名是否已存在
    const existingUser = users.find(user => user.username === userData.username)
    if (existingUser) {
      return {
        success: false,
        message: 'Username already exists'
      }
    }

    // 检查邮箱是否已存在（如果提供了邮箱）
    if (userData.email) {
      const existingEmail = users.find(user => user.email === userData.email)
      if (existingEmail) {
        return {
          success: false,
          message: 'Email already exists'
        }
      }
    }

    // 创建新用户对象
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      username: userData.username.trim(),
      email: userData.email?.trim() || '',
      password: userData.password,
      role: userData.role || 'guest',
      createdAt: new Date().toISOString(),
      lastLogin: null
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    console.log('✅ User added successfully:', newUser.username)
    return {
      success: true,
      message: 'User created successfully',
      user: newUser
    }
  } catch (error) {
    console.error('❌ Error adding user:', error)
    return {
      success: false,
      message: 'Failed to create user'
    }
  }
}

// 更新用户信息
export const updateUser = (identifier, updates) => {
  try {
    const users = getUsers()
    const userIndex = users.findIndex(user =>
      user.id === identifier ||
      user.username === identifier ||
      user.email === identifier
    )

    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    // 更新用户信息
    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    localStorage.setItem('users', JSON.stringify(users))

    console.log('✅ User updated successfully:', users[userIndex].username)
    return {
      success: true,
      message: 'User updated successfully',
      user: users[userIndex]
    }
  } catch (error) {
    console.error('❌ Error updating user:', error)
    return {
      success: false,
      message: 'Failed to update user'
    }
  }
}

// 删除用户
export const deleteUser = (identifier) => {
  try {
    const users = getUsers()
    const userIndex = users.findIndex(user =>
      user.id === identifier ||
      user.username === identifier ||
      user.email === identifier
    )

    if (userIndex === -1) {
      return {
        success: false,
        message: 'User not found'
      }
    }

    const userToDelete = users[userIndex]

    // 防止删除默认管理员
    if (userToDelete.username === 'admin' && userToDelete.role === 'admin') {
      return {
        success: false,
        message: 'Cannot delete default administrator'
      }
    }

    users.splice(userIndex, 1)
    localStorage.setItem('users', JSON.stringify(users))

    console.log('✅ User deleted successfully:', userToDelete.username)
    return {
      success: true,
      message: 'User deleted successfully',
      user: userToDelete
    }
  } catch (error) {
    console.error('❌ Error deleting user:', error)
    return {
      success: false,
      message: 'Failed to delete user'
    }
  }
}

// 用户认证
export const authenticateUser = (identifier, password) => {
  try {
    const users = getUsers()
    const user = users.find(user =>
      (user.username === identifier || user.email === identifier) &&
      user.password === password
    )

    if (user) {
      // 更新最后登录时间
      updateUser(user.id, { lastLogin: new Date().toISOString() })

      return {
        success: true,
        message: 'Authentication successful',
        user: user
      }
    }

    return {
      success: false,
      message: 'Invalid credentials'
    }
  } catch (error) {
    console.error('❌ Error authenticating user:', error)
    return {
      success: false,
      message: 'Authentication failed'
    }
  }
}

// 获取用户统计信息
export const getUserStats = () => {
  try {
    const users = getUsers()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    return {
      totalUsers: users.length,
      adminUsers: users.filter(user => user.role === 'admin').length,
      guestUsers: users.filter(user => user.role === 'guest').length,
      recentUsers: users.filter(user =>
        user.createdAt && new Date(user.createdAt) > thirtyDaysAgo
      ).length,
      activeUsers: users.filter(user =>
        user.lastLogin && new Date(user.lastLogin) > thirtyDaysAgo
      ).length
    }
  } catch (error) {
    console.error('❌ Error getting user stats:', error)
    return {
      totalUsers: 0,
      adminUsers: 0,
      guestUsers: 0,
      recentUsers: 0,
      activeUsers: 0
    }
  }
}

// 验证用户数据
export const validateUserData = (userData) => {
  const errors = []

  if (!userData.username || userData.username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long')
  }

  if (userData.username && !/^[A-Za-z0-9_]+$/.test(userData.username)) {
    errors.push('Username can only contain letters, numbers, and underscores')
  }

  if (!userData.password || userData.password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push('Please enter a valid email address')
  }

  if (!userData.role || !['admin', 'guest'].includes(userData.role)) {
    errors.push('Please select a valid role (admin or guest)')
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  }
}

// 导出用户数据（去除密码）
export const exportUsers = () => {
  try {
    const users = getUsers()
    // 移除密码字段以保护隐私
    const exportData = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }))

    return {
      success: true,
      data: exportData,
      exportedAt: new Date().toISOString(),
      count: exportData.length
    }
  } catch (error) {
    console.error('❌ Error exporting users:', error)
    return {
      success: false,
      message: 'Failed to export users'
    }
  }
}

export default {
  initializeUsers,
  getUsers,
  getUserByUsername,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
  authenticateUser,
  getUserStats,
  validateUserData,
  exportUsers
}
