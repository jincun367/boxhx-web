<template>
  <div class="home-page">
    <h1>欢迎来到首页</h1>
    <p>这里是慧学教育的首页，为您提供优质的学习资源和工具。</p>
    <div class="content-section">
      <h2>我们的服务</h2>
      <ul>
        <li>学习资源中心</li>
        <li>AI智能辅助工具</li>
        <li>个性化学习计划</li>
        <li>专业博客文章</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 128px); /* 减去导航栏和页脚的高度 */
}

.home-page h1 {
  color: #333;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
}

.home-page p {
  font-size: 1.2rem;
  text-align: center;
  color: #666;
  margin-bottom: 40px;
}

.content-section {
  margin-top: 40px;
}

.content-section h2 {
  color: #42b983;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
}

.content-section ul {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.content-section li {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  text-align: center;
  font-size: 1.1rem;
}
</style>