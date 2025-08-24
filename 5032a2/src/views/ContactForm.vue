<script setup>
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

const sending = ref(false)
const sentOk = ref(false)
const errorMsg = ref('')
const formRef = ref(null)
const selectedFile = ref(null)
const fileName = ref('')

// EmailJS配置
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'service_7irjryz'
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_8b27uvn'
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'szuVaNVVJR4BEJ0T7'

// 文件选择处理
function handleFileChange(event) {
  const file = event.target.files[0]
  selectedFile.value = file
  fileName.value = file ? file.name : ''

  if (file) {
    console.log('文件选择:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified)
    })

    // 检查文件大小 (EmailJS限制通常是10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Please select a file smaller than 10MB.')
      removeFile()
      return
    }
  }
}

// 方法1: 使用sendForm (推荐)
async function sendEmailWithForm() {
  console.log('使用sendForm方法发送邮件...')

  try {
    const result = await emailjs.sendForm(
      SERVICE_ID,
      TEMPLATE_ID,
      formRef.value,
      { publicKey: PUBLIC_KEY }
    )

    console.log('EmailJS sendForm 结果:', result)
    return result

  } catch (error) {
    console.error('sendForm 失败:', error)
    throw error
  }
}

// 方法2: 使用send方法 + base64编码 (备用方案)
async function sendEmailWithBase64() {
  console.log('使用send方法 + base64编码发送邮件...')

  const formData = new FormData(formRef.value)
  const templateParams = {
    user_name: formData.get('user_name'),
    user_email: formData.get('user_email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  }

  // 如果有文件，转换为base64
  if (selectedFile.value) {
    try {
      const base64 = await fileToBase64(selectedFile.value)
      templateParams.my_file = {
        name: selectedFile.value.name,
        data: base64,
        type: selectedFile.value.type
      }
      console.log('文件转换为base64成功:', {
        name: selectedFile.value.name,
        size: selectedFile.value.size,
        base64Length: base64.length
      })
    } catch (error) {
      console.error('文件转换base64失败:', error)
      throw new Error('Failed to process file attachment')
    }
  }

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      { publicKey: PUBLIC_KEY }
    )

    console.log('EmailJS send 结果:', result)
    return result

  } catch (error) {
    console.error('send 失败:', error)
    throw error
  }
}

// 文件转base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // 移除data:url前缀，只保留base64数据
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

// 主发送函数
async function sendEmail() {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    alert('EmailJS 配置缺失，请检查 .env')
    return
  }

  sending.value = true
  sentOk.value = false
  errorMsg.value = ''

  try {
    console.log('=== 开始发送邮件 ===')
    console.log('EmailJS配置:', { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY: PUBLIC_KEY.substring(0, 8) + '...' })
    console.log('表单数据:', {
      name: formRef.value.user_name.value,
      email: formRef.value.user_email.value,
      subject: formRef.value.subject.value,
      message: formRef.value.message.value.substring(0, 50) + '...',
      hasFile: !!selectedFile.value
    })

    let result

    // 尝试方法1: sendForm
    try {
      result = await sendEmailWithForm()
      console.log('✅ sendForm 方法成功')
    } catch (formError) {
      console.warn('❌ sendForm 方法失败，尝试备用方案')
      console.warn(formError)

      // 尝试方法2: send + base64
      result = await sendEmailWithBase64()
      console.log('✅ send + base64 方法成功')
    }

    console.log('=== 邮件发送成功 ===')
    console.log('结果:', result)

    sentOk.value = true

    // 清空表单
    formRef.value.reset()
    selectedFile.value = null
    fileName.value = ''

  } catch (error) {
    console.error('=== 邮件发送失败 ===')
    console.error('错误详情:', error)
    errorMsg.value = error?.text || error?.message || 'Send failed'
  } finally {
    sending.value = false
  }
}

