<template>
  <div class="contact-page">
    <div class="contact-container">
      <!-- Left Side - Contact Info -->
      <div class="contact-info">
        <h1 class="contact-title">Contact</h1>

        <div class="contact-details">
          <p class="phone-text">
            For any questions please call <strong>(03) 9827 5500</strong> or fill out our form
          </p>

          <div class="address-section">
            <h3>Postal Address:</h3>
            <address>
              PO Box 520<br>
              South Yarra VIC 3141<br>
              Melbourne, Australia
            </address>
          </div>

          <!-- Social Media Icons -->
          <div class="social-media">
            <a href="#" class="social-link youtube" aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            <a href="#" class="social-link instagram" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            <a href="#" class="social-link facebook" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            <a href="#" class="social-link twitter" aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>

            <a href="#" class="social-link linkedin" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Map Section -->
        <div class="map-container" v-if="showMap">
          <div class="map-placeholder">
            <div class="map-header">
              <h4>Healthcare Center Location</h4>
              <button class="map-close" @click="showMap = !showMap" aria-label="toggle map">×</button>
            </div>
            <div class="map-content">
              <div class="location-marker">
                <div class="marker-pin"></div>
                <div class="marker-pulse"></div>
              </div>
              <p class="map-address">South Yarra Medical Center<br>South Yarra VIC 3141</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Contact Form -->
      <div class="contact-form-section">
        <form
          ref="formRef"
          @submit.prevent="sendEmail"
          class="contact-form"
          enctype="multipart/form-data"
          aria-describedby="status-msg"
        >
          <div class="form-row">
            <div class="form-group">
              <label for="user_name">Name *</label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                required
                class="form-input"
                placeholder="Your full name"
                aria-required="true"
              />
            </div>

            <div class="form-group">
              <label for="user_email">Email *</label>
              <input
                id="user_email"
                name="user_email"
                type="email"
                required
                class="form-input"
                placeholder="your.email@example.com"
                aria-required="true"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="subject">Subject *</label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              class="form-input"
              placeholder="What is this about?"
              aria-required="true"
            />
          </div>

          <div class="form-group">
            <label for="message">Message *</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              class="form-textarea"
              placeholder="Please describe your inquiry in detail..."
              required
              aria-required="true"
            ></textarea>
          </div>

          <!-- File Upload Section (optional) -->
          <div class="form-group">
            <label for="my_file">Attachment (Optional)</label>

            <div class="file-upload-area">
              <input
                id="my_file"
                type="file"
                name="my_file"
                class="file-input"
                @change="handleFileChange"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.xlsx,.pptx"
              />

              <div class="file-upload-display">
                <div v-if="!selectedFile" class="file-upload-placeholder">
                  <div class="upload-icon">📎</div>
                  <p>Click to select a file or drag and drop</p>
                  <small>Supported: PDF, DOC, images, etc. (Max: 2.5MB)</small>
                </div>

                <div v-else class="file-selected">
                  <div class="file-icon">📄</div>
                  <div class="file-info">
                    <div class="file-name">{{ fileName }}</div>
                    <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
                  </div>
                  <button
                    type="button"
                    class="remove-file-btn"
                    @click="removeFile"
                    title="Remove file"
                    aria-label="Remove attachment"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="button-content">
              <span class="spinner"></span>
              Sending...
            </span>
            <span v-else class="button-content">
              Send Message
              <span v-if="selectedFile" class="attachment-indicator">+ Attachment</span>
            </span>
          </button>

          <!-- Status Messages -->
          <div id="status-msg" class="sr-only" aria-live="polite"></div>

          <div v-if="sentOk" class="status-message success" role="status" aria-live="polite">
            <div class="status-icon">✅</div>
            <div>
              <strong>Email sent successfully!</strong>
              <p v-if="selectedFile">Your file ({{ fileName }}) may be included subject to size limits.</p>
              <p v-else>Message delivered successfully.</p>
            </div>
          </div>

          <div v-if="errorMsg" class="status-message error" role="alert" aria-live="assertive">
            <div class="status-icon">❌</div>
            <div>
              <strong>Sending failed</strong>
              <p>{{ errorMsg }}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

