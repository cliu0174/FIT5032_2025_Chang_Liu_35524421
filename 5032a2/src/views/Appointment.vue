<template>
  <div class="appointment-page">
    <div class="appointment-container">
      <!-- Left Side - Appointment Info -->
      <div class="appointment-info">
        <h1 class="appointment-title">Book Appointment</h1>

        <div class="appointment-details">
          <p class="info-text">
            Schedule your appointment online or call <strong>(03) 9827 5500</strong> for immediate assistance
          </p>

          <div class="info-section">
            <h3>Available Services:</h3>
            <ul class="services-list">
              <li>• General Practice Consultations</li>
              <li>• Specialist Medical Services</li>
              <li>• Mental Health Support</li>
              <li>• Health Check-ups</li>
              <li>• Preventive Care</li>
            </ul>
          </div>

          <div class="info-section">
            <h3>Clinic Hours:</h3>
            <div class="hours-info">
              <div class="hour-item">
                <span class="day">Monday - Friday:</span>
                <span class="time">8:00 AM - 6:00 PM</span>
              </div>
              <div class="hour-item">
                <span class="day">Saturday:</span>
                <span class="time">9:00 AM - 2:00 PM</span>
              </div>
              <div class="hour-item">
                <span class="day">Sunday:</span>
                <span class="time">Closed</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3>Location:</h3>
            <address>
              South Yarra Medical Center<br>
              PO Box 520<br>
              South Yarra VIC 3141<br>
              Melbourne, Australia
            </address>
          </div>
        </div>

        <!-- Important Notes -->
        <div class="notes-card">
          <h4>Important Notes:</h4>
          <ul class="notes-list">
            <li>Please arrive 15 minutes early</li>
            <li>Bring your Medicare card and ID</li>
            <li>Cancellations require 24hrs notice</li>
            <li>Emergency? Call (03) 9827 5555</li>
          </ul>
        </div>
      </div>

      <!-- Right Side - Appointment Form -->
      <div class="appointment-form-section">
        <form @submit.prevent="submitAppointment" class="appointment-form">
          <!-- Service Selection -->
          <div class="form-group">
            <label for="service">Service Type *</label>
            <select
              id="service"
              v-model="appointment.service"
              required
              class="form-select"
              @change="updateDoctorsList"
            >
              <option value="">Select a service</option>
              <option value="gp">General Practice</option>
              <option value="specialist">Specialist Consultation</option>
              <option value="mental">Mental Health Services</option>
              <option value="checkup">Health Check-up</option>
            </select>
          </div>

          <!-- Doctor Selection -->
          <div class="form-group" v-if="appointment.service">
            <label for="doctor">Preferred Doctor</label>
            <select
              id="doctor"
              v-model="appointment.doctor"
              class="form-select"
            >
              <option value="">Any available doctor</option>
              <option
                v-for="doctor in availableDoctors"
                :key="doctor.id"
                :value="doctor.id"
              >
                {{ doctor.name }} - {{ doctor.specialty }}
              </option>
            </select>
          </div>

          <!-- Date and Time Selection -->
          <div class="form-row">
            <div class="form-group">
              <label for="date">Preferred Date *</label>
              <input
                type="date"
                id="date"
                v-model="appointment.date"
                required
                class="form-input"
                :min="minDate"
                :max="maxDate"
                @change="updateAvailableSlots"
              />
            </div>

            <div class="form-group">
              <label for="time">Preferred Time *</label>
              <select
                id="time"
                v-model="appointment.time"
                required
                class="form-select"
                :disabled="!appointment.date"
              >
                <option value="">Select time</option>
                <option
                  v-for="slot in availableTimeSlots"
                  :key="slot.value"
                  :value="slot.value"
                  :disabled="!slot.available"
                >
                  {{ slot.display }} {{ slot.available ? '' : '(Booked)' }}
                </option>
              </select>
            </div>
          </div>

          <!-- Patient Information -->
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                v-model="appointment.firstName"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                v-model="appointment.lastName"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                v-model="appointment.email"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                v-model="appointment.phone"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="medicare">Medicare Number</label>
            <input
              type="text"
              id="medicare"
              v-model="appointment.medicare"
              class="form-input"
              placeholder="Optional - for faster check-in"
            />
          </div>

          <!-- Reason for Visit -->
          <div class="form-group">
            <label for="reason">Reason for Visit *</label>
            <textarea
              id="reason"
              v-model="appointment.reason"
              rows="4"
              required
              class="form-textarea"
              placeholder="Please describe your symptoms or reason for the appointment..."
            ></textarea>
          </div>

          <!-- Additional Notes -->
          <div class="form-group">
            <label for="notes">Additional Notes</label>
            <textarea
              id="notes"
              v-model="appointment.notes"
              rows="3"
              class="form-textarea"
              placeholder="Any additional information or special requests..."
            ></textarea>
          </div>

          <!-- Urgent Checkbox -->
          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="appointment.urgent"
                class="form-checkbox"
              />
              <span class="checkbox-text">This is an urgent appointment</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? 'Booking...' : 'Book Appointment' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Form data
const appointment = ref({
  service: '',
  doctor: '',
  date: '',
  time: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  medicare: '',
  reason: '',
  notes: '',
  urgent: false
})

const isSubmitting = ref(false)

