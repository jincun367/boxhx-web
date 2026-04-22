<script setup>
import Navigation from './Nav/Navigation.vue'
import Footer from './last/Footer.vue'
import Cet from './Ct/Cet.vue'
import footerData from '@/resource/init.json'
import { scrollToSection } from '@/hooks/load.js'

// 提取footer数据
const footerSchema = footerData.footer
</script>

<template>
  <div class="home-layout">
    <Navigation />
    <div class="main-content">
      <!-- 四六级板块 -->
      <div id="cet" class="content-section">
        <h2><span class="section-anchor" @click="scrollToSection('cet')">#</span> 四六级</h2>
        <hr class="hrstyle">
        <Cet />
      </div>
      
      <!-- 考研板块 -->
      <div id="postgraduate" class="content-section">
        <h2><span class="section-anchor" @click="scrollToSection('postgraduate')">#</span> 考研</h2>
        <hr class="hrstyle">
        <div class="placeholder-content">考研内容区域</div>
      </div>
      
      <!-- AI工具板块 -->
      <div id="ai-tools" class="content-section">
        <h2><span class="section-anchor" @click="scrollToSection('ai-tools')">#</span> AI工具</h2>
        <hr class="hrstyle">
        <div class="placeholder-content">AI工具内容区域</div>
      </div>
      
      <!-- 学习计划板块 -->
      <div id="study-plan" class="content-section">
        <h2><span class="section-anchor" @click="scrollToSection('study-plan')">#</span> 学习计划</h2>
        <hr class="hrstyle">
        <div class="placeholder-content">学习计划内容区域</div>
      </div>
      
      <!-- 个人技术板块 -->
      <div id="personal-tech" class="content-section">
        <h2><span class="section-anchor" @click="scrollToSection('personal-tech')">#</span> 个人技术</h2>
        <hr class="hrstyle">
        <div class="placeholder-content">个人技术内容区域</div>
      </div>
    </div>
    <Footer :schema="footerSchema">
      <template #highlight>
        <div class="highlight-content">
          <h3>慧学教育</h3>
          <p>一站式智能学习平台<br/>让知识触手可及</p>
        </div>
      </template>
    </Footer>
  </div>
</template>

<style scoped>
.home-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.hrstyle{
  border: 0;  /* 清除默认边框，防止样式干扰 */
  border-top: 2px solid #42b983; /* 直接设置上边框为想要的颜色 */
}

.main-content {
  flex: 1;
  padding: 40px 20px;
  background-color: transparent;
}

.content-section {
  max-width: 1000px;
  margin: 0 auto 60px auto;
  padding: 30px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  color: white;
}

.placeholder-content {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 18px;
  margin-top: 20px;
}

/* 板块标题样式 */
h2 {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

/* 分隔符样式 */
.content-section + .content-section {
  margin-top: 40px;
}

/* 板块锚点样式 */
.section-anchor {
  cursor: pointer;
  color: #42b983;
  margin-right: 8px;
  font-weight: bold;
  transition: color 0.2s ease;
}

.section-anchor:hover {
  color: #67c29c;
  text-decoration: underline;
}

/* Highlight slot 样式 */
.highlight-content {
  text-align: center;
}

.highlight-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: white;
}

.highlight-content p {
  font-size: 14px;
  opacity: 0.9;
  color: white;
  line-height: 1.4;
}
</style>