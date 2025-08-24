// src/utils/appointmentData.js
const STORAGE_KEY = 'healthcareAppointments'

// 模拟生成预约数据
const generateMockAppointments = () => {
  const services = ['gp', 'specialist', 'mental', 'checkup']
  const doctors = [
    { id: 'dr1', name: 'Dr. Sarah Johnson' },
    { id: 'dr2', name: 'Dr. Michael Chen' },
    { id: 'dr4', name: 'Dr. James Wilson' },
    { id: 'dr5', name: 'Dr. Lisa Brown' },
    { id: 'dr7', name: 'Dr. Anna Taylor' }
  ]

  const firstNames = ['John', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Anna', 'Robert', 'Emily']
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Wilson', 'Davis', 'Miller', 'Taylor', 'Anderson', 'White', 'Clark']

  const mockAppointments = []
  const today = new Date()

  // 生成接下来10天的预约数据
  for (let dayOffset = 0; dayOffset < 10; dayOffset++) {
    const appointmentDate = new Date(today)
    appointmentDate.setDate(today.getDate() + dayOffset)

    // 每天生成3-5个预约
    const appointmentsPerDay = Math.floor(Math.random() * 3) + 3
    const usedTimes = new Set() // 防止同一天同一时间重复预约

    for (let i = 0; i < appointmentsPerDay; i++) {
      let time
      let attempts = 0

      // 确保不重复时间
      do {
        const startHour = Math.floor(Math.random() * 9) + 8 // 8-16点
        const startMinute = Math.random() > 0.5 ? 30 : 0
        time = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`
        attempts++
      } while (usedTimes.has(time) && attempts < 20)

      if (attempts >= 20) continue // 如果找不到可用时间，跳过

      usedTimes.add(time)

      const service = services[Math.floor(Math.random() * services.length)]
      const doctor = doctors[Math.floor(Math.random() * doctors.length)]
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

      const dateStr = appointmentDate.toISOString().split('T')[0]

      const appointment = {
        id: `mock_${Date.now()}_${i}_${dayOffset}_${time.replace(':', '')}`,
        service,
        doctorId: doctor.id,
        date: dateStr,
        time,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        phone: `04${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        reason: getRandomReason(service),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        // Calendar display properties
        start: `${dateStr}T${time}:00`,
        end: `${dateStr}T${addMinutes(time, 30)}:00`,
        title: `${firstName} ${lastName} - ${getServiceName(service)}`,
        color: getServiceColor(service)
      }

      mockAppointments.push(appointment)
    }
  }

  return mockAppointments
}

// 辅助函数
const addMinutes = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, mins + minutes)
  return date.toTimeString().slice(0, 5)
}

const getRandomReason = (service) => {
  const reasons = {
    gp: ['Annual checkup', 'Flu symptoms', 'Regular consultation', 'Health screening', 'Follow-up visit'],
    specialist: ['Heart consultation', 'Skin examination', 'Joint pain assessment', 'Follow-up appointment', 'Specialist review'],
    mental: ['Counseling session', 'Stress management', 'Therapy appointment', 'Mental health consultation', 'Support session'],
    checkup: ['Annual physical', 'Health screening', 'Preventive checkup', 'Wellness exam', 'Routine examination']
  }
  const serviceReasons = reasons[service] || reasons.gp
  return serviceReasons[Math.floor(Math.random() * serviceReasons.length)]
}

const getServiceName = (service) => {
  const names = {
    gp: 'General Practice',
    specialist: 'Specialist',
    mental: 'Mental Health',
    checkup: 'Health Checkup'
  }
  return names[service] || 'Appointment'
}

const getServiceColor = (service) => {
  const colors = {
    gp: '#28a745',
    specialist: '#007bff',
    mental: '#6f42c1',
    checkup: '#fd7e14'
  }
  return colors[service] || '#6c757d'
}

// 数据管理类
export class AppointmentDataManager {
  constructor() {
    this.appointments = this.loadAppointments()
  }

