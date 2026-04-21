<template>
  <div class="home">
    <!-- 英雄区/欢迎区 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="greeting">你好，我是</span>
            <span class="name">你的名字</span>
          </h1>
          <p class="hero-subtitle">
            全栈开发工程师 / 热爱创造有价值的产品
          </p>
          <p class="hero-description">
            专注于构建优雅、高效、用户友好的Web应用。
            对新技术充满热情，喜欢解决复杂问题。
          </p>
          <div class="hero-buttons">
            <a href="#contact" class="btn btn-primary">联系我</a>
            <a href="#projects" class="btn btn-outline">查看作品</a>
          </div>
        </div>
        <div class="hero-image">
          <div class="avatar-placeholder">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="40" r="30" fill="#e2e8f0" />
              <circle cx="50" cy="80" r="40" fill="#e2e8f0" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- 技能区 -->
    <section class="skills">
      <div class="container">
        <h2 class="section-title">技术栈</h2>
        <div class="skills-grid">
          <div class="skill-card" v-for="skill in skills" :key="skill.name">
            <div class="skill-icon">{{ skill.icon }}</div>
            <h3>{{ skill.name }}</h3>
            <div class="skill-bar">
              <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目展示区 -->
    <section id="projects" class="projects">
      <div class="container">
        <h2 class="section-title">精选项目</h2>
        <div class="projects-grid">
          <div class="project-card" v-for="project in projects" :key="project.id">
            <div class="project-image">
              <div class="placeholder-image">
                <span>{{ project.icon }}</span>
              </div>
            </div>
            <div class="project-content">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="project-links">
                <a :href="project.demo" target="_blank" class="project-link">演示</a>
                <a :href="project.github" target="_blank" class="project-link">源码</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我 -->
    <section class="about">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2 class="section-title">关于我</h2>
            <p>
              我是一名充满激情的全栈开发工程师，拥有X年的Web开发经验。
              我相信技术应该服务于人，致力于创造既美观又实用的数字产品。
            </p>
            <p>
              在空闲时间，我喜欢探索新技术、为开源项目做贡献、写技术博客，
              以及享受一杯好咖啡。
            </p>
            <div class="about-stats">
              <div class="stat">
                <span class="stat-number">3+</span>
                <span class="stat-label">年经验</span>
              </div>
              <div class="stat">
                <span class="stat-number">20+</span>
                <span class="stat-label">完成项目</span>
              </div>
              <div class="stat">
                <span class="stat-number">10+</span>
                <span class="stat-label">技术文章</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系区 -->
    <section id="contact" class="contact">
      <div class="container">
        <h2 class="section-title">联系我</h2>
        <div class="contact-content">
          <p class="contact-intro">
            无论是项目合作、技术交流，还是想打个招呼，都欢迎联系我！
          </p>
          <div class="contact-links">
            <a href="mailto:your.email@example.com" class="contact-link">
              <span class="contact-icon">📧</span>
              <span>your.email@example.com</span>
            </a>
            <a href="https://github.com/yourusername" target="_blank" class="contact-link">
              <span class="contact-icon">💻</span>
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" class="contact-link">
              <span class="contact-icon">🔗</span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 技能数据
const skills = ref([
  { name: 'Vue.js', level: 90, icon: '🟢' },
  { name: 'JavaScript/TypeScript', level: 85, icon: '📝' },
  { name: 'Node.js', level: 80, icon: '🟢' },
  { name: 'Python', level: 75, icon: '🐍' },
  { name: 'HTML/CSS', level: 90, icon: '🎨' },
  { name: 'React', level: 70, icon: '⚛️' },
])

// 项目数据
const projects = ref([
  {
    id: 1,
    title: '个人博客系统',
    description: '基于Vue3和Node.js开发的现代化个人博客系统，支持Markdown写作、评论互动和SEO优化。',
    tags: ['Vue 3', 'Express', 'MongoDB', 'TailwindCSS'],
    icon: '📝',
    demo: '#',
    github: '#'
  },
  {
    id: 2,
    title: '任务管理应用',
    description: '简洁高效的任务管理工具，支持项目分类、截止日期提醒、团队协作和数据可视化。',
    tags: ['React', 'TypeScript', 'Firebase', 'Chart.js'],
    icon: '✅',
    demo: '#',
    github: '#'
  },
  {
    id: 3,
    title: '电商平台前端',
    description: '响应式电商网站前端，包含商品展示、购物车、用户认证等完整功能模块。',
    tags: ['Vue', 'Vuex', 'Axios', 'SCSS'],
    icon: '🛒',
    demo: '#',
    github: '#'
  }
])
</script>

<style scoped>
.home {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
}

.hero .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.greeting {
  display: block;
  font-size: 1.5rem;
  font-weight: normal;
  opacity: 0.9;
}

.name {
  display: block;
  font-weight: bold;
}

.hero-subtitle {
  font-size: 1.8rem;
  margin-bottom: 20px;
  opacity: 0.95;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 600px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 20px;
}

.btn {
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.btn-outline {
  border: 2px solid white;
  color: white;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-placeholder {
  width: 300px;
  height: 300px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder svg {
  width: 200px;
  height: 200px;
}

/* Section Title */
.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 50px;
  color: #2d3748;
}

/* Skills Section */
.skills {
  padding: 80px 0;
  background: #f7fafc;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.skill-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.skill-card h3 {
  margin-bottom: 15px;
  color: #2d3748;
}

.skill-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 1s ease;
}

/* Projects Section */
.projects {
  padding: 80px 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.project-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.project-image {
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  font-size: 4rem;
  color: white;
}

.project-content {
  padding: 25px;
}

.project-content h3 {
  margin-bottom: 10px;
  color: #2d3748;
}

.project-content p {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 15px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
}

.project-links {
  display: flex;
  gap: 20px;
}

.project-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.project-link:hover {
  color: #764ba2;
}

/* About Section */
.about {
  padding: 80px 0;
  background: #f7fafc;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
  margin-bottom: 20px;
}

.about-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  display: block;
  color: #718096;
  margin-top: 5px;
}

/* Contact Section */
.contact {
  padding: 80px 0;
}

.contact-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.contact-intro {
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 40px;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 30px;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  color: #2d3748;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  width: 100%;
  max-width: 400px;
}

.contact-link:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  color: #667eea;
}

.contact-icon {
  font-size: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero .container {
    flex-direction: column;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.3rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .section-title {
    font-size: 2rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .about-stats {
    flex-direction: column;
    gap: 20px;
  }
}
</style>