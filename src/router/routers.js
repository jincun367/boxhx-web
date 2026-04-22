// src/router/routers.js
import { createRouter, createWebHistory } from 'vue-router'

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/Home.vue'),
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
    path: '/cet',
    name: 'CET',
    component: () => import('@/views/Home/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/postgraduate',
    name: 'Postgraduate',
    component: () => import('@/views/Home/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ai-tools',
    name: 'AITools',
    component: () => import('@/views/Home/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/study-plan',
    name: 'StudyPlan',
    component: () => import('@/views/Home/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/personal-tech',
    name: 'PersonalTech',
    component: () => import('@/views/Home/Home.vue'),
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
  
  if (to.meta.requiresAuth && !token) {
    // 如果需要认证但没有token，则跳转到登录页
    next('/login')
  } else if (to.path === '/login' && token) {
    // 如果已经登录但访问登录页，则跳转到首页
    next('/')
  } else {
    next()
  }
})

export default router