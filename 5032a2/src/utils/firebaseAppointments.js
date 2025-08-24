// utils/firebaseAppointments.js
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION_NAME = 'appointments'

export const appointmentService = {
  // 创建预约
  async createAppointment(appointmentData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...appointmentData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating appointment:', error)
      return { success: false, error: error.message }
    }
  },

  // 获取所有预约
  async getAppointments(userId = null) {
    try {
      let q = collection(db, COLLECTION_NAME)

      if (userId) {
        q = query(q, where('userId', '==', userId))
      }

      q = query(q, orderBy('createdAt', 'desc'))

      const querySnapshot = await getDocs(q)
      const appointments = []

      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        })
      })

      return { success: true, appointments }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      return { success: false, error: error.message }
    }
  },

  // 更新预约
  async updateAppointment(id, appointmentData) {
    try {
      const appointmentRef = doc(db, COLLECTION_NAME, id)
      await updateDoc(appointmentRef, {
        ...appointmentData,
        updatedAt: new Date()
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating appointment:', error)
      return { success: false, error: error.message }
    }
  },

  // 删除预约
  async deleteAppointment(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id))
      return { success: true }
    } catch (error) {
      console.error('Error deleting appointment:', error)
      return { success: false, error: error.message }
    }
  },

  // 检查时间冲突
  async checkTimeConflict(date, time, doctorId, excludeId = null) {
    try {
      const startDateTime = `${date}T${time}:00`
      const endTime = this.addMinutes(time, 30)
      const endDateTime = `${date}T${endTime}:00`

      let q = query(
        collection(db, COLLECTION_NAME),
        where('date', '==', date)
      )

      if (doctorId) {
        q = query(q, where('doctorId', '==', doctorId))
      }

      const querySnapshot = await getDocs(q)
      const conflicts = []

      querySnapshot.forEach((doc) => {
        const appointment = { id: doc.id, ...doc.data() }
        if (excludeId && appointment.id === excludeId) return

        const existingStart = `${appointment.date}T${appointment.time}:00`
        const existingEnd = `${appointment.date}T${this.addMinutes(appointment.time, 30)}:00`

        // 检查时间重叠
        if (startDateTime < existingEnd && endDateTime > existingStart) {
          conflicts.push(appointment)
        }
      })

      return {
        success: true,
        hasConflict: conflicts.length > 0,
        conflicts
      }
    } catch (error) {
      console.error('Error checking conflicts:', error)
      return { success: false, error: error.message }
    }
  },

  // 辅助函数：时间增加分钟
  addMinutes(time, minutes) {
    const [hours, mins] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, mins + minutes)
    return date.toTimeString().slice(0, 5)
  }
}
