<template>
  <div class="personal-tech-page">
    <!-- 粒子效果 -->
    <canvas id="particlesCanvas"></canvas>
    
    <div class="container">
      <h1 class="section-title">个人技术</h1>
      <p class="section-subtitle">欢迎来到个人技术页面，这里分享我的技术栈和项目经验</p>
      
      <!-- 技术栈部分 -->
      <div class="tech-stack-section">
        <div class="section-title-small">我会的东西</div>
        <div class="tech-stack-cards">
          <div class="tech-card html5">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="tech-name">HTML5</div>
          </div>
          <div class="tech-card css3">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <path d="M8 12h8M8 16h8M8 8h8"/>
              </svg>
            </div>
            <div class="tech-name">CSS3</div>
          </div>
          <div class="tech-card js">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div class="tech-name">JavaScript</div>
          </div>
          <div class="tech-card vue3">
            <div class="tech-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="tech-name">Vue 3</div>
          </div>
        </div>
      </div>
      
      <!-- 项目介绍部分 -->
      <div class="project-section">
        <div class="section-title-small">项目介绍</div>
        <div class="project-card">
          <div class="project-header">
            <h3>boxhx-web</h3>
            <a href="https://github.com/jincun367/boxhx-web.git" target="_blank" class="github-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 0a12 12 0 0 0-3.78 23.4c.6.1.82-.26.82-.58v-2.03C5.73 21.36 5.03 19 5.03 19A3.76 3.76 0 0 0 3.64 17c-.94-.64.07-.63.07-.63A2.8 2.8 0 0 1 5.69 16c1.78.9 3.7 1.48 5.67 1.52a2.78 2.78 0 0 1 .8-1.81c-3.58-.4-7.34-1.79-7.34-8.05A5.44 5.44 0 0 1 4.8 7.77a5.07 5.07 0 0 1 .06-3.76s1.06-.34 3.78 1.48a11.53 11.53 0 0 1 6.9 0c2.72-1.82 3.78-1.48 3.78-1.48a5.07 5.07 0 0 1 .06 3.76 5.44 5.44 0 0 1 1.5 3.78c0 6.27-3.77 7.65-7.36 8.03a2.94 2.94 0 0 1 .84 2.12v3.24c0 .32.2.69.82.58A12 12 0 0 0 12 0z"/>
              </svg>
              GitHub
            </a>
          </div>
          <div class="project-content">
            <p class="project-description">这是一个基于Vue 3的个人网站项目，包含个人博客、技术分享等功能。项目采用现代化的前端技术栈，具有响应式设计和良好的用户体验。</p>
            <div class="project-features">
              <h4>实现方案：</h4>
              <ul>
                <li>使用Vue 3 Composition API进行状态管理</li>
                <li>采用Tailwind CSS进行样式设计</li>
                <li>使用Vue Router实现路由管理</li>
                <li>响应式设计，适配不同设备</li>
                <li>集成粒子效果和动画，提升视觉体验</li>
                <li>模块化组件设计，代码结构清晰</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalTechPage',
  mounted() {
    this.initParticles();
  },
  methods: {
    initParticles() {
      const canvas = document.getElementById('particlesCanvas');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      const particles = [];
      const particleCount = 100;
      
      class Particle {
        constructor() {
          this.reset();
        }
        
        reset() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 2 + 0.5;
          this.speedX = (Math.random() - 0.5) * 0.5;
          this.speedY = (Math.random() - 0.5) * 0.5;
          this.opacity = Math.random() * 0.5 + 0.1;
          this.color = `rgba(96, 165, 250, ${this.opacity})`;
        }
        
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
          }
        }
        
        draw() {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      
      function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        requestAnimationFrame(animateParticles);
      }
      
      animateParticles();
    }
  }
}
</script>

