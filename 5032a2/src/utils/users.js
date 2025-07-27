// src/utils/users.js

// 默认用户：带角色信息
export const defaultUsers = [
  { username: 'admin',  password: '123456',     role: 'admin' },
  { username: 'guest',  password: 'guestguest', role: 'guest' }
]

// 获取所有用户：默认 + 存储在 localStorage 的
export function getUsers() {
  const extra = JSON.parse(localStorage.getItem('users') || '[]')
  return [...defaultUsers, ...extra]
}

// 向 localStorage 中追加新用户，并默认分配 guest 角色
export function addUser(user) {
  const extra = JSON.parse(localStorage.getItem('users') || '[]')
  extra.push({
    username: user.username,
    password: user.password,
    role: 'guest'
  })
  localStorage.setItem('users', JSON.stringify(extra))
}
