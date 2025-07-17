<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">User Information Form</h2>

    <form @submit.prevent="submitForm">
      <div class="row mb-3">
        <div class="col-md-6">
          <label for="username" class="form-label">Username</label>
          <InputText id="username" v-model="formData.username" class="form-control" />
        </div>
        <div class="col-md-6">
          <label for="password" class="form-label">Password</label>
          <InputText
            id="password"
            type="password"
            v-model="formData.password"
            class="form-control"
          />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <div class="form-check mt-4">
            <input
              type="checkbox"
              class="form-check-input"
              id="isAustralian"
              v-model="formData.isAustralian"
            />
            <label class="form-check-label" for="isAustralian">Australian Resident?</label>
          </div>
        </div>
        <div class="col-md-6">
          <label for="gender" class="form-label">Gender</label>
          <Dropdown
            v-model="formData.gender"
            :options="genderOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Gender"
            class="form-select"
            inputId="gender"
          />
        </div>
      </div>

      <div class="mb-3">
        <label for="reason" class="form-label">Reason for joining</label>
        <Textarea id="reason" v-model="formData.reason" class="form-control" rows="3" />
      </div>

      <div class="text-center">
        <Button label="Submit" class="btn btn-primary me-2" type="submit" />
        <Button label="Clear" class="btn btn-secondary" @click="clearForm" />
      </div>
    </form>

    <div class="mt-5">
      <DataTable :value="submittedCards" stripedRows tableStyle="min-width: 50rem">
        <Column field="username" header="Username" />
        <Column field="password" header="Password" />
        <Column field="isAustralian" header="Australian Resident" />
        <Column field="gender" header="Gender" />
        <Column field="reason" header="Reason" />
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  isAustralian: false,
  gender: '',
  reason: '',
})

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

const submittedCards = ref([])

const submitForm = () => {
  submittedCards.value.push({ ...formData.value })
  clearForm()
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    isAustralian: false,
    gender: '',
    reason: '',
  }
}
</script>
