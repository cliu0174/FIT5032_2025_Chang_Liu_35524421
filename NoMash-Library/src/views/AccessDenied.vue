<template>
  <div class="main-box">
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2 text-center">
          <div class="access-denied-content">
            <h1 class="display-4 text-danger mb-4">🚫 Access Denied</h1>
            
            <div class="alert alert-warning" role="alert">
              <h4 class="alert-heading">Members Only Area</h4>
              <p>
                Sorry, you need to be logged in as a library member to access this page.
                Please log in with your member credentials to continue.
              </p>
            </div>

            <div class="mt-4">
              <router-link to="/login" class="btn btn-primary btn-lg me-3">
                🔐 Login Now
              </router-link>
              <router-link to="/" class="btn btn-outline-secondary btn-lg">
                🏠 Go Home
              </router-link>
            </div>

            <div class="mt-5">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Need Help?</h5>
                  <p class="card-text">
                    If you're having trouble logging in or need to register for a library membership,
                    please contact our library staff for assistance.
                  </p>
                  <small class="text-muted">
                    Library Hours: Monday-Friday 9:00 AM - 8:00 PM
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No script needed for this component
</script>

<style scoped>
.access-denied-content {
  padding: 2rem 0;
}

.display-4 {
  font-weight: bold;
}

.alert {
  border: none;
  border-radius: 15px;
}

.btn-lg {
  border-radius: 25px;
  padding: 0.75rem 2rem;
}

.card {
  border: 1px solid #ccc;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 2rem;
}

/* 添加一些动画效果 */
.access-denied-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>