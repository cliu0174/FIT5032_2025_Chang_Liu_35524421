<template>
  <div class="query-demo">
    <h2>Database Query Demo</h2>
    
    <!-- Query Controls -->
    <div class="query-controls">
      <h3>Query Parameters</h3>
      
      <!-- Where Clause -->
      <div class="control-group">
        <label>Where Clause:</label>
        <select v-model="whereField">
          <option value="">No Filter</option>
          <option value="isbn">ISBN</option>
          <option value="name">Name</option>
        </select>
        
        <select v-model="whereOperator" v-if="whereField">
          <option value="==">==</option>
          <option value="!=">!=</option>
          <option value=">">></option>
          <option value=">=">>=</option>
          <option value="<"><</option>
          <option value="<="><=</option>
        </select>
        
        <input 
          v-if="whereField" 
          v-model="whereValue" 
          :type="whereField === 'isbn' ? 'number' : 'text'"
          placeholder="Value"
        />
      </div>
      
      <!-- Order By -->
      <div class="control-group">
        <label>Order By:</label>
        <select v-model="orderByField">
          <option value="">No Ordering</option>
          <option value="isbn">ISBN</option>
          <option value="name">Name</option>
        </select>
        
        <select v-model="orderByDirection" v-if="orderByField">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      
      <!-- Limit -->
      <div class="control-group">
        <label>Limit:</label>
        <input 
          type="number" 
          v-model.number="limitValue" 
          min="1" 
          max="100"
          placeholder="No limit"
        />
      </div>
      
      <button @click="executeQuery" class="query-btn">Execute Query</button>
      <button @click="clearQuery" class="clear-btn">Clear</button>
    </div>
    
    <!-- Query Result -->
    <div class="query-result">
      <h3>Query Results ({{ results.length }} books)</h3>
      
      <!-- Display Query String -->
      <div class="query-string">
        <strong>Generated Query:</strong>
        <code>{{ queryString }}</code>
      </div>
      
      <!-- Results -->
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="results.length === 0" class="no-results">No books found</div>
      <ul v-else class="results-list">
        <li v-for="book in results" :key="book.id" class="result-item">
          <span class="book-info">{{ book.name }} - ISBN: {{ book.isbn }}</span>
          <small class="book-id">ID: {{ book.id }}</small>
        </li>
      </ul>
    </div>
    
    <!-- Predefined Query Examples -->
    <div class="examples">
      <h3>Quick Examples</h3>
      <div class="example-buttons">
        <button @click="setExampleQuery1" class="example-btn">Books with ISBN > 1000</button>
        <button @click="setExampleQuery2" class="example-btn">First 3 books ordered by name</button>
        <button @click="setExampleQuery3" class="example-btn">Books with ISBN <= 1500, ordered by ISBN desc</button>
        <button @click="setExampleQuery4" class="example-btn">Last 5 books by ISBN</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import db from '../Firebase/init.js';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