// 移除文件
function removeFile() {
  selectedFile.value = null
  fileName.value = ''
  // 清空file input
  const fileInput = formRef.value?.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 检查是否为开发环境
const isDev = import.meta.env.DEV
</script>

<template>
  <div class="contact-container">
    <h2 class="contact-title">📧 Contact Us</h2>
    <p class="contact-subtitle">Send us a message with optional file attachment</p>

    <form ref="formRef" class="contact-form" @submit.prevent="sendEmail">

      <!-- 基本字段 -->
      <div class="form-row">
        <div class="form-group">
          <label for="user_name">Name *</label>
          <input
            id="user_name"
            name="user_name"
            placeholder="Your full name"
            required
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="user_email">Email *</label>
          <input
            id="user_email"
            name="user_email"
            type="email"
            placeholder="your.email@example.com"
            required
            class="form-control"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="subject">Subject *</label>
        <input
          id="subject"
          name="subject"
          placeholder="What is this about?"
          required
          class="form-control"
        />
      </div>

      <div class="form-group">
        <label for="message">Message *</label>
        <textarea
          id="message"
          name="message"
          placeholder="Please describe your inquiry in detail..."
          rows="6"
          required
          class="form-control"
        ></textarea>
      </div>

      <!-- 附件上传区域 -->
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
              <small>Supported: PDF, DOC, images, etc. (Max: 10MB)</small>
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
              >
                ❌
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 发送按钮 -->
      <button
        type="submit"
        class="send-button"
        :disabled="sending"
      >
        <span v-if="sending" class="button-content">
          <span class="spinner"></span>
          Sending Email...
        </span>
        <span v-else class="button-content">
          📨 Send Message
          <span v-if="selectedFile" class="attachment-indicator">+ Attachment</span>
        </span>
      </button>

      <!-- 状态消息 -->
      <div v-if="sentOk" class="status-message success">
        <div class="status-icon">✅</div>
        <div>
          <strong>Email sent successfully!</strong>
          <p v-if="selectedFile">Your file attachment ({{ fileName }}) was included.</p>
          <p v-else>Message delivered without attachments.</p>
        </div>
      </div>

      <div v-if="errorMsg" class="status-message error">
        <div class="status-icon">❌</div>
        <div>
          <strong>Sending failed</strong>
          <p>{{ errorMsg }}</p>
        </div>
      </div>

      <!-- 调试信息 (开发环境) -->
      <div v-if="isDev" class="debug-info">
        <details>
          <summary>🔧 Debug Info</summary>
          <pre>{{ {
            SERVICE_ID,
            TEMPLATE_ID,
            PUBLIC_KEY: PUBLIC_KEY.substring(0, 8) + '...',
            hasFile: !!selectedFile,
            fileName: fileName,
            fileSize: selectedFile?.size
          } }}</pre>
        </details>
      </div>
    </form>
  </div>
</template>

<style scoped>
.contact-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.contact-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
}

.contact-subtitle {
  text-align: center;
  color: #6c757d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.contact-form {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.form-control::placeholder {
  color: #adb5bd;
}

/* 文件上传样式 */
.file-upload-area {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-upload-display {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  background: #fafafa;
}

.file-upload-display:hover {
  border-color: #007bff;
  background: #f0f8ff;
}

.file-upload-placeholder {
  text-align: center;
  color: #6c757d;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.file-upload-placeholder p {
  margin: 0.5rem 0;
  font-weight: 500;
}

.file-upload-placeholder small {
  font-size: 0.8rem;
  color: #adb5bd;
}

.file-selected {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #e8f5e8;
  border-radius: 6px;
  padding: 1rem;
  border: 1px solid #d4edda;
}

.file-icon {
  font-size: 1.5rem;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.file-size {
  color: #6c757d;
  font-size: 0.85rem;
}

.remove-file-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.remove-file-btn:hover {
  opacity: 1;
}

/* 发送按钮 */
.send-button {
  width: 100%;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.send-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838, #1ea085);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40,167,69,0.3);
}

.send-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.attachment-indicator {
  background: rgba(255,255,255,0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

/* 加载动画 */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 状态消息 */
.status-message {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.status-message.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.status-message.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.status-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.status-message strong {
  display: block;
  margin-bottom: 0.25rem;
}

.status-message p {
  margin: 0;
  font-size: 0.9rem;
}

/* 调试信息 */
.debug-info {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.debug-info summary {
  cursor: pointer;
  font-weight: 600;
  color: #6c757d;
}

.debug-info pre {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.8rem;
  overflow-x: auto;
}

/* 响应式 */
@media (max-width: 768px) {
  .contact-container {
    margin: 1rem auto;
  }

  .contact-form {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .contact-title {
    font-size: 1.5rem;
  }

  .file-upload-display {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .contact-form {
    padding: 1rem;
  }

  .upload-icon {
    font-size: 1.5rem;
  }

  .send-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
