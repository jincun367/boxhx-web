<script setup>
import { ref } from 'vue'
import initData from '@/resource/init.json'

// 从 init.json 中获取 AI 工具数据
const aiTools = initData.aiTools

// 当前悬停的图片索引
const hoveredIndex = ref(-1)

// 获取当前应该显示的图片路径
const getCurrentImage = (index) => {
  return hoveredIndex.value === index 
    ? aiTools[index].lightImage 
    : aiTools[index].darkImage
}
</script>

<template>
  <div class="ai-grid-container">
    <div 
      v-for="(tool, index) in aiTools" 
      :key="tool.id"
      class="ai-image-item"
      @mouseenter="hoveredIndex = index"
      @mouseleave="hoveredIndex = -1"
    >
      <!-- 直接使用 src 而不是 data-src，确保切换正常工作 -->
      <img 
        :src="getCurrentImage(index)"
        :alt="tool.name"
        class="ai-image"
        loading="lazy"
      />
      <span class="ai-image-label">{{ tool.name }}</span>
    </div>
  </div>
</template>

<style scoped>
.ai-grid-container {
  display: grid;
  /* 改为3列布局 */
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 20px;
  background: rgba(20, 40, 40, 0.85);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  max-width: 600px; /* 3列布局适合的宽度 */
  margin: 0 auto;
}

.ai-image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 12px;
}

.ai-image-item:hover {
  transform: scale(1.1);
}

.ai-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  transition: all 0.3s ease;
  border-radius: 12px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.ai-image-label {
  margin-top: 12px;
  font-size: 14px;
  color: #e0f0e0;
  text-align: center;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}
</style>