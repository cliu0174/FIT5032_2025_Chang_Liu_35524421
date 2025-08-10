<template>
    <div v-if="apiResponse" class="api-response">
      <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const authors = ref([])
const loading = ref(false)
const error = ref(null)
const apiResponse = ref(null)

const authorsCount = ref(0)
const totalBooks = ref(0)

const calculateStats = () => {
  authorsCount.value = authors.value.length
  totalBooks.value = authors.value.reduce((total, author) => {
    return total + author.famousWorks.length
  }, 0)
}

const getAllBooks = () => {
  const allBooks = []
  
  authors.value.forEach(author => {
    author.famousWorks.forEach(book => {
      allBooks.push({
        title: book,
        author: author.name,
        authorNationality: author.nationality || 'Unknown',
        authorBirthYear: author.birthYear || 'Unknown'
      })
    })
  })
  
  return allBooks
}

const getApiData = async () => {
    loading.value = true
  error.value = null
  
  try {
    const response = await fetch('src/assets/json/authors.json')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    authors.value = data
    
    calculateStats()
    
  } catch (err) {
    error.value = `Error loading authors data: ${err.message}`
    console.error('Error loading authors data:', err)
  } finally {
    loading.value = false
  };

  // all detailed information
  apiResponse.value = {
    success: true,
    data: {
      authorsCount: authorsCount.value,
      totalBooks: totalBooks.value,
      allBooks: getAllBooks(), // books
      authors: authors.value.map(author => ({
        name: author.name,
        nationality: author.nationality || 'Unknown',
        birthYear: author.birthYear || 'Unknown',
        bookCount: author.famousWorks.length,
        famousWorks: author.famousWorks // authors
      }))
    },
    timestamp: new Date().toISOString()
  }
}

onMounted(() => {
  getApiData();
})

defineExpose({
  getApiData
})
</script>