// EmailJS配置（优先 .env）
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'service_7irjryz'
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_8b27uvn'
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'szuVaNVVJR4BEJ0T7'

// 状态
const showMap = ref(true)
const isSubmitting = ref(false)
const sentOk = ref(false)
const errorMsg = ref('')
const formRef = ref(null)
const selectedFile = ref(null)
const fileName = ref('')

// 文件处理（限制 2.5MB，符合 EmailJS 免费版常见限制）
function handleFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) {
    selectedFile.value = null
    fileName.value = ''
    return
  }
  // 2.5MB 限制，超限直接清除
  const MAX = 2.5 * 1024 * 1024
  if (file.size > MAX) {
    alert('File is larger than 2.5MB. Please choose a smaller file.')
    e.target.value = ''
    selectedFile.value = null
    fileName.value = ''
    return
  }
  selectedFile.value = file
  fileName.value = file.name
}

function removeFile() {
  selectedFile.value = null
  fileName.value = ''
  const fileInput = formRef.value?.querySelector('#my_file')
  if (fileInput) fileInput.value = ''
}

function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 发送（仅使用 sendForm，简单可靠）
async function sendEmail() {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    alert('EmailJS configuration missing, please check .env')
    return
  }

  isSubmitting.value = true
  sentOk.value = false
  errorMsg.value = ''

  try {
    const res = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.value, { publicKey: PUBLIC_KEY })
    console.log('EmailJS sendForm result:', res)
    sentOk.value = true

    // 重置
    formRef.value?.reset()
    selectedFile.value = null
    fileName.value = ''
  } catch (e) {
    console.error('Email sending failed:', e)
    errorMsg.value = e?.text || e?.message || 'Send failed'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* 屏幕阅读器专用隐藏（但可被读） */
.sr-only {
  position: absolute !important; height: 1px; width: 1px;
  overflow: hidden; clip: rect(1px,1px,1px,1px); white-space: nowrap;
}

/* ======= 以下全部保持你原有样式（仅略微调整几处文案） ======= */
.contact-page {
  min-height: 100vh;
  background: white;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-container {
  max-width: 1000px;
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

.contact-info {
  background: #e8d5e8;
  padding: 3rem 2.5rem;
  color: #333;
}

.contact-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 2rem 0;
}

.contact-details { margin-bottom: 2rem; }
.phone-text { font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem; color: #333; }
.phone-text strong { color: #333; font-weight: 600; }
.address-section { margin-bottom: 2rem; }
.address-section h3 { font-size: 1.2rem; font-weight: 600; color: #333; margin: 0 0 0.5rem 0; }
.address-section address { font-style: normal; line-height: 1.6; color: #333; }

.social-media { display: flex; gap: 1rem; margin-bottom: 2rem; }
.social-link { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.3s ease; text-decoration: none; }
.social-link.youtube { background: #ff0000; color: white; }
.social-link.instagram { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: white; }
.social-link.facebook { background: #1877f2; color: white; }
.social-link.twitter { background: #1da1f2; color: white; }
.social-link.linkedin { background: #0077b5; color: white; }
.social-link:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); }

.map-container { margin-top: 1rem; }
.map-placeholder { background: white; border-radius: 12px; padding: 1.5rem; min-height: 200px; position: relative; border: 1px solid rgba(93, 78, 117, 0.2); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
.map-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid rgba(93, 78, 117, 0.2); padding-bottom: 0.5rem; }
.map-header h4 { margin: 0; color: #333; font-size: 1.1rem; font-weight: 600; }
.map-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
.map-content { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 120px; }
.location-marker { position: relative; margin-bottom: 1rem; }
.marker-pin { width: 20px; height: 20px; background: #dc3545; border-radius: 50%; position: relative; z-index: 2; }
.marker-pin::before { content: ''; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 15px solid #dc3545; }
.marker-pulse { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: rgba(220, 53, 69, 0.3); border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; } }
.map-address { color: #333; font-size: 0.9rem; line-height: 1.4; margin: 0; font-weight: normal; }

.contact-form-section { background: #e8d5e8; padding: 3rem 2.5rem; color: #333; }
.contact-form { width: 100%; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1.5rem; }
.form-row .form-group { margin-bottom: 0; }
.form-group label { display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500; font-size: 0.9rem; }

.form-input, .form-textarea {
  width: 100%; box-sizing: border-box; padding: 0.875rem 1rem; border: 2px solid #e1d5e1; border-radius: 8px;
  font-size: 1rem; transition: border-color 0.3s ease, box-shadow 0.3s ease; background: white; color: #333; font-family: Arial, sans-serif; font-weight: normal;
}
.form-input:focus, .form-textarea:focus { outline: none; border-color: #8b7ba8; box-shadow: 0 0 0 3px rgba(139, 123, 168, 0.1); }
.form-textarea { resize: vertical; min-height: 120px; font-family: inherit; }

/* 文件上传 */
.file-upload-area { position: relative; }
.file-input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; }
.file-upload-display { border: 2px dashed #e1d5e1; border-radius: 8px; padding: 1.5rem; transition: all 0.3s ease; background: #fafafa; }
.file-upload-display:hover { border-color: #8b7ba8; background: #f5f2f5; }
.file-upload-placeholder { text-align: center; color: #6c757d; }
.upload-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.file-upload-placeholder p { margin: 0.5rem 0; font-weight: 500; }
.file-upload-placeholder small { font-size: 0.8rem; color: #adb5bd; }

.file-selected { display: flex; align-items: center; gap: 1rem; background: #e8f5e8; border-radius: 6px; padding: 1rem; border: 1px solid #d4edda; }
.file-icon { font-size: 1.5rem; }
.file-info { flex: 1; }
.file-name { font-weight: 600; color: #2c3e50; margin-bottom: 0.25rem; }
.file-size { color: #6c757d; font-size: 0.85rem; }
.remove-file-btn { background: none; border: none; cursor: pointer; font-size: 1.2rem; opacity: 0.7; transition: opacity 0.2s; }
.remove-file-btn:hover { opacity: 1; }

/* 提交按钮 */
.submit-button {
  width: 100%; background: linear-gradient(135deg, #28a745, #20c997); color: white; border: none;
  padding: 1rem 2rem; font-size: 1.1rem; font-weight: 600; border-radius: 8px; cursor: pointer;
  transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;
}
.submit-button:hover:not(:disabled) { background: linear-gradient(135deg, #218838, #1ea085); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3); }
.submit-button:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
.button-content { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.attachment-indicator { background: rgba(255, 255, 255, 0.2); padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; }

/* 加载动画 */
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* 状态消息 */
.status-message { display: flex; align-items: flex-start; gap: 1rem; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
.status-message.success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
.status-message.error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
.status-icon { font-size: 1.2rem; flex-shrink: 0; }
.status-message strong { display: block; margin-bottom: 0.25rem; }
.status-message p { margin: 0; font-size: 0.9rem; }

/* 响应式 */
@media (max-width: 968px) {
  .contact-container { grid-template-columns: 1fr; gap: 0; }
  .contact-info, .contact-form-section { padding: 2rem; }
  .contact-title { font-size: 2rem; }
}
@media (max-width: 768px) {
  .contact-page { padding: 1rem; }
  .contact-info, .contact-form-section { padding: 1.5rem; }
  .form-row { grid-template-columns: 1fr; gap: 0; }
  .form-row .form-group { margin-bottom: 1.5rem; }
  .form-row .form-group:last-child { margin-bottom: 0; }
  .social-media { justify-content: center; }
  .contact-title { text-align: center; }
  .file-upload-display { padding: 1rem; }
}
@media (max-width: 480px) {
  .contact-info, .contact-form-section { padding: 1rem; }
  .social-link { width: 35px; height: 35px; }
  .submit-button { padding: 0.875rem 1.5rem; font-size: 1rem; }
  .upload-icon { font-size: 1.5rem; }
}
</style>
