<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { removeToken } from '@/api/auth.js'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 获取导航项引用
const navItemRefs = ref([])

// 根据当前路径计算激活的索引
const activeIndex = computed(() => {
  const currentPath = route.path
  const activeItem = navItems.find(item => item.path === currentPath)
  return activeItem ? activeItem.index : '1'
})

// 导航项
const navItems = [
  { index: '1', name: '四六级', path: '/cet' },
  { index: '2', name: '考研', path: '/postgraduate' },
  { index: '3', name: 'AI工具', path: '/ai-tools' },
  { index: '4', name: '学习计划', path: '/study-plan' },
  { index: '5', name: '个人技术', path: '/personal-tech' }
]

// 下划线位置和宽度
const indicatorStyle = ref({
  left: '0px',
  width: '0px'
})

// 处理导航点击
const handleNavClick = (path) => {
  router.push(path)
}

// 更新下划线位置
const updateIndicatorPosition = () => {
  nextTick(() => {
    const activeIndexVal = activeIndex.value
    const activeItem = navItemRefs.value.find(item => item?.$el?.dataset?.index === activeIndexVal)
    
    if (activeItem && activeItem.$el) {
      const rect = activeItem.$el.getBoundingClientRect()
      const containerRect = activeItem.$el.parentElement.getBoundingClientRect()
      
      indicatorStyle.value.left = `${rect.left - containerRect.left}px`
      indicatorStyle.value.width = `${rect.width}px`
    }
  })
}

// 监听路由变化
watch(() => route.path, () => {
  updateIndicatorPosition()
}, { immediate: true })

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    removeToken()
    router.push('/login')
    window.location.reload()
  }).catch(() => {
    // 用户取消操作
  })
}
</script>

<template>
  <div class="navigation-container">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      background-color="#192330"
      text-color="#a0aec0"
      active-text-color="#42b983"
      class="nav-menu"
      :ellipsis="false"
    >
      <div class="logo-container">
        <div class="logo">
          <img src="@/assets/images/Logo.png" class="logo-icon" alt="慧学教育Logo" />
          <!-- <h3 class="logo-text">慧学教育</h3> -->
        </div>
        <!-- 新增的3D Logo 容器 -->
        <div class="custom-logo-3d">
           
          <div class="logo-text">慧学教育</div>
          <!-- 您可以在这里放置您的自定义3D logo -->
        </div>
      </div>
      
      <div class="nav-items-container">
        <el-menu-item
          v-for="item in navItems"
          :key="item.index"
          :index="item.index"
          @click="handleNavClick(item.path)"
          class="nav-item"
          :ref="el => navItemRefs[item.index - 1] = el"
          :data-index="item.index"
        >
          {{ item.name }}
        </el-menu-item>
        <!-- 平滑移动的下划线 -->
        <div 
          class="nav-indicator" 
          :style="indicatorStyle"
        ></div>
      </div>
      
      <div class="nav-right">
        <el-dropdown>
          <div class="user-info">
            <el-avatar :size="36" :src="'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
            <span class="user-name">用户中心</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="User" @click="handleNavClick('/profile')">个人资料</el-dropdown-item>
              <el-dropdown-item icon="Setting" @click="handleNavClick('/settings')">设置</el-dropdown-item>
              <el-dropdown-item icon="CircleClose" divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-menu>
  </div>
</template>

<style scoped>
.navigation-container {
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-menu {
  display: flex;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background: linear-gradient(to bottom, #000000, #333333);
}

.logo-container {
  display: flex;
  align-items: center;
  margin-right: 40px;
  position: relative; /* 为绝对定位提供参考 */
  perspective: 1000px; /* 添加透视效果 */
  transform-style: preserve-3d;
  cursor: pointer; /* 添加鼠标悬浮时的小手效果 */
  transition: transform 0.6s ease;
}

.logo {
  display: flex;
  align-items: center;
  position: relative; /* 使新div能相对于此元素定位 */
  transform: translateZ(40px);
  width: 140px;
  height: 40px;
  backface-visibility: hidden;
}

.logo-container:hover{
    transform:rotateX(90deg);
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  margin: 0 auto;
}

/* 新增的3D Logo 样式 */
.custom-logo-3d {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  transform-origin: center center;
  transform:translateY(20px) rotateX(-90deg);
  width: 140px;
  height: 40px;
  transition: transform 0.6s ease; /* 添加过渡动画 */
}

.nav-items-container {
  display: flex;
  flex: 1;
  position: relative;
}

.nav-item {
  height: 64px;
  line-height: 64px;
  padding: 0 20px;
  font-size: 15px;
  font-weight: 500;
  border-bottom: none; /* 移除原有的下划线 */
  transition: all 0.3s ease;
}

/* 移除原有的激活状态样式 */
.nav-item.is-active {
  background-color: transparent;
  border-bottom: none;
}

.nav-item:hover {
  color: #42b983 !important;
}

/* 平滑移动的下划线 */
.nav-indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background-color: #42b983;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border-radius: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: rgba(66, 185, 131, 0.1);
}

.user-name {
  margin: 0 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

:deep(.el-menu-item) {
  --el-menu-hover-bg-color: rgba(66, 185, 131, 0.1) !important;
}

.logo-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  margin: 0 auto;
}
</style>