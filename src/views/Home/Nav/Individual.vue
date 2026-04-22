<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import userData from '@/resource/init.json'

// 用户信息表单
const profileForm = reactive({
  avatar: '',
  username: '',
  email: '',
  phone: ''
})

// 表单规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度应在3-15个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
}

// 编辑状态
const isEditing = ref(false)
const formRef = ref()

// 获取当前登录用户（简化处理，实际项目中应该根据token获取）
const getCurrentUser = () => {
  // 这里假设当前登录的是第一个用户，实际项目中应该根据token解析用户ID
  return userData.users[0]
}

// 获取用户信息
const fetchUserInfo = () => {
  try {
    const currentUser = getCurrentUser()
    if (currentUser) {
      profileForm.avatar = currentUser.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      profileForm.username = currentUser.username
      profileForm.email = currentUser.email
      profileForm.phone = currentUser.phone || ''
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 开始编辑
const startEdit = () => {
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  // 重新获取原始数据
  fetchUserInfo()
  isEditing.value = false
}

// 保存编辑（模拟保存到init.json）
const saveProfile = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 模拟保存逻辑 - 在真实项目中这里会调用API
    // 更新当前用户的模拟数据
    const currentUser = getCurrentUser()
    if (currentUser) {
      currentUser.avatar = profileForm.avatar
      currentUser.username = profileForm.username
      currentUser.email = profileForm.email
      currentUser.phone = profileForm.phone
      
      // 注意：在浏览器环境中无法真正写入文件
      // 这里只是更新内存中的数据
      ElMessage.success('个人信息更新成功')
      isEditing.value = false
    }
  } catch (error) {
    console.log('验证失败')
  }
}

// 处理头像上传
const handleAvatarUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    profileForm.avatar = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 删除头像
const removeAvatar = () => {
  ElMessageBox.confirm('确定要删除头像吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    profileForm.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    ElMessage.success('头像已重置')
  }).catch(() => {})
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <div class="individual-container">
    <div class="individual-header">
      <h2>个人资料</h2>
      <p>管理您的个人信息</p>
    </div>
    
    <el-card class="profile-card">
      <el-form 
        ref="formRef"
        :model="profileForm" 
        :rules="rules"
        class="profile-form"
      >
        <!-- 2*2 网格布局 -->
        <div class="grid-container">
          <!-- 头像盒子 -->
          <div class="grid-item">
            <div class="item-content">
              <h3>头像</h3>
              <div class="avatar-section">
                <el-upload
                  v-if="isEditing"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :on-change="handleAvatarUpload"
                  :before-upload="() => false"
                >
                  <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
                  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <img v-else-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
              </div>
              <div class="avatar-actions" v-if="isEditing">
                <el-button size="small" @click="removeAvatar">删除头像</el-button>
              </div>
            </div>
            <div class="item-action">
              <el-button v-if="!isEditing" type="primary" size="small" @click="startEdit">修改</el-button>
            </div>
          </div>
          
          <!-- 姓名盒子 -->
          <div class="grid-item">
            <div class="item-content">
              <h3>姓名</h3>
              <el-form-item prop="username">
                <el-input 
                  v-model="profileForm.username" 
                  :disabled="!isEditing"
                  placeholder="请输入姓名"
                />
              </el-form-item>
            </div>
            <div class="item-action">
              <el-button v-if="!isEditing" type="primary" size="small" @click="startEdit">修改</el-button>
            </div>
          </div>
          
          <!-- 邮箱盒子 -->
          <div class="grid-item">
            <div class="item-content">
              <h3>邮箱</h3>
              <el-form-item prop="email">
                <el-input 
                  v-model="profileForm.email" 
                  :disabled="!isEditing"
                  placeholder="请输入邮箱地址"
                />
              </el-form-item>
            </div>
            <div class="item-action">
              <el-button v-if="!isEditing" type="primary" size="small" @click="startEdit">修改</el-button>
            </div>
          </div>
          
          <!-- 手机号盒子 -->
          <div class="grid-item">
            <div class="item-content">
              <h3>手机号</h3>
              <el-form-item prop="phone">
                <el-input 
                  v-model="profileForm.phone" 
                  :disabled="!isEditing"
                  placeholder="请输入手机号"
                />
              </el-form-item>
            </div>
            <div class="item-action">
              <el-button v-if="!isEditing" type="primary" size="small" @click="startEdit">修改</el-button>
            </div>
          </div>
        </div>
      </el-form>
      
      <!-- 操作按钮 -->
      <div class="action-buttons" v-if="isEditing">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.individual-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.individual-header {
  margin-bottom: 24px;
}

.individual-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.individual-header p {
  color: #606266;
  font-size: 14px;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
}

.profile-form {
  padding: 20px 0;
}

/* 2*2 网格布局 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.grid-item {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.grid-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.item-content {
  padding-right: 80px;
}

.item-content h3 {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 16px;
}

.item-action {
  position: absolute;
  top: 20px;
  right: 20px;
}

/* 头像样式 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f2f5;
}

.avatar-uploader :deep(.el-upload) {
  border: 2px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload):hover {
  border-color: #667eea;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #909399;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar-actions {
  margin-top: 12px;
  text-align: center;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}

/* 主题色适配 */
:deep(.el-button--primary) {
  background: linear-gradient(to right, #667eea, #764ba2);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(to right, #5a6fd8, #6b4496);
}

:deep(.el-input__wrapper):focus-within {
  box-shadow: 0 0 0 1px #667eea !important;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  background-color: #fff;
}

:deep(.el-input.is-disabled .el-input__wrapper),
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  background-color: #f5f7fa;
  color: #606266;
}
</style>