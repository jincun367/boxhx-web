<script setup>
import Cet from './Ct/Cet.vue'
import Study from './grind/study.vue'
import Aiuntil from './Ai/Aiuntil.vue'
import StudyPlan from './plan/studyplan.vue'
import SideBar from './side/sidebar.vue'  // 导入资源中心专属侧边栏组件
import { scrollToSection } from '@/hooks/load.js'
</script>

<template>
  <div class="resources-layout">
    <div class="main-content-wrapper">
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
          <Study />
        </div>
        
        <!-- AI工具板块 -->
        <div id="ai-tools" class="content-section">
          <h2><span class="section-anchor" @click="scrollToSection('ai-tools')">#</span> AI工具</h2>
          <hr class="hrstyle">
          <Aiuntil />
          <hr class="hrstyle">
        </div>
        
        <!-- 学习计划板块 -->
        <div id="study-plan" class="content-section">
          <h2><span class="section-anchor" @click="scrollToSection('study-plan')">#</span> 学习计划</h2>
          <hr class="hrstyle">
          <StudyPlan />
        </div>
        

      </div>
      <SideBar :scrollToSection="scrollToSection" />
    </div>
  </div>
</template>

<style scoped>
.resources-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.hrstyle{
  border: 0;  /* 清除默认边框，防止样式干扰 */
  border-top: 2px solid #42b983; /* 直接设置上边框为想要的颜色 */
}

.main-content-wrapper {
  display: flex;
  position: relative;
}

.main-content {
  flex: 1;
  padding: 40px 120px 40px 40px; /* 调整右边距为120px，为侧边栏留出足够空间 */
  background-color: transparent;
}

.content-section {
  max-width: 1000px;
  margin: 0 auto 60px auto;
  padding: 30px;
  background: rgba(20, 40, 40, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  color: white;
  border: 1px solid rgba(66, 185, 131, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.placeholder-content {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e0f0e0;
  font-size: 18px;
  margin-top: 20px;
  text-align: center;
  line-height: 1.6;
}

/* 板块标题样式 */
h2 {
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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