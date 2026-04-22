<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const particleCanvas = ref(null)
let animationId = null
let particles = []
let canvasWidth = 0
let canvasHeight = 0

// 粒子类
class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = Math.random() * 2 + 1 // 粒子大小：1-3
    this.weight = Math.random() * 1 + 0.5
    this.directionX = Math.random() * 2 - 1
    this.directionY = Math.random() * 2 - 1
    // 使用绿色调色板
    this.color = `rgba(${Math.floor(Math.random() * 50 + 50)}, ${Math.floor(Math.random() * 150 + 100)}, ${Math.floor(Math.random() * 50 + 50)}, ${Math.random() * 0.5 + 0.3})`
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
    const x = Math.random() * canvasWidth
    const y = Math.random() * canvasHeight
    particles.push(new Particle(x, y))
  }
}

// 动画循环
const animate = () => {
  const ctx = particleCanvas.value.getContext('2d')
  // 使用纯黑色背景
  ctx.fillStyle = '#0a1f1f'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  
  // 更新和绘制粒子
  for (let i = 0; i < particles.length; i++) {
    particles[i].update()
    particles[i].draw(ctx)
    
    // 移除过小的粒子
    if (particles[i].size <= 0.5) {
      particles.splice(i, 1)
      i--
    }
  }
  
  // 保持粒子数量
  if (particles.length < 80) {
    const x = Math.random() * canvasWidth
    const y = 0
    particles.push(new Particle(x, y))
  }
  
  animationId = requestAnimationFrame(animate)
}

// 初始化
const initCanvas = () => {
  const canvas = particleCanvas.value
  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  
  createParticles()
  animate()
  
  window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth
    canvasHeight = window.innerHeight
    canvas.width = canvasWidth
    canvas.height = canvasHeight
  })
}

onMounted(() => {
  initCanvas()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', initCanvas)
})
</script>

<template>
  <div class="app-container">
    <!-- 粒子背景 -->
    <canvas ref="particleCanvas" class="particle-background"></canvas>
    <router-view />
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
</style>