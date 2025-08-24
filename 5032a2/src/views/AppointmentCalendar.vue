<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <h2>Appointment Calendar</h2>
      <div class="calendar-info">
        <div class="user-info">
          <div class="user-badge">
            <span class="user-name">{{ currentUserDisplay }}</span>
            <span class="user-permissions" :class="permissionClass">
              {{ permissionText }}
            </span>
          </div>
        </div>
        <div class="calendar-controls">
          <button @click="refreshData" class="btn-refresh">
            🔄 Refresh Data
          </button>
          <!-- 只有管理员可以看到管理按钮 -->
          <button
            v-if="isAdminUser"
            @click="clearData"
            class="btn-clear"
            title="Clear all appointments (Admin only)"
          >
            🗑️ Clear All
          </button>
          <button
            v-if="isAdminUser"
            @click="generateMockData"
            class="btn-generate"
            title="Generate sample data (Admin only)"
          >
            📝 Generate Sample Data
          </button>
          <select v-model="selectedDoctor" @change="filterByDoctor" class="doctor-filter">
            <option value="">All Doctors</option>
            <option v-for="doctor in allDoctors" :key="doctor.id" :value="doctor.id">
              {{ doctor.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-number">{{ totalAppointments }}</span>
        <span class="stat-label">Total Appointments</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ todayAppointments }}</span>
        <span class="stat-label">Today</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ thisWeekAppointments }}</span>
        <span class="stat-label">This Week</span>
      </div>
    </div>

    <!-- Permission Notice for regular users -->
    <div v-if="!isAdminUser" class="permission-notice">
      <div class="notice-content">
        <span class="notice-icon">ℹ️</span>
        <span class="notice-text">
          You can view appointments but cannot delete them. Only administrators can delete appointments.
        </span>
      </div>
    </div>

    <!-- FullCalendar Component -->
    <div class="calendar-wrapper">
      <FullCalendar
        ref="calendar"
        :options="calendarOptions"
      />
    </div>

    <!-- Appointment Details Modal (for users - read-only) -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content details-modal" @click.stop>
        <div class="modal-header">
          <h3>Appointment Details</h3>
          <button @click="closeDetailsModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="appointmentToView" class="appointment-details-full">
            <div class="detail-row">
              <span class="detail-label">Patient:</span>
              <span class="detail-value">{{ appointmentToView.firstName }} {{ appointmentToView.lastName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDate(appointmentToView.date) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">{{ convertTo12Hour(appointmentToView.time) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value">{{ getServiceName(appointmentToView.service) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Doctor:</span>
              <span class="detail-value">{{ getDoctorName(appointmentToView.doctorId) }}</span>
            </div>
            <div v-if="appointmentToView.reason" class="detail-row">
              <span class="detail-label">Reason:</span>
              <span class="detail-value">{{ appointmentToView.reason }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value status" :class="appointmentToView.status">{{ appointmentToView.status }}</span>
            </div>
          </div>
          <div class="detail-actions">
            <button @click="closeDetailsModal" class="btn-close">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal (only for admins) -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Delete Appointment</h3>
          <button @click="closeDeleteModal" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p><strong>Are you sure you want to delete this appointment?</strong></p>
          <div v-if="appointmentToDelete" class="appointment-details">
            <p><strong>Patient:</strong> {{ appointmentToDelete.firstName }} {{ appointmentToDelete.lastName }}</p>
            <p><strong>Date:</strong> {{ formatDate(appointmentToDelete.date) }}</p>
            <p><strong>Time:</strong> {{ convertTo12Hour(appointmentToDelete.time) }}</p>
            <p><strong>Service:</strong> {{ getServiceName(appointmentToDelete.service) }}</p>
            <p><strong>Doctor:</strong> {{ getDoctorName(appointmentToDelete.doctorId) }}</p>
          </div>
          <div class="delete-actions">
            <button @click="closeDeleteModal" class="btn-cancel">Cancel</button>
            <button @click="confirmDelete" class="btn-delete">Delete Appointment</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { appointmentManager } from '@/utils/appointmentData.js'
import {
  getCurrentUser,
  isAdmin,
  canDeleteAppointment,
  canViewAppointment,
  getUserDisplayName,
  getPermissionText,
  getPermissionClass
} from '@/utils/authUtils.js'

// State management
const calendar = ref(null)
const appointments = ref([])
const selectedDoctor = ref('')
const showDeleteModal = ref(false)
const showDetailsModal = ref(false)
const appointmentToDelete = ref(null)
const appointmentToView = ref(null)

// 权限相关的计算属性
const currentUser = computed(() => getCurrentUser())
const isAdminUser = computed(() => isAdmin())
const canDelete = computed(() => canDeleteAppointment())
const canView = computed(() => canViewAppointment())

const currentUserDisplay = computed(() => getUserDisplayName())
const permissionText = computed(() => getPermissionText())
const permissionClass = computed(() => getPermissionClass())

// Doctor data
const allDoctors = [
  { id: 'dr1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
  { id: 'dr2', name: 'Dr. Michael Chen', specialty: 'General Practice' },
  { id: 'dr3', name: 'Dr. Emily White', specialty: 'General Practice' },
  { id: 'dr4', name: 'Dr. James Wilson', specialty: 'Cardiology' },
  { id: 'dr5', name: 'Dr. Lisa Brown', specialty: 'Dermatology' },
  { id: 'dr6', name: 'Dr. Robert Davis', specialty: 'Orthopedics' },
  { id: 'dr7', name: 'Dr. Anna Taylor', specialty: 'Clinical Psychology' },
  { id: 'dr8', name: 'Dr. David Miller', specialty: 'Psychiatry' }
]

// FullCalendar configuration
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  height: 'auto',
  contentHeight: 600,
  aspectRatio: 1.8,
  slotMinTime: '08:00:00',
  slotMaxTime: '18:00:00',
  slotDuration: '00:30:00',
  allDaySlot: false,
  selectable: false,
  selectMirror: false,
  eventClick: handleEventClick,
  events: filteredAppointments.value,
  businessHours: [
    {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '08:00',
      endTime: '18:00'
    },
    {
      daysOfWeek: [6],
      startTime: '09:00',
      endTime: '14:00'
    }
  ],
  eventDisplay: 'block',
  dayMaxEventRows: false,
  moreLinkClick: 'popover',
  nowIndicator: true,
  scrollTime: '09:00:00',
  slotLabelFormat: {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }
}))

// Computed properties
const filteredAppointments = computed(() => {
  let filtered = appointments.value
  if (selectedDoctor.value) {
    filtered = filtered.filter(apt => apt.doctorId === selectedDoctor.value)
  }
  console.log('Filtered appointments for display:', filtered.length, filtered)
  return filtered
})

const totalAppointments = computed(() => appointments.value.length)

const todayAppointments = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return appointments.value.filter(apt => apt.date === today).length
})

const thisWeekAppointments = computed(() => {
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))

  return appointments.value.filter(apt => {
    const aptDate = new Date(apt.date)
    return aptDate >= startOfWeek && aptDate <= endOfWeek
  }).length
})