export default {
  name: 'DatabaseQueryDemo',
  setup() {
    const results = ref([]);
    const loading = ref(false);
    
    // Query parameters
    const whereField = ref('');
    const whereOperator = ref('==');
    const whereValue = ref('');
    const orderByField = ref('');
    const orderByDirection = ref('asc');
    const limitValue = ref(null);
    
    const queryString = ref('collection(db, "books")');

    const executeQuery = async () => {
      loading.value = true;
      try {
        let q = collection(db, 'books');
        let queryParts = ['collection(db, "books")'];
        
        // Build query with constraints
        const constraints = [];
        
        // Add where clause
        if (whereField.value && whereValue.value !== '') {
          let value = whereField.value === 'isbn' ? Number(whereValue.value) : whereValue.value;
          constraints.push(where(whereField.value, whereOperator.value, value));
          queryParts.push(`where('${whereField.value}', '${whereOperator.value}', ${typeof value === 'string' ? `'${value}'` : value})`);
        }
        
        // Add orderBy clause
        if (orderByField.value) {
          constraints.push(orderBy(orderByField.value, orderByDirection.value));
          queryParts.push(`orderBy('${orderByField.value}', '${orderByDirection.value}')`);
        }
        
        // Add limit clause
        if (limitValue.value && limitValue.value > 0) {
          constraints.push(limit(limitValue.value));
          queryParts.push(`limit(${limitValue.value})`);
        }
        
        // Apply constraints if any
        if (constraints.length > 0) {
          q = query(q, ...constraints);
        }
        
        // Update query string display
        if (constraints.length > 0) {
          queryString.value = `query(${queryParts.join(', ')})`;
        } else {
          queryString.value = 'collection(db, "books")';
        }
        
        // Execute query
        const querySnapshot = await getDocs(q);
        const booksArray = [];
        querySnapshot.forEach((doc) => {
          booksArray.push({ id: doc.id, ...doc.data() });
        });
        
        results.value = booksArray;
      } catch (error) {
        console.error('Error executing query:', error);
        alert('Error executing query: ' + error.message);
      } finally {
        loading.value = false;
      }
    };

    const clearQuery = () => {
      whereField.value = '';
      whereOperator.value = '==';
      whereValue.value = '';
      orderByField.value = '';
      orderByDirection.value = 'asc';
      limitValue.value = null;
      results.value = [];
      queryString.value = 'collection(db, "books")';
    };

    // Example queries
    const setExampleQuery1 = () => {
      whereField.value = 'isbn';
      whereOperator.value = '>';
      whereValue.value = '1000';
      orderByField.value = '';
      limitValue.value = null;
      executeQuery();
    };

    const setExampleQuery2 = () => {
      whereField.value = '';
      whereValue.value = '';
      orderByField.value = 'name';
      orderByDirection.value = 'asc';
      limitValue.value = 3;
      executeQuery();
    };

    const setExampleQuery3 = () => {
      whereField.value = 'isbn';
      whereOperator.value = '<=';
      whereValue.value = '1500';
      orderByField.value = 'isbn';
      orderByDirection.value = 'desc';
      limitValue.value = null;
      executeQuery();
    };

    const setExampleQuery4 = () => {
      whereField.value = '';
      whereValue.value = '';
      orderByField.value = 'isbn';
      orderByDirection.value = 'desc';
      limitValue.value = 5;
      executeQuery();
    };

    // Load all books initially
    executeQuery();

    return {
      results,
      loading,
      whereField,
      whereOperator,
      whereValue,
      orderByField,
      orderByDirection,
      limitValue,
      queryString,
      executeQuery,
      clearQuery,
      setExampleQuery1,
      setExampleQuery2,
      setExampleQuery3,
      setExampleQuery4
    };
  }
};
</script>

<style scoped>
.query-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.query-controls {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.control-group label {
  min-width: 100px;
  font-weight: bold;
}

.control-group select,
.control-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.query-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.query-btn:hover {
  background-color: #0056b3;
}

.clear-btn {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn:hover {
  background-color: #5a6268;
}

.query-result {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.query-string {
  background: #f1f3f4;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-family: 'Courier New', monospace;
}

.query-string code {
  color: #d63384;
}

.loading {
  text-align: center;
  color: #6c757d;
}

.no-results {
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

.results-list {
  list-style: none;
  padding: 0;
}

.result-item {
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  margin-bottom: 8px;
  background: #f8f9fa;
}

.book-info {
  display: block;
  font-weight: bold;
}

.book-id {
  color: #6c757d;
  font-size: 0.85em;
}

.examples {
  background: #fff3cd;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ffeaa7;
}

.example-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.example-btn {
  background-color: #ffc107;
  color: #212529;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.example-btn:hover {
  background-color: #e0a800;
}

h2, h3 {
  color: #495057;
  margin-bottom: 15px;
}
</style>