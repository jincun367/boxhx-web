// src/api/auth.js

// 模拟用户数据库
const mockUsers = [
  {
    username: 'admin',
    password: '123456',
    email: 'admin@example.com',
    token: 'mock-jwt-token-admin'
  }
]

// 模拟登录 API
export const loginApi = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === data.username && u.password === data.password)
      
      if (user) {
        resolve({
          success: true,
          data: {
            token: user.token,
            username: user.username
          }
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 1000) // 模拟 1 秒网络延迟
  })
}

// 模拟注册 API
export const registerApi = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userExists = mockUsers.some(u => u.username === data.username || u.email === data.email)
      
      if (userExists) {
        reject(new Error('用户名或邮箱已存在'))
      } else {
        // 模拟注册成功，添加到“数据库”
        mockUsers.push({
          username: data.username,
          password: data.password,
          email: data.email,
          token: `mock-jwt-token-${data.username}`
        })
        
        resolve({
          success: true,
          message: '注册成功'
        })
      }
    }, 1000) // 模拟 1 秒网络延迟
  })
}
<!-- src/views/Login/login.vue -->
<template>
  <div class="auth-container">
    <div class="auth-wrapper" :class="{ 'show-register': showRegister }">
      <!-- 登录表单 -->
      <div class="auth-panel login-panel">
        <div class="welcome-section">
          <h1 class="welcome-title">欢迎回来</h1>
          <p class="welcome-subtitle">一站式学习平台，让知识触手可及</p>
          <p class="welcome-desc">我们提供丰富的学习资源和智能推荐系统，帮助您高效学习。</p>
          <div class="welcome-buttons">
            <el-button type="default" size="large" @click="switchToRegister">前往注册</el-button>
          </div>
        </div>
        <div class="form-section">
          <div class="form-wrapper">
            <h2 class="form-title">用户登录</h2>
            <el-form 
              :model="loginForm" 
              :rules="loginRules" 
              ref="loginFormRef"
              class="auth-form"
            >
              <el-form-item prop="username">
                <el-input 
                  v-model="loginForm.username" 
                  prefix-icon="User" 
                  placeholder="请输入用户名"
                  size="large"
                />
              </el-form-item>
              
              <el-form-item prop="password">
                <el-input 
                  v-model="loginForm.password" 
                  type="password" 
                  prefix-icon="Lock" 
                  placeholder="请输入密码"
                  show-password
                  size="large"
                />
              </el-form-item>
              
              <el-form-item>
                <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="primary" 
                  size="large" 
                  @click="handleLogin" 
                  :loading="loading"
                  class="auth-button"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
            
            <div class="form-footer">
              <span>还没有账号？</span>
              <el-button type="text" @click="switchToRegister">立即注册</el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 注册表单 -->
      <div class="auth-panel register-panel">
        <div class="welcome-section">
          <h1 class="welcome-title">加入我们</h1>
          <p class="welcome-subtitle">创建账户，开启智慧学习之旅</p>
          <p class="welcome-desc">注册即享丰富学习资源，个性化学习路径，让进步看得见。</p>
          <div class="welcome-buttons">
            <el-button type="default" size="large" @click="switchToLogin">前往登录</el-button>
          </div>
        </div>
        <div class="form-section">
          <div class="form-wrapper">
            <h2 class="form-title">用户注册</h2>
            <el-form 
              :model="registerForm" 
              :rules="registerRules" 
              ref="registerFormRef"
              class="auth-form"
            >
              <el-form-item prop="username">
                <el-input 
                  v-model="registerForm.username" 
                  prefix-icon="User" 
                  placeholder="请输入用户名"
                  size="large"
                />
              </el-form-item>
              
              <el-form-item prop="email">
                <el-input 
                  v-model="registerForm.email" 
                  prefix-icon="Message" 
                  placeholder="请输入邮箱地址"
                  size="large"
                />
              </el-form-item>
              
              <el-form-item prop="password">
                <el-input 
                  v-model="registerForm.password" 
                  type="password" 
                  prefix-icon="Lock" 
                  placeholder="请输入密码"
                  show-password
                  size="large"
                />
              </el-form-item>
              
              <el-form-item prop="confirmPassword">
                <el-input 
                  v-model="registerForm.confirmPassword" 
                  type="password" 
                  prefix-icon="Lock" 
                  placeholder="请确认密码"
                  show-password
                  size="large"
                />
              </el-form-item>
              
              <el-form-item>
                <el-checkbox v-model="acceptTerms">我接受用户协议和隐私政策</el-checkbox>
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="primary" 
                  size="large" 
                  @click="handleRegister" 
                  :loading="loading"
                  class="auth-button"
                >
                  注册
                </el-button>
              </el-form-item>
            </el-form>
            
            <div class="form-footer">
              <span>已有账号？</span>
              <el-button type="text" @click="switchToLogin">立即登录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginApi, registerApi } from '@/api/auth.js'

