<script setup>
import { ref } from 'vue'
import initData from '@/resource/init.json'

const cetDataList = initData.Cettext

const handleButtonClick = (link) => {
  window.open(link, '_blank')
}
</script>

<template>
  <div class="carousel-container">
    <el-carousel 
      :interval="5000" 
      type="card" 
      height="280px" 
      arrow="always"
      :speed="500"
      indicator-position="outside"
    >
      <el-carousel-item 
        v-for="item in cetDataList" 
        :key="item.id"
      >
        <div class="carousel-card">
          <div class="card-content">
            <div class="card-header">
              <h3 class="card-title">{{ item.title }}</h3>
              <span class="card-subtitle">{{ item.subtitle }}</span>
            </div>
            <p class="card-description">{{ item.description }}</p>
            <div class="card-actions">
              <el-button 
                type="primary" 
                size="default"
                @click="handleButtonClick(item.link)"
              >
                {{ item.buttonText }}
              </el-button>
              <el-button 
                type="default" 
                size="default"
                @click="handleButtonClick(item.answer)"
              >
                {{ item.answerText }}
              </el-button>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>
.carousel-container {
  width: 100%;
  padding: 30px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.carousel-card {
  background: linear-gradient(135deg, #6698e3 0%, #87CEEB 100%);
  border-radius: 16px;
  padding: 0;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-content {
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.carousel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}

.el-carousel__item--card.is-active .carousel-card {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  color: white;
  box-shadow: 0 12px 32px rgba(24, 144, 255, 0.3);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: inherit;
}

.card-subtitle {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.card-description {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
  white-space: pre-line;
  color: inherit;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.el-carousel__item--card.is-active .card-description {
  color: rgba(255, 255, 255, 0.9);
}

.card-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.card-actions .el-button {
  border-radius: 20px;
  padding: 8px 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card-actions .el-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.card-actions .el-button:hover::before {
  left: 100%;
}

.card-actions .el-button--primary {
  background: white;
  color: #1890ff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-actions .el-button--primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);
}

.card-actions .el-button--default {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-actions .el-button--default:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* 解决重影问题 */
.el-carousel__item {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

/* 确保卡片圆角一致性 */
.el-carousel__item--card {
  border-radius: 16px;
  overflow: hidden;
}

.el-carousel__item--card.is-active {
  border-radius: 16px;
  overflow: hidden;
}

/* 移除卡片轮播的遮罩层灰色背景 */
:deep(.el-carousel__mask) {
  background: transparent !important;
}

/* 调整轮播项的高度，确保与卡片高度一致 */
.el-carousel__item--card {
  height: 280px !important;
}

/* 调整轮播箭头位置 */
:deep(.el-carousel__arrow) {
  top: 50% !important;
  transform: translateY(-50%) !important;
  height: 32px !important;
  width: 32px !important;
  border-radius: 50% !important;
  background-color: rgba(0, 0, 0, 0.3) !important;
  transition: background-color 0.3s ease !important;
}

:deep(.el-carousel__arrow:hover) {
  background-color: rgba(0, 0, 0, 0.6) !important;
}

@media (max-width: 768px) {
  .carousel-container {
    padding: 20px 0;
  }
  
  .carousel-card {
    padding: 0;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .card-description {
    font-size: 12px;
  }
  
  .card-actions .el-button {
    padding: 6px 16px;
    font-size: 12px;
  }
  
  /* 移动端调整轮播项高度 */
  .el-carousel__item--card {
    height: 260px !important;
  }
  
  /* 移动端调整轮播容器高度 */
  :deep(.el-carousel--card) {
    height: 260px !important;
  }
  
  /* 移动端调整箭头大小 */
  :deep(.el-carousel__arrow) {
    height: 28px !important;
    width: 28px !important;
  }
}
</style>