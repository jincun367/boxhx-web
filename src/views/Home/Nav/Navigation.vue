<script setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { removeToken } from '@/api/auth.js'
import { ElMessageBox } from 'element-plus'
// 导入load.js中的scrollToSection函数
import { scrollToSection } from '@/hooks/load.js'

const router = useRouter()
const route = useRoute()

// 用户头像
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 获取用户头像
const getUserAvatar = () => {
  try {
    const storedUsers = localStorage.getItem('users')
    if (storedUsers) {
      const users = JSON.parse(storedUsers)
      if (users.length > 0 && users[0].avatar) {
        userAvatar.value = users[0].avatar
      }
    }
  } catch (error) {
    console.error('获取用户头像失败:', error)
  }
}

// 获取导航项引用
const navItemRefs = ref([])

// 根据当前路径计算激活的索引
const activeIndex = computed(() => {
  const currentPath = route.path
  const activeItem = navItems.find(item => item.path === currentPath)
  return activeItem ? activeItem.index : '1'
})

// 修改导航项，改为首页、资源中心、个人技术、评论
const navItems = [
  { index: '1', name: '首页', path: '/', sectionId: 'home' },
  { index: '2', name: '资源中心', path: '/resources', sectionId: 'resources' },
  { index: '3', name: '个人技术', path: '/blog', sectionId: 'personal-tech' },
  { index: '4', name: '评论', path: '/comments', sectionId: 'comments' }
]

// 下划线位置和宽度
const indicatorStyle = ref({
  left: '0px',
  width: '0px',
  transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' // 缓存过渡效果
})

// 节流函数，防止过于频繁的更新
const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// 处理导航点击
const handleNavClick = (path, sectionId) => {
  const currentPath = route.path
  
  if (currentPath === path) {
    // 如果已经在当前页面，直接滚动到对应section
    scrollToSection(sectionId)
  } else {
    // 如果是不同页面，先跳转路由
    router.push(path).then(() => {
      // 路由跳转完成后，检查是否需要滚动到特定section
      // 资源中心和评论页面是独立页面，不需要滚动到section
      if (path === '/resources' || path === '/comments') {
        // 这些页面保持页面顶部
        return
      }
      // 其他页面滚动到对应section
      // 使用setTimeout确保DOM已更新
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 100)
    }).catch((error) => {
      console.error('路由跳转失败:', error)
    })
  }
}

// 更新下划线位置
const updateIndicatorPosition = throttle(() => {
  nextTick(() => {
    const activeIndexVal = activeIndex.value
    const activeItem = navItemRefs.value.find(item => item?.$el?.dataset?.index === activeIndexVal)
    
    if (activeItem && activeItem.$el) {
      const rect = activeItem.$el.getBoundingClientRect()
      const containerRect = activeItem.$el.parentElement.getBoundingClientRect()
      
      // 使用requestAnimationFrame优化UI更新
      requestAnimationFrame(() => {
        indicatorStyle.value = {
          left: `${rect.left - containerRect.left}px`,
          width: `${rect.width}px`,
          transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }
      })
    }
  })
}, 100) // 节流间隔100ms

// 监听路由变化
watch(() => route.path, () => {
  updateIndicatorPosition()
  // 路由变化时检查用户头像是否更新
  getUserAvatar()
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

// 鼠标进入导航项时的效果
const handleMouseEnter = (index) => {
  const navItem = navItemRefs.value[index - 1]?.$el;
  if (navItem) {
    const rect = navItem.getBoundingClientRect();
    const containerRect = navItem.parentElement.getBoundingClientRect();
    
    requestAnimationFrame(() => {
      indicatorStyle.value = {
        left: `${rect.left - containerRect.left}px`,
        width: `${rect.width}px`,
        transition: 'all 0.3s ease' // 更快的过渡效果
      }
    });
  }
};

// 鼠标离开导航项时恢复原状
const handleMouseLeave = () => {
  updateIndicatorPosition(); // 恢复到激活项的位置
};

onMounted(() => {
  // 初始化指示器位置
  updateIndicatorPosition();
  // 加载用户头像
  getUserAvatar();
});

onUnmounted(() => {
  // 清理定时器
  if (typeof updateIndicatorPosition === 'function' && updateIndicatorPosition.timeoutId) {
    clearTimeout(updateIndicatorPosition.timeoutId);
  }
});
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
          @click="handleNavClick(item.path, item.sectionId)"
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
            <el-avatar :size="36" :src="userAvatar" />
            <span class="user-name">用户中心</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="User" @click="handleNavClick('/profile', 'profile')">个人资料</el-dropdown-item>
              <el-dropdown-item icon="Setting" @click="handleNavClick('/settings', 'settings')">设置</el-dropdown-item>
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