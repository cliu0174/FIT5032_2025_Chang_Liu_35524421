<template>
  <footer class="footer bg-dark text-light py-4 mt-auto">
    <div class="container">
      <div class="row">
        <!-- Brand -->
        <div class="col-md-4 mb-3">
          <h5><i class="fas fa-heart me-2"></i>Migrant Health Support</h5>
          <p class="small">
            Dedicated to providing essential health services and support
            to migrant communities building new lives.
          </p>
          <div class="social-links">
            <a href="#" class="text-light me-3" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="text-light me-3" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" class="text-light me-3" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-md-4 mb-3">
          <h6>Quick Links</h6>
          <ul class="list-unstyled">
            <li><router-link to="/" class="text-light text-decoration-none">Home</router-link></li>
            <li><router-link to="/services" class="text-light text-decoration-none">Services</router-link></li>
            <li><a href="#" class="text-light text-decoration-none">About Us</a></li>
            <li><a href="#" class="text-light text-decoration-none">Contact</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="col-md-4 mb-3">
          <h6>Emergency Contact</h6>
          <p class="small mb-2">
            <i class="fas fa-phone me-2"></i>
            <a href="tel:+1-555-0100" class="text-light text-decoration-none">+1-555-0100</a>
          </p>
          <p class="small mb-2">
            <i class="fas fa-envelope me-2"></i>
            <a href="mailto:help@migranthealth.org" class="text-light text-decoration-none">help@migranthealth.org</a>
          </p>
        </div>
      </div>

      <hr class="my-3" />

      <div class="row align-items-center">
        <div class="col-md-6">
          <p class="small mb-0">&copy; 2024 Migrant Health Support. All rights reserved.</p>
        </div>
        <div class="col-md-6 text-md-end">
          <p class="small mb-0">
            <a href="#" class="text-light text-decoration-none me-3">Privacy Policy</a>
            <a href="#" class="text-light text-decoration-none">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  border-top: 3px solid var(--primary, #007bff);
  background-color: #1c1c1c;
}

.social-links a {
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--primary, #007bff) !important;
}

/* Responsive cleanup (可选) */
@media (max-width: 576px) {
  .text-md-end {
    text-align: center !important;
  }
}
</style>