  // 加载预约数据
  loadAppointments() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const appointments = JSON.parse(stored)
        // 确保每个预约都有日历显示所需的属性
        return appointments.map(apt => this.formatAppointmentForCalendar(apt))
      } else {
        // 如果没有存储数据，生成模拟数据
        const mockData = generateMockAppointments()
        this.saveAppointments(mockData)
        return mockData
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
      // 如果加载失败，生成新的模拟数据
      const mockData = generateMockAppointments()
      this.saveAppointments(mockData)
      return mockData
    }
  }

  // 格式化预约数据以适配日历显示
  formatAppointmentForCalendar(appointment) {
    const start = appointment.start || `${appointment.date}T${appointment.time}:00`
    const end = appointment.end || `${appointment.date}T${addMinutes(appointment.time, 30)}:00`
    const title = appointment.title || `${appointment.firstName} ${appointment.lastName} - ${getServiceName(appointment.service)}`
    const color = appointment.color || getServiceColor(appointment.service)

    return {
      ...appointment,
      start,
      end,
      title,
      color
    }
  }

  // 保存预约数据
  saveAppointments(appointments = null) {
    try {
      const dataToSave = appointments || this.appointments
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      if (appointments) {
        this.appointments = appointments
      }
      console.log(`Saved ${dataToSave.length} appointments to storage`)
    } catch (error) {
      console.error('Error saving appointments:', error)
    }
  }

  // 获取所有预约
  getAllAppointments() {
    return this.appointments
  }

  // 添加新预约
  addAppointment(appointmentData) {
    const newId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newAppointment = {
      id: newId,
      ...appointmentData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }

    // 格式化为日历显示格式
    const formattedAppointment = this.formatAppointmentForCalendar(newAppointment)

    this.appointments.push(formattedAppointment)
    this.saveAppointments()

    console.log('Added new appointment:', formattedAppointment)
    return formattedAppointment
  }

  // 删除预约
  deleteAppointment(appointmentId) {
    const beforeCount = this.appointments.length
    this.appointments = this.appointments.filter(apt => apt.id !== appointmentId)
    const afterCount = this.appointments.length

    this.saveAppointments()
    console.log(`Deleted appointment ${appointmentId}. Count: ${beforeCount} -> ${afterCount}`)
    return beforeCount > afterCount
  }

  // 更新预约
  updateAppointment(appointmentId, updateData) {
    const index = this.appointments.findIndex(apt => apt.id === appointmentId)
    if (index !== -1) {
      this.appointments[index] = this.formatAppointmentForCalendar({
        ...this.appointments[index],
        ...updateData
      })
      this.saveAppointments()
      console.log('Updated appointment:', this.appointments[index])
      return this.appointments[index]
    }
    console.log('Appointment not found for update:', appointmentId)
    return null
  }

  // 检查时间冲突
  checkConflict(appointmentData, excludeId = null) {
    const newStart = new Date(`${appointmentData.date}T${appointmentData.time}:00`)
    const newEnd = new Date(`${appointmentData.date}T${addMinutes(appointmentData.time, 30)}:00`)

    const conflicts = this.appointments.filter(apt => {
      if (excludeId && apt.id === excludeId) return false

      // 如果指定了医生，只检查同一医生的冲突
      if (appointmentData.doctorId && apt.doctorId && apt.doctorId !== appointmentData.doctorId) return false

      const existingStart = new Date(apt.start)
      const existingEnd = new Date(apt.end)

      // 检查时间重叠
      return newStart < existingEnd && newEnd > existingStart
    })

    if (conflicts.length > 0) {
      console.log('Time conflict detected:', conflicts)
    }

    return conflicts.length > 0
  }

  // 获取特定日期和医生的已预约时间
  getBookedTimes(date, doctorId = null) {
    if (!date) return []

    const bookedTimes = this.appointments
      .filter(apt => {
        if (apt.date !== date) return false
        if (doctorId && apt.doctorId && apt.doctorId !== doctorId) return false
        return true
      })
      .map(apt => apt.time)

    console.log(`Booked times for ${date} ${doctorId ? `(${doctorId})` : '(all doctors)'}:`, bookedTimes)
    return bookedTimes
  }

  // 重新生成模拟数据
  generateNewMockData() {
    const mockData = generateMockAppointments()
    this.appointments = mockData
    this.saveAppointments()
    console.log(`Generated ${mockData.length} new mock appointments`)
    return mockData
  }

  // 清空所有数据
  clearAllAppointments() {
    this.appointments = []
    this.saveAppointments()
    console.log('Cleared all appointments')
  }

  // 重新加载数据（强制从localStorage读取）
  reloadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const appointments = JSON.parse(stored)
        this.appointments = appointments.map(apt => this.formatAppointmentForCalendar(apt))
        console.log(`Reloaded ${this.appointments.length} appointments from storage`)
      }
    } catch (error) {
      console.error('Error reloading from storage:', error)
    }
    return this.appointments
  }
}

// 创建全局实例
export const appointmentManager = new AppointmentDataManager()