// Event handlers - 根据权限决定显示详情还是删除选项
const handleEventClick = (clickInfo) => {
  const appointment = appointments.value.find(apt => apt.id === clickInfo.event.id)
  if (!appointment) {
    console.log('Appointment not found:', clickInfo.event.id)
    return
  }

  console.log('Event clicked:', appointment, 'Admin user:', isAdminUser.value)

  if (isAdminUser.value) {
    // 管理员：显示删除确认
    appointmentToDelete.value = appointment
    showDeleteModal.value = true
  } else {
    // 普通用户：显示详情
    appointmentToView.value = appointment
    showDetailsModal.value = true
  }
}

const refreshData = () => {
  // 强制从存储重新加载数据
  appointments.value = appointmentManager.reloadFromStorage()

  nextTick(() => {
    calendar.value?.getApi().refetchEvents()
  })

  console.log('Data refreshed, found appointments:', appointments.value.length)
  alert(`Data refreshed! Found ${appointments.value.length} appointments.`)
}

const clearData = () => {
  if (!isAdminUser.value) {
    alert('Access denied. Only administrators can clear all appointments.')
    return
  }

  if (confirm('Are you sure you want to delete ALL appointments? This cannot be undone.')) {
    appointmentManager.clearAllAppointments()
    appointments.value = []
    nextTick(() => {
      calendar.value?.getApi().refetchEvents()
    })
    alert('All appointments have been deleted.')
  }
}