// Doctors data
const doctorsDatabase = {
  gp: [
    { id: 'dr1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
    { id: 'dr2', name: 'Dr. Michael Chen', specialty: 'General Practice' },
    { id: 'dr3', name: 'Dr. Emily White', specialty: 'General Practice' }
  ],
  specialist: [
    { id: 'dr4', name: 'Dr. James Wilson', specialty: 'Cardiology' },
    { id: 'dr5', name: 'Dr. Lisa Brown', specialty: 'Dermatology' },
    { id: 'dr6', name: 'Dr. Robert Davis', specialty: 'Orthopedics' }
  ],
  mental: [
    { id: 'dr7', name: 'Dr. Anna Taylor', specialty: 'Clinical Psychology' },
    { id: 'dr8', name: 'Dr. David Miller', specialty: 'Psychiatry' }
  ],
  checkup: [
    { id: 'dr1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
    { id: 'dr2', name: 'Dr. Michael Chen', specialty: 'General Practice' }
  ]
}

const availableDoctors = ref([])
const availableTimeSlots = ref([])

// Date constraints
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const maxDate = computed(() => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60) // 2 months in advance
  return maxDate.toISOString().split('T')[0]
})

// Generate time slots
const generateTimeSlots = () => {
  const slots = []
  const times = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ]

  times.forEach(time => {
    // Randomly mark some slots as unavailable for demo
    const available = Math.random() > 0.3
    slots.push({
      value: time,
      display: convertTo12Hour(time),
      available: available
    })
  })

  return slots
}

const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

// Methods
const updateDoctorsList = () => {
  if (appointment.value.service) {
    availableDoctors.value = doctorsDatabase[appointment.value.service] || []
  } else {
    availableDoctors.value = []
  }
  appointment.value.doctor = '' // Reset doctor selection
}

const updateAvailableSlots = () => {
  if (appointment.value.date) {
    availableTimeSlots.value = generateTimeSlots()
  } else {
    availableTimeSlots.value = []
  }
  appointment.value.time = '' // Reset time selection
}

const submitAppointment = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true

  try {
    // Create appointment object
    const appointmentData = {
      id: Date.now().toString(),
      ...appointment.value,
      status: 'pending',
      createdAt: new Date().toISOString(),
      appointmentDate: `${appointment.value.date} ${appointment.value.time}`
    }

    // Save to localStorage
    const existingAppointments = JSON.parse(localStorage.getItem('healthcareAppointments') || '[]')
    existingAppointments.unshift(appointmentData)
    localStorage.setItem('healthcareAppointments', JSON.stringify(existingAppointments))

    // Show success message
    alert(`Appointment booked successfully!

Date: ${appointment.value.date}
Time: ${convertTo12Hour(appointment.value.time)}
Service: ${appointment.value.service}

You will receive a confirmation email shortly.`)

    // Reset form
    appointment.value = {
      service: '',
      doctor: '',
      date: '',
      time: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      medicare: '',
      reason: '',
      notes: '',
      urgent: false
    }

    // Reset dependent fields
    availableDoctors.value = []
    availableTimeSlots.value = []

  } catch (error) {
    console.error('Error booking appointment:', error)
    alert('There was an error booking your appointment. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  console.log('Appointment page loaded')
})
</script>

<style scoped>
.appointment-page {
  min-height: 100vh;
  background: white;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.appointment-container {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: #e8d5e8;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
  font-weight: normal;
}

/* Left Side - Appointment Info */
.appointment-info {
  background: #e8d5e8;
  padding: 3rem 2.5rem;
  color: #333;
}

.appointment-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 2rem 0;
}

.appointment-details {
  margin-bottom: 2rem;
}

.info-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #333;
}

.info-text strong {
  color: #333;
  font-weight: 600;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.75rem 0;
}

.services-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.services-list li {
  padding: 0.25rem 0;
  color: #333;
  font-size: 0.95rem;
}

.hours-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hour-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.day {
  font-weight: 500;
  color: #333;
}

.time {
  color: #333;
}

.info-section address {
  font-style: normal;
  line-height: 1.6;
  color: #333;
  font-size: 0.95rem;
}

.notes-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notes-card h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.notes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notes-list li {
  padding: 0.5rem 0;
  color: #333;
  font-size: 0.9rem;
  border-bottom: 1px solid #f0f0f0;
}

.notes-list li:last-child {
  border-bottom: none;
}

/* Right Side - Appointment Form */
.appointment-form-section {
  background: #e8d5e8;
  padding: 3rem 2.5rem;
  color: #333;
  overflow-y: auto;
  max-height: 100vh;
}

.appointment-form {
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row .form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.875rem 1rem;
  border: 2px solid #d1c4d1;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background: white;
  color: #333;
  font-family: Arial, sans-serif;
  font-weight: normal;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8b7ba8;
  box-shadow: 0 0 0 3px rgba(139, 123, 168, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-select:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  margin-bottom: 0 !important;
}

.form-checkbox {
  width: auto !important;
  margin: 0;
  cursor: pointer;
}

.checkbox-text {
  color: #333;
  font-size: 0.95rem;
}

.submit-button {
  width: 100%;
  background: linear-gradient(135deg, #6b4c94, #5d4e75);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #5d4e75, #4a4a4a);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(107, 76, 148, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Responsive Design */
@media (max-width: 968px) {
  .appointment-container {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .appointment-info,
  .appointment-form-section {
    padding: 2rem;
  }

  .appointment-title {
    font-size: 2rem;
  }

  .appointment-form-section {
    max-height: none;
    overflow-y: visible;
  }
}

@media (max-width: 768px) {
  .appointment-page {
    padding: 1rem;
  }

  .appointment-info,
  .appointment-form-section {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .form-row .form-group {
    margin-bottom: 1.5rem;
  }

  .form-row .form-group:last-child {
    margin-bottom: 0;
  }

  .appointment-title {
    text-align: center;
  }

  .hour-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .appointment-info,
  .appointment-form-section {
    padding: 1rem;
  }

  .appointment-title {
    font-size: 1.75rem;
  }
}
</style>
