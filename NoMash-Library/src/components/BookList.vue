<template>
  <div>
    <h1>All Books</h1>
    <ul>
      <li v-for="book in books" :key="book.id">
        <div v-if="editingBook === book.id" class="edit-form">
          <input v-model="editForm.name" placeholder="Book name" />
          <input v-model.number="editForm.isbn" type="number" placeholder="ISBN" />
          <button @click="updateBook(book.id)">Save</button>
          <button @click="cancelEdit">Cancel</button>
        </div>
        <div v-else class="book-item">
          <span>{{ book.name }} - ISBN: {{ book.isbn }}</span>
          <div class="book-actions">
            <button @click="startEdit(book)" class="edit-btn">Edit</button>
            <button @click="deleteBook(book.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import db from '../Firebase/init.js'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default {
  setup() {
    const books = ref([]);
    const editingBook = ref(null);
    const editForm = ref({
      name: '',
      isbn: 0
    });

    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        const booksArray = [];
        querySnapshot.forEach((doc) => {
          booksArray.push({ id: doc.id, ...doc.data() });
        });
        books.value = booksArray;
      } catch (error) {
        console.error('Error fetching books: ', error);
      }
    };

    const startEdit = (book) => {
      editingBook.value = book.id;
      editForm.value = {
        name: book.name,
        isbn: book.isbn
      };
    };

    const cancelEdit = () => {
      editingBook.value = null;
      editForm.value = {
        name: '',
        isbn: 0
      };
    };

    const updateBook = async (bookId) => {
      try {
        const bookRef = doc(db, 'books', bookId);
        await updateDoc(bookRef, {
          name: editForm.value.name,
          isbn: editForm.value.isbn
        });
        
        const bookIndex = books.value.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
          books.value[bookIndex] = {
            ...books.value[bookIndex],
            name: editForm.value.name,
            isbn: editForm.value.isbn
          };
        }
        
        cancelEdit();
        alert('Book updated successfully!');
        
        await fetchBooks();
      } catch (error) {
        console.error('Error updating book: ', error);
        alert('Error updating book');
      }
    };

    const deleteBook = async (bookId) => {
      if (confirm('Are you sure you want to delete this book?')) {
        try {
          await deleteDoc(doc(db, 'books', bookId));
          
          books.value = books.value.filter(book => book.id !== bookId);
          
          alert('Book deleted successfully!');
        } catch (error) {
          console.error('Error deleting book: ', error);
          alert('Error deleting book');
        }
      }
    };

    onMounted(() => {
      fetchBooks();
    });

    return {
      books,
      editingBook,
      editForm,
      startEdit,
      cancelEdit,
      updateBook,
      deleteBook
    };
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.book-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-actions {
  display: flex;
  gap: 10px;
}

.edit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: #c82333;
}

.edit-form {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.edit-form input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  min-width: 150px;
}

.edit-form button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.edit-form button:first-of-type {
  background-color: #28a745;
  color: white;
}

.edit-form button:first-of-type:hover {
  background-color: #218838;
}

.edit-form button:last-of-type {
  background-color: #6c757d;
  color: white;
}

.edit-form button:last-of-type:hover {
  background-color: #5a6268;
}
</style>