// src/utils/ratings.js

/** 返回所有评分记录 */
export function getRatings() {
  return JSON.parse(localStorage.getItem('ratings') || '[]')
}

/**
 * 添加一条评分记录
 * @param {string} serviceId  服务标识 (如 'gp' / 'specialist' / 'mental')
 * @param {number} rating     星级 1-5
 * @param {string} user       用户名
 */
export function addRating(serviceId, rating, user) {
  const all = getRatings()
  all.push({
    serviceId,
    rating,
    user,
    timestamp: new Date().toISOString()
  })
  localStorage.setItem('ratings', JSON.stringify(all))
}