<style scoped>
.personal-tech-page {
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(circle at bottom left, #001f54 0%, transparent 50%),
    radial-gradient(circle at top right, #001f54 0%, transparent 30%),
    #000000;
  overflow: hidden;
}

/* 噪点效果 */
.personal-tech-page::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.15;
  mix-blend-mode: overlay;
  animation: noiseMove 20s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes noiseMove {
  0% { transform: translate(0, 0) scale(1.1); }
  25% { transform: translate(-2%, -2%) scale(1.05); }
  50% { transform: translate(0, 0) scale(1.1); }
  75% { transform: translate(2%, 2%) scale(1.05); }
  100% { transform: translate(0, 0) scale(1.1); }
}

/* 粒子画布 */
#particlesCanvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 80px;
  position: relative;
  z-index: 10;
}

.section-title {
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
  color: #e94560;
  text-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.2s;
}

.section-subtitle {
  text-align: center;
  font-size: 24px;
  color: #aaa;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 0.6s;
}

.section-title-small {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
  text-align: center;
  color: #60a5fa;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

/* 缓入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 技术栈部分 */
.tech-stack-section {
  margin-bottom: 80px;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 1s;
}

.tech-stack-cards {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.tech-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 30px;
  min-width: 160px;
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

.tech-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.tech-card.html5 {
  border-color: rgba(255, 99, 71, 0.4);
  background: linear-gradient(135deg, rgba(255, 99, 71, 0.1), rgba(255, 69, 0, 0.05));
  animation-delay: 1.2s;
}

.tech-card.css3 {
  border-color: rgba(30, 144, 255, 0.4);
  background: linear-gradient(135deg, rgba(30, 144, 255, 0.1), rgba(0, 119, 255, 0.05));
  animation-delay: 1.4s;
}

.tech-card.js {
  border-color: rgba(255, 215, 0, 0.4);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.05));
  animation-delay: 1.6s;
}

.tech-card.vue3 {
  border-color: rgba(66, 185, 131, 0.4);
  background: linear-gradient(135deg, rgba(66, 185, 131, 0.1), rgba(46, 160, 120, 0.05));
  animation-delay: 1.8s;
}

.tech-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 15px;
}

.tech-card.html5 .tech-icon {
  color: #ff6347;
}

.tech-card.css3 .tech-icon {
  color: #1e90ff;
}

.tech-card.js .tech-icon {
  color: #ffd700;
}

.tech-card.vue3 .tech-icon {
  color: #42b983;
}

.tech-icon svg {
  width: 100%;
  height: 100%;
}

.tech-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

/* 项目介绍部分 */
.project-section {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 2s;
  width: 100%;
  max-width: 1000px;
}

.project-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.project-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #60a5fa;
  margin: 0;
}

.github-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 8px;
  color: #60a5fa;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.github-link:hover {
  background: rgba(96, 165, 250, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
}

.github-link svg {
  width: 18px;
  height: 18px;
}

.project-description {
  font-size: 16px;
  color: #ddd;
  line-height: 1.6;
  margin-bottom: 30px;
}

.project-features h4 {
  font-size: 18px;
  font-weight: 700;
  color: #60a5fa;
  margin-bottom: 15px;
}

.project-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-features li {
  font-size: 14px;
  color: #ccc;
  line-height: 1.8;
  padding-left: 20px;
  position: relative;
}

.project-features li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #60a5fa;
  font-weight: bold;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .container {
    padding: 40px;
  }
  
  .section-title {
    font-size: 40px;
  }
  
  .section-subtitle {
    font-size: 20px;
  }
  
  .tech-stack-cards {
    gap: 20px;
  }
  
  .tech-card {
    padding: 20px;
    min-width: 140px;
  }
  
  .project-card {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 30px 20px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .section-subtitle {
    font-size: 18px;
  }
  
  .section-title-small {
    font-size: 24px;
  }
  
  .tech-stack-cards {
    flex-direction: column;
    align-items: center;
  }
  
  .tech-card {
    width: 100%;
    max-width: 300px;
  }
  
  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>