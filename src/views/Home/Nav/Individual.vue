<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import userData from '@/resource/init.json'

// 用户信息表单
const profileForm = reactive({
  avatar: '',
  username: '',
  email: '',
  phone: '',
  bio: '',
  skills: '',
  interests: ''
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
  // 首先尝试从localStorage获取用户数据
  const storedUsers = localStorage.getItem('users')
  if (storedUsers) {
    try {
      const users = JSON.parse(storedUsers)
      return users[0] // 假设当前登录的是第一个用户
    } catch (error) {
      console.error('解析localStorage用户数据失败:', error)
    }
  }
  // 如果localStorage中没有数据，从原始JSON文件获取
  return userData.users[0]
}

// 保存用户数据到localStorage
const saveUsersToLocalStorage = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users))
  } catch (error) {
    console.error('保存用户数据到localStorage失败:', error)
  }
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
      profileForm.bio = currentUser.bio || '个人简介'
      profileForm.skills = currentUser.skills || '前端开发, Vue, JavaScript'
      profileForm.interests = currentUser.interests || '技术, 阅读, 音乐'
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

// 保存编辑（保存到localStorage）
const saveProfile = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 获取当前用户数据
    const storedUsers = localStorage.getItem('users')
    let users = []
    
    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers)
      } catch (error) {
        console.error('解析localStorage用户数据失败:', error)
        // 如果解析失败，使用原始数据
        users = [...userData.users]
      }
    } else {
      // 如果localStorage中没有数据，使用原始数据
      users = [...userData.users]
    }
    
    // 更新第一个用户的数据
    if (users.length > 0) {
      users[0] = {
        ...users[0],
        avatar: profileForm.avatar,
        username: profileForm.username,
        email: profileForm.email,
        phone: profileForm.phone,
        bio: profileForm.bio,
        skills: profileForm.skills,
        interests: profileForm.interests
      }
      
      // 保存到localStorage
      saveUsersToLocalStorage(users)
      
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
          
          <!-- 个人简介盒子 -->
          <div class="grid-item">
            <div class="item-content">
              <h3>个人简介</h3>
              <el-form-item prop="bio">
                <el-input 
                  v-model="profileForm.bio" 
                  :disabled="!isEditing"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入个人简介"
                />
              </el-form-item>
            </div>
            <div class="item-action">
              <el-button v-if="!isEditing" type="primary" size="small" @click="startEdit">修改</el-button>
            </div>
          </div>
          
          <!-- 技能标签盒子 -->
          <div class="grid-item">
            <div class="item-content">
              <h3>技能标签</h3>
              <el-form-item prop="skills">
                <el-input 
                  v-model="profileForm.skills" 
                  :disabled="!isEditing"
                  placeholder="请输入技能标签，用逗号分隔"
                />
              </el-form-item>
            </div>
            <div class="item-action">
              <el-button v-if="!isEditing" type="primary" size="small" @click="startEdit">修改</el-button>
            </div>
          </div>
          
          <!-- 兴趣爱好盒子 -->
          <div class="grid-item">
            <div class="item-content">
              <h3>兴趣爱好</h3>
              <el-form-item prop="interests">
                <el-input 
                  v-model="profileForm.interests" 
                  :disabled="!isEditing"
                  placeholder="请输入兴趣爱好，用逗号分隔"
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
  background-color: transparent;
  min-height: 100vh;
}

.individual-header {
  margin-bottom: 24px;
  text-align: center;
}

.individual-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.individual-header p {
  color: #a0aec0;
  font-size: 14px;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(20, 40, 40, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  color: white;
  border: 1px solid rgba(66, 185, 131, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
  background: rgba(30, 50, 50, 0.8);
  border: 1px solid rgba(66, 185, 131, 0.3);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.grid-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(66, 185, 131, 0.5);
}

.item-content {
  padding-right: 80px;
}

.item-content h3 {
  font-size: 16px;
  font-weight: 500;
  color: #42b983;
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
  border: 3px solid rgba(66, 185, 131, 0.3);
}

.avatar-uploader :deep(.el-upload) {
  border: 2px dashed rgba(66, 185, 131, 0.3);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload):hover {
  border-color: #42b983;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #42b983;
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
  background: linear-gradient(to right, #42b983, #2c6f5a);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(to right, #3a9d73, #255c4a);
}

:deep(.el-input__wrapper):focus-within {
  box-shadow: 0 0 0 1px #42b983 !important;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #a0aec0;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  color: #ffffff;
}

:deep(.el-input.is-disabled .el-input__wrapper),
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  background-color: rgba(255, 255, 255, 0.05);
  color: #a0aec0;
}

:deep(.el-checkbox__label) {
  color: #a0aec0;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #42b983;
  border-color: #42b983;
}
</style>