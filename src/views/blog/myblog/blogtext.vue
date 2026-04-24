<template>
  <div class="personal-tech-page">
    <h1>个人技术</h1>
    <p>欢迎来到个人技术页面，这里分享各种技术相关的内容和经验。</p>
    
    <div class="tech-posts">
      <div class="tech-post-card" v-for="post in techPosts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p class="post-excerpt">{{ post.excerpt }}</p>
        <div class="post-meta">
          <span class="post-date">{{ post.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalTechPage',
  data() {
    return {
      techPosts: [
        {
          id: 1,
          title: '前端开发最佳实践',
          excerpt: '分享前端开发中的最佳实践，包括代码组织、性能优化和团队协作...',
          date: '2024-01-15'
        },
        {
          id: 2,
          title: 'Vue 3 新特性详解',
          excerpt: '深入探讨 Vue 3 的 Composition API、Teleport、Suspense 等新特性...',
          date: '2024-01-10'
        },
        {
          id: 3,
          title: '响应式设计技巧',
          excerpt: '如何构建适配不同设备的响应式网站，提升用户体验...',
          date: '2024-01-05'
        },
        {
          id: 4,
          title: 'JavaScript 性能优化',
          excerpt: 'JavaScript 代码性能优化的实用技巧和工具推荐...',
          date: '2024-01-01'
        }
      ]
    }
  }
}
</script>

<style scoped>
.personal-tech-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 128px); /* 减去导航栏和页脚的高度 */
}

.personal-tech-page h1 {
  color: #ffffff;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.personal-tech-page p {
  font-size: 1.2rem;
  text-align: center;
  color: #a0aec0;
  margin-bottom: 40px;
}

.tech-posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.tech-post-card {
  background: rgba(20, 40, 40, 0.85);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(66, 185, 131, 0.3);
}

.tech-post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  border-color: rgba(66, 185, 131, 0.5);
}

.tech-post-card h3 {
  color: #42b983;
  margin-top: 0;
  font-size: 1.4rem;
}

.post-excerpt {
  color: #e0f0e0;
  line-height: 1.6;
}

.post-meta {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(66, 185, 131, 0.2);
  color: #94a3b8;
  font-size: 0.9rem;
}
</style>