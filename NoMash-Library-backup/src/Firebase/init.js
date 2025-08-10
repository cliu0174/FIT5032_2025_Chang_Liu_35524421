// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyF5NRUHqB_wdyJZbh8eq4-OkOeCV5H6M",
  authDomain: "cliu0174-57e84.firebaseapp.com",
  projectId: "cliu0174-57e84",
  storageBucket: "cliu0174-57e84.firebasestorage.app",
  messagingSenderId: "748087094817",
  appId: "1:748087094817:web:a1195cf2a121a61728bd60"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore()
export default db