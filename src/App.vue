<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from '@/views/Home/Nav/Navigation.vue'
import Footer from '@/views/Home/last/Footer.vue'

const route = useRoute()

const particleCanvas = ref(null)
let animationId = null
let particles = []
let canvasWidth = 0
let canvasHeight = 0
let ctx = null // 缓存canvas上下文

// 优化：使用Map缓存随机数，减少Math.random()调用频率
const randomCache = {
  values: [],
  index: 0,
  size: 1000,
  
  init() {
    for (let i = 0; i < this.size; i++) {
      this.values.push(Math.random());
    }
  },
  
  get() {
    this.index = (this.index + 1) % this.size;
    return this.values[this.index];
  }
};

randomCache.init();

// 粒子类
class Particle {
  constructor(x, y) {
    // 使用缓存的随机数
    this.x = x
    this.y = y
    this.size = randomCache.get() * 2 + 1 // 粒子大小：1-3
    this.weight = randomCache.get() * 1 + 0.5
    this.directionX = randomCache.get() * 2 - 1
    this.directionY = randomCache.get() * 2 - 1
    // 使用绿色调色板
    this.color = `rgba(${Math.floor(randomCache.get() * 50 + 50)}, ${Math.floor(randomCache.get() * 150 + 100)}, ${Math.floor(randomCache.get() * 50 + 50)}, ${randomCache.get() * 0.5 + 0.3})`
  }

  update() {
    if (this.y > canvasHeight - this.size) {
      this.weight = -this.weight * 0.9
    }
    this.weight += 0.05
    this.y += this.weight
    this.x += this.directionX
    
    // 边界检测
    if (this.x < 0 || this.x > canvasWidth) {
      this.directionX = -this.directionX
    }
    
    // 缩小粒子
    if (this.size > 0.5) this.size -= 0.01
  }

  draw(ctx) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 创建初始粒子
const createParticles = () => {
  for (let i = 0; i < 80; i++) { // 增加粒子数量
    const x = randomCache.get() * canvasWidth
    const y = randomCache.get() * canvasHeight
    particles.push(new Particle(x, y))
  }
}

// 动画循环
const animate = () => {
  // 使用缓存的上下文
  // 使用纯黑色背景
  ctx.fillStyle = '#0a1f1f'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  
  // 优化：批量处理粒子，减少数组操作
  const aliveParticles = [];
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    particle.update();
    particle.draw(ctx);
    
    // 只有未死亡的粒子才会加入新的数组
    if (particle.size > 0.5) {
      aliveParticles.push(particle);
    }
  }
  
  // 替换粒子数组
  particles = aliveParticles;
  
  // 保持粒子数量
  const particlesToAdd = 80 - particles.length;
  if (particlesToAdd > 0) {
    for (let i = 0; i < particlesToAdd; i++) {
      const x = randomCache.get() * canvasWidth
      const y = 0
      particles.push(new Particle(x, y))
    }
  }
  
  animationId = requestAnimationFrame(animate)
}

// 优化：独立的窗口调整处理函数
const handleResize = () => {
  const canvas = particleCanvas.value
  if (!canvas) return;
  
  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight
  canvas.width = canvasWidth
  canvas.height = canvasHeight
}

// 初始化
const initCanvas = () => {
  const canvas = particleCanvas.value
  if (!canvas) return;
  
  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  
  // 缓存上下文
  ctx = canvas.getContext('2d')
  
  createParticles()
  animate()
  
  // 正确添加事件监听器
  window.addEventListener('resize', handleResize)
}

onMounted(() => {
  initCanvas()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  // 正确移除事件监听器
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="app-container">
    <!-- 粒子背景 -->
    <canvas ref="particleCanvas" class="particle-background"></canvas>
    
    <!-- 主布局，包含导航、内容区和页脚 -->
    <div class="main-layout">
      <Navigation v-if="route.path !== '/login'" />
      <div class="router-view-content">
        <router-view />
      </div>
      <Footer v-if="route.path !== '/login'" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import url("@/styles/common.scss");

.app-container {
  position: relative;
  min-height: 100vh;
}

.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0a1f1f;
  z-index: -1;
}

.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.router-view-content {
  flex: 1;
  margin-top: 0; // 为固定顶部的导航栏留出空间
}

/* 确保登录页面占满整个屏幕 */
.router-view-content:has(> [data-test="login-container"]) {
  margin-top: 0;
}
</style>