const generateMockData = () => {
  if (!isAdminUser.value) {
    alert('Access denied. Only administrators can generate sample data.')
    return
  }

  if (confirm('This will replace all existing appointments with sample data. Continue?')) {
    appointments.value = appointmentManager.generateNewMockData()
    nextTick(() => {
      calendar.value?.getApi().refetchEvents()
    })
    console.log('Generated mock data:', appointments.value.length)
    alert(`Generated ${appointments.value.length} sample appointments!`)
  }
}

const filterByDoctor = () => {
  console.log('Filtering by doctor:', selectedDoctor.value)
  nextTick(() => {
    calendar.value?.getApi().refetchEvents()
  })
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  appointmentToView.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  appointmentToDelete.value = null
}

const confirmDelete = () => {
  if (!isAdminUser.value) {
    alert('Access denied. You do not have permission to delete appointments.')
    return
  }

  if (appointmentToDelete.value) {
    console.log('Deleting appointment:', appointmentToDelete.value.id)
    const deleted = appointmentManager.deleteAppointment(appointmentToDelete.value.id)

    if (deleted) {
      appointments.value = appointmentManager.getAllAppointments()

      nextTick(() => {
        calendar.value?.getApi().refetchEvents()
      })

      alert('Appointment deleted successfully!')
    } else {
      alert('Failed to delete appointment. Please try again.')
    }

    closeDeleteModal()
  }
}

// Helper functions
const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

const getDoctorName = (doctorId) => {
  const doctor = allDoctors.find(d => d.id === doctorId)
  return doctor ? doctor.name : 'Not assigned'
}

onMounted(() => {
  console.log('Calendar mounted, current user:', currentUser.value)

  // 检查用户是否已登录
  if (!canView.value) {
    alert('Please log in to view appointments.')
    return
  }

  refreshData()
})
</script>

<style scoped>
.calendar-container {
  padding: 1rem;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.calendar-header {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.calendar-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.calendar-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.user-permissions {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.user-permissions.admin-access {
  background: #d4edda;
  color: #155724;
}

.user-permissions.user-access {
  background: #fff3cd;
  color: #856404;
}

.user-permissions.no-access {
  background: #f8d7da;
  color: #721c24;
}

.calendar-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-refresh,
.btn-clear,
.btn-generate {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.btn-refresh {
  background: linear-gradient(135deg, #17a2b8 0%, #20c997 100%);
  color: white;
}

.btn-refresh:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(23, 162, 184, 0.3);
}

.btn-clear {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.btn-clear:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.btn-generate {
  background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
  color: #212529;
}

.btn-generate:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
}

.doctor-filter {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 0.9rem;
  min-width: 150px;
}

/* Permission Notice */
.permission-notice {
  background: #cce5ff;
  border: 1px solid #b3d7ff;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin: 0 1rem 1rem 1rem;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notice-icon {
  font-size: 1.2rem;
}

.notice-text {
  color: #0056b3;
  font-size: 0.9rem;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.stat-item {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-wrapper {
  flex: 1;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 0 1rem;
}

/* Calendar styles */
:deep(.fc) {
  height: 100% !important;
}

:deep(.fc-event) {
  cursor: pointer;
  border-radius: 4px;
  border: none;
  font-size: 0.8rem;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

:deep(.fc-event:hover) {
  box-shadow: 0 3px 8px rgba(0,0,0,0.3);
  transform: translateY(-1px);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.details-modal .modal-body {
  padding: 2rem;
}

.appointment-details-full {
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #495057;
}

.detail-value {
  color: #6c757d;
}

.detail-value.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: #28a745;
  color: white;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-close {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-close:hover {
  background: #5a6268;
}

/* Delete modal styles */
.delete-modal .modal-body {
  padding: 2rem;
}

.appointment-details {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
}

.appointment-details p {
  margin: 0.5rem 0;
  color: #495057;
}

.delete-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-cancel,
.btn-delete {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
  transform: translateY(-1px);
}

@media (max-width: 1200px) {
  .calendar-info {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .calendar-controls {
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .stats-bar {
    flex-direction: column;
  }
}
/* 只需要在现有的 <style scoped> 中添加这几行样式 */

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #e9ecef;
}

.user-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  margin: 0; /* 确保没有额外边距 */
}

.user-permissions {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

/* 现有的权限颜色样式保持不变 */
.user-permissions.admin-access {
  background: #d4edda;
  color: #155724;
}

.user-permissions.user-access {
  background: #fff3cd;
  color: #856404;
}

.user-permissions.no-access {
  background: #f8d7da;
  color: #721c24;
}
</style>