const router = useRouter()
const showRegister = ref(false)
const loading = ref(false)
const rememberMe = ref(false)
const acceptTerms = ref(false)

const loginFormRef = ref()
const registerFormRef = ref()

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度应在3-15个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度应在3-15个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const switchToRegister = () => {
  showRegister.value = true
}

const switchToLogin = () => {
  showRegister.value = false
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  const valid = await loginFormRef.value.validate().catch(() => {})
  if (!valid) return
  
  loading.value = true
  
  try {
    const response = await loginApi(loginForm)
    if (response.success) {
      // 存储token到localStorage
      const token = response.data.token
      if (rememberMe.value) {
        localStorage.setItem('token', token)
      } else {
        sessionStorage.setItem('token', token)
      }
      
      ElMessage.success('登录成功')
      // 登录成功后跳转到首页
      router.push('/')
    }
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  const valid = await registerFormRef.value.validate().catch(() => {})
  if (!valid) return
  
  if (!acceptTerms.value) {
    ElMessage.warning('请先接受用户协议和隐私政策')
    return
  }
  
  loading.value = true
  
  try {
    const response = await registerApi(registerForm)
    if (response.success) {
      ElMessage.success('注册成功')
      // 注册成功后自动跳转到登录界面
      showRegister.value = false
    }
  } catch (error) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  position: relative;
}

.auth-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/back.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  opacity: 0.5;
}

.auth-wrapper {
  position: relative;
  width: 800px;
  height: 500px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.auth-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.6s ease-in-out;
}

.login-panel {
  z-index: 2;
}

.register-panel {
  z-index: 1;
  transform: translateX(100%);
}

.auth-wrapper.show-register .login-panel {
  transform: translateX(-100%);
}

.auth-wrapper.show-register .register-panel {
  transform: translateX(0);
}

.welcome-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: linear-gradient(to bottom right, #667eea, #764ba2);
  color: white;
  text-align: center;
}

.welcome-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.welcome-subtitle {
  font-size: 16px;
  margin-bottom: 12px;
  opacity: 0.9;
}

.welcome-desc {
  font-size: 13px;
  max-width: 300px;
  line-height: 1.5;
  opacity: 0.8;
  margin-bottom: 25px;
}

.welcome-buttons .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
}

.welcome-buttons .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
}

.form-wrapper {
  width: 100%;
  max-width: 350px;
}

.form-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  color: white;
}

.auth-form {
  width: 100%;
}

.auth-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background: linear-gradient(to right, #42b983, #2c6f5a);
  border: none;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #ccc;
}

.form-footer .el-button {
  font-size: 14px;
  color: #42b983;
  vertical-align: baseline;
}

:deep(.el-input__wrapper) {
  padding: 0 15px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-input__wrapper):hover {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.15);
}

:deep(.el-input__wrapper):focus-within {
  box-shadow: 0 0 0 1px #42b983 !important;
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-input__inner) {
  color: white;
}

:deep(.el-checkbox__label) {
  color: #ccc;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #42b983;
  border-color: #42b983;
}
</style>