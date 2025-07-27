# HarmoNest Health Platform

A community-focused health services web app built with **Vue 3**, designed to provide easy appointment booking, user feedback ratings, and admin insights.

## 🌟 Features

- 🏠 Home page with welcome message and featured services
- 👩‍⚕️ Appointment booking for various healthcare services
- 📊 Service rating system (stored and viewable by admins)
- 🔒 Login/Register with basic role-based access (user/admin)
- 🧑‍💻 Admin Dashboard to manage ratings and view feedback
- 📞 Contact page for user inquiries

## 📁 Project Structure

src/
├── assets/ # Static files (images, stylesheets)
├── components/ # Reusable Vue components
├── router/ # Vue Router setup
├── store/ # (Reserved for Vuex if needed)
├── utils/ # Helper JS files for users, ratings, etc.
├── views/ # Page-level Vue components
└── App.vue # Root component

markdown
Copy
Edit

### Key Files

- `views/Services.vue` – Renders all services with ratings and links to rating form  
- `views/Rating.vue` – User form to rate a service  
- `views/AdminDashboard.vue` – Admin view to check stored ratings  
- `utils/ratings.js` – Local storage helper for saving and retrieving rating data  
- `views/Login.vue`, `Register.vue` – Role-based login system

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 14
- Vue CLI

### Installation

```bash
npm install
npm run dev
Then open: http://localhost:5173

🔐 Roles & Access
Role	Access Features
user	Book appointment, Rate service
admin	View ratings dashboard

Admin credentials are hardcoded in Login.vue (e.g., admin@example.com / password: admin123)

🗃️ Storage
All rating and login data are stored in localStorage for simplicity in this demo.

📷 Screenshots
You can add screenshots of Services.vue and AdminDashboard.vue here to showcase features.

📌 Future Improvements
Persistent database integration (e.g., Firebase / MongoDB)

Email notifications for appointments

Rating charts for admin analytics