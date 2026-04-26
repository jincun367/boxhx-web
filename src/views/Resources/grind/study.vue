<template>
  <div class="study-container">
    <div class="bg-soft"></div>
    <div class="cards-wrapper">
      <div 
        v-for="card in studyCards" 
        :key="card.id"
        class="card-container" 
        @mouseenter="handleMouseEnter(card.id)" 
        @mouseleave="handleMouseLeave(card.id)"
      >
        <!-- 卡片主体：包含需要3D变形的元素 -->
        <div class="card">
          <div class="card-content">
            <div class="card-main">
              <div class="card-icon">{{ card.icon }}</div>
              <div class="card-title">{{ card.title }}</div>
              <div class="card-divider"></div>
              <div class="card-desc" v-html="card.desc.replace(/\n/g, '<br>')"></div>
            </div>
          </div>
        </div>
        
        <!-- 三个独立圆形按钮 - 完全不参与卡片3D变换，永远保持平整 -->
        <div class="button-group">
          <button class="circle-button study-btn" title="开始学习">
            <span>📖</span>
          </button>
          <button class="circle-button practice-btn" title="刷题练习">
            <span>📝</span>
          </button>
          <button class="circle-button review-btn" title="复习巩固">
            <span>🔍</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 从本地JSON文件加载数据
const studyCards = ref([]);

const hoveringCardId = ref(null);

const handleMouseEnter = (cardId) => {
  hoveringCardId.value = cardId;
};

const handleMouseLeave = (cardId) => {
  hoveringCardId.value = null;
  // 强制重绘确保变形归位流畅无卡顿
  const card = document.querySelector(`.card-container[data-id="${cardId}"] .card`);
  if (card) {
    void card.offsetHeight;
  }
};

// 加载数据
onMounted(async () => {
  try {
    const response = await fetch('/src/resource/init.json');
    const data = await response.json();
    studyCards.value = data.studyCards || [];
  } catch (error) {
    console.error('Failed to load study cards:', error);
    // 如果加载失败，使用默认数据
    studyCards.value = [
      {
        id: 1,
        title: "考研408",
        icon: "📚",
        desc: "计算机专业基础综合\n数据结构 · 计算机组成原理\n操作系统 · 计算机网络"
      },
      {
        id: 2,
        title: "考研英语",
        icon: "📖",
        desc: "英语一 · 英语二\n阅读理解 · 写作翻译\n完形填空 · 新题型"
      },
      {
        id: 3,
        title: "临考复习板块",
        icon: "🎯",
        desc: "冲刺押题 · 模拟测试\n错题回顾 · 时间规划\n心理调适 · 应试技巧"
      }
    ];
  }
});
</script>

<style scoped>
.study-container {
  min-height: 50vh;
  background: linear-gradient(135deg, #1a1f36, #0f1223, #1a1f36);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', 'Inter', 'Poppins', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  padding: 2rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

/* 优雅的呼吸光效背景，增加氛围 */
.bg-soft {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 20% 40%, rgba(96, 165, 250, 0.08), transparent 60%);
  pointer-events: none;
  z-index: -1;
}

/* 卡片容器包装器 - flex布局 */
.cards-wrapper {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
}

/* 单卡片容器 - 完全居中，透视空间足够 */
.card-container {
  perspective: 1400px;
  width: 30%;
  max-width: 360px;
  margin: 0 auto;
  cursor: default;
  position: relative;
  animation: softFloat 4.5s ease-in-out infinite;
  transition: animation 0.2s;
}

.card-container:hover {
  animation-play-state: paused;
}

/* 卡片主体 - 需要产生3D变形的层 */
.card {
  width: 100%;
  aspect-ratio: 3 / 4;
  max-width: 360px;
  height: auto;
  background: linear-gradient(145deg, rgba(25, 30, 55, 0.9), rgba(15, 18, 35, 0.96));
  backdrop-filter: blur(4px);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 40px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  /* 关键: 启用3D空间，供内容子元素做独立反向变换 */
  transform-style: preserve-3d;
  transition: transform 0.38s cubic-bezier(0.2, 0.9, 0.4, 1.1),
              box-shadow 0.3s ease,
              border-color 0.2s ease;
  transform: rotateX(0deg) rotateY(0deg) translateZ(0);
  transform-origin: 0% 100%; /* 基准点左下角，保证形变正确 */
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* 卡片悬浮时的3D变形：左下角向外延伸，右上角向内收缩 */
.card-container:hover .card {
  transform-origin: 0% 100%;
  transform: rotateX(15deg) rotateY(15deg) translateZ(12px);
  box-shadow: 0 35px 50px -18px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(192, 132, 252, 0.4);
}

/* 卡片内部内容层 - 用于布局，但不干扰3D反向独立 */
.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0.7rem 1.3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 32px;
  z-index: 2;
}

/* 普通内容区域（参与3D变形的部分） - 我们希望这部分跟随父级3D */
.card-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
}

