// src/router/routers.js
import { createRouter, createWebHistory } from 'vue-router'

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/home.vue'),
    meta: { requiresAuth: true } // 需要认证才能访问
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/login.vue') // 单一组件，包含登录和注册
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Home/Nav/Individual.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('@/views/Resources/Resources.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/blog',
    name: 'PersonalTech',
    component: () => import('@/views/blog/myblog/blogtext.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/comments',
    name: 'Comments',
    component: () => import('@/views/comments/Comments.vue'),
    meta: { requiresAuth: true }
  }
]

// 创建路由器实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，检查认证状态
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  
  // 如果访问的是首页 (/)，无论是否有 token 都允许通过，以便显示开场动画
  // 具体的登录态检查和跳转逻辑应在 Home.vue 组件内部根据动画播放状态处理
  if (to.path === '/') {
    next()
  } else if (to.meta.requiresAuth && !token) {
    // 其他需要认证但没有token的页面，跳转到登录页
    next('/login')
  } else if (to.path === '/login' && token) {
    // 如果已经登录但访问登录页，则跳转到首页
    next('/')
  } else {
    next()
  }
})

export default router