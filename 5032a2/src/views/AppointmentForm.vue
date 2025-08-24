<template>
  <form @submit.prevent="handleSubmit" class="appointment-form">
    <!-- Basic info -->
    <div class="form-row">
      <div class="form-group">
        <label>Date *</label>
        <input
          type="date"
          v-model="form.date"
          required
          class="form-input"
          :min="minDate"
        />
      </div>

      <div class="form-group">
        <label>Time *</label>
        <select v-model="form.time" required class="form-input">
          <option value="">Select time</option>
          <option v-for="slot in availableTimeSlots" :key="slot" :value="slot">
            {{ convertTo12Hour(slot) }}
          </option>
        </select>
      </div>
    </div>

    <!-- Service type and doctor -->
    <div class="form-row">
      <div class="form-group">
        <label>Service *</label>
        <select v-model="form.service" required class="form-input">
          <option value="">Select service</option>
          <option value="gp">General Practice</option>
          <option value="specialist">Specialist</option>
          <option value="mental">Mental Health</option>
          <option value="checkup">Health Check-up</option>
        </select>
      </div>

      <div class="form-group">
        <label>Doctor</label>
        <select v-model="form.doctorId" class="form-input">
          <option value="">Any available doctor</option>
          <option v-for="doctor in availableDoctors" :key="doctor.id" :value="doctor.id">
            {{ doctor.name }} - {{ doctor.specialty }}
          </option>
        </select>
      </div>
    </div>

    <!-- Patient info -->
    <div class="form-row">
      <div class="form-group">
        <label>First Name *</label>
        <input type="text" v-model="form.firstName" required class="form-input" />
      </div>

      <div class="form-group">
        <label>Last Name *</label>
        <input type="text" v-model="form.lastName" required class="form-input" />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Email *</label>
        <input type="email" v-model="form.email" required class="form-input" />
      </div>

      <div class="form-group">
        <label>Phone *</label>
        <input type="tel" v-model="form.phone" required class="form-input" />
      </div>
    </div>

    <!-- Reason for visit -->
    <div class="form-group">
      <label>Reason for Visit *</label>
      <textarea v-model="form.reason" required class="form-textarea" rows="3"></textarea>
    </div>

    <!-- Buttons -->
    <div class="form-actions">
      <button type="button" @click="$emit('cancel')" class="btn-cancel">
        Cancel
      </button>
      <button type="submit" class="btn-save" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : (appointment ? 'Update' : 'Book') }} Appointment
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  appointment: Object,
  selectedDate: String,
  selectedTime: String
})

const emit = defineEmits(['save', 'cancel'])

const isSubmitting = ref(false)

// Form data
const form = ref({
  date: '',
  time: '',
  service: '',
  doctorId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  reason: ''
})

// Available time slots
const availableTimeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
]

// Doctor data
const doctorsDatabase = {
  gp: [
    { id: 'dr1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
    { id: 'dr2', name: 'Dr. Michael Chen', specialty: 'General Practice' },
  ],
  specialist: [
    { id: 'dr4', name: 'Dr. James Wilson', specialty: 'Cardiology' },
    { id: 'dr5', name: 'Dr. Lisa Brown', specialty: 'Dermatology' },
  ],
  mental: [
    { id: 'dr7', name: 'Dr. Anna Taylor', specialty: 'Clinical Psychology' },
  ],
  checkup: [
    { id: 'dr1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
  ]
}

// Computed properties
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const availableDoctors = computed(() => {
  return form.value.service ? doctorsDatabase[form.value.service] || [] : []
})

// Time conversion
const convertTo12Hour = (time24) => {
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

// Handle submit
const handleSubmit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  try {
    emit('save', { ...form.value })
  } finally {
    isSubmitting.value = false
  }
}

// Initialize form
const initializeForm = () => {
  if (props.appointment) {
    // Edit mode
    Object.assign(form.value, props.appointment)
  } else {
    // New mode
    form.value.date = props.selectedDate || ''
    form.value.time = props.selectedTime || ''
  }
}

watch(() => props.appointment, initializeForm, { immediate: true })
watch(() => [props.selectedDate, props.selectedTime], initializeForm)

onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
.appointment-form {
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn-cancel,
.btn-save {
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

.btn-save {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