/* 装饰性icon区 (随卡片3D自然倾斜，增加沉浸感) */
.card-icon {
  font-size: 3.8rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  width: fit-content;
}

.card-container:hover .card-icon {
  transform: translateZ(18px) scale(1.02);
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(120deg, #FFFFFF, #c084fc, #60a5fa);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
  letter-spacing: -0.3px;
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

.card-container:hover .card-title {
  transform: translateZ(14px);
}

.card-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #c084fc, #3b82f6);
  border-radius: 4px;
  margin: 0.7rem 0 1rem;
  transition: transform 0.3s ease;
}

.card-container:hover .card-divider {
  transform: translateZ(10px);
}

.card-desc {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #cddcff;
  margin-bottom: 1.2rem;
  transition: transform 0.3s ease;
}

.card-container:hover .card-desc {
  transform: translateZ(8px);
}

/* 增加左下角方向光晕，强化向外延伸的视觉指向 */
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 32px;
  background: radial-gradient(circle at 0% 100%, rgba(192, 132, 252, 0.25), rgba(59, 130, 246, 0) 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.card-container:hover .card::before {
  opacity: 0.7;
}

/* 右上角微暗影，强化内收的景深感 */
.card::after {
  content: "";
  position: absolute;
  top: 12px;
  right: 12px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.3), transparent);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
  z-index: 0;
}

.card-container:hover .card::after {
  opacity: 0.6;
}

/* 平滑的待机微浮动，让卡片有生命力 */
@keyframes softFloat {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* 三个独立圆形按钮组 - 完全脱离卡片3D变换，不参与任何3D效果，永远保持平整 */
.button-group {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  display: flex;
  gap: 8px;
  pointer-events: auto;
}


.circle-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(20, 24, 45, 0.85);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(192, 132, 252, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #e2e8ff;
  will-change: transform;
}

.circle-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
}

.circle-button:active {
  transform: translateY(-2px) scale(1.02);
}

/* 不同按钮的配色 */
.study-btn {
  border-color: rgba(59, 130, 246, 0.6);
}

.study-btn:hover {
  background: rgba(59, 130, 246, 0.25);
  border-color: rgba(59, 130, 246, 0.8);
  color: #60a5fa;
}

.practice-btn {
  border-color: rgba(239, 68, 68, 0.6);
}

.practice-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.8);
  color: #ef4444;
}

.review-btn {
  border-color: rgba(34, 197, 94, 0.6);
}

.review-btn:hover {
  background: rgba(34, 197, 94, 0.25);
  border-color: rgba(34, 197, 94, 0.8);
  color: #22c55e;
}

/* 悬浮时按钮的特殊效果 - 完全不继承3D */
.card-container:hover .circle-button {
  transform: translateY(-4px) scale(1.05);
}

.card-container:hover .circle-button:hover {
  transform: translateY(-6px) scale(1.1);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .cards-wrapper {
    gap: 1.5rem;
  }
  
  .card-container {
    width: 45%;
  }
}

@media (max-width: 768px) {
  .cards-wrapper {
    gap: 1rem;
  }
  
  .card-container {
    width: 100%;
    max-width: 320px;
  }
}

@media (max-width: 500px) {
  .card-container {
    max-width: 300px;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.7rem;
  }
  
  .card-icon {
    font-size: 3rem;
  }
  
  .card-desc {
    font-size: 0.85rem;
  }
  
  .button-group {
    bottom: 16px;
    gap: 12px;
  }
  
  .circle-button {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
  }
}

/* 确保所有元素过渡流畅 */
.card, .card-content, .card-icon, .card-title, .card-desc, .circle-button {
  transition: transform 0.38s cubic-bezier(0.2, 0.9, 0.4, 1.1), 
              background 0.2s, 
              color 0.2s, 
              border-color 0.2s, 
              box-shadow 0.2s;
}
</style>