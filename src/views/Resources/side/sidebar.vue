<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <ul class="nav-list">
        <li class="nav-item" @click="handleScrollToSection('cet')" title="四六级">
          <i class="icon icon-cet">#</i>
          <span class="nav-text sr-only">四六级</span>
        </li>
        <li class="nav-item" @click="handleScrollToSection('postgraduate')" title="考研">
          <i class="icon icon-postgraduate">#</i>
          <span class="nav-text sr-only">考研</span>
        </li>
        <li class="nav-item" @click="handleScrollToSection('ai-tools')" title="AI工具">
          <i class="icon icon-ai">#</i>
          <span class="nav-text sr-only">AI工具</span>
        </li>
        <li class="nav-item" @click="handleScrollToSection('study-plan')" title="学习计划">
          <i class="icon icon-study-plan">#</i>
          <span class="nav-text sr-only">学习计划</span>
        </li>

      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 接收从父组件传入的 scrollToSection 方法
const props = defineProps({
  scrollToSection: {
    type: Function,
    required: false,
    default: null
  }
});

// 使用传入的 scrollToSection 方法或提供默认实现
const handleScrollToSection = (sectionId) => {
  if (props.scrollToSection) {
    props.scrollToSection(sectionId);
  } else {
    // 如果没有传入方法，则尝试使用默认导入
    import('@/hooks/load.js').then(module => {
      module.scrollToSection(sectionId);
    }).catch(() => {
      console.warn(`scrollToSection for ${sectionId} not found`);
    });
  }
};


</script>

<style scoped>
.sidebar {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 80px; /* 减小宽度以适应纯图标布局 */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 99;
  transition: all 0.3s ease;
}

.sidebar:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
}

.nav-item:hover {
  background: rgba(66, 185, 131, 0.2);
  transform: translateX(5px);
}

.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #42b983;
  border-radius: 50%;
  margin-right: 10px;
  font-style: normal;
  font-size: 12px;
  color: white;
}

.icon-cet::before {
  content: "📚";
}

.icon-postgraduate::before {
  content: "🎓";
}

.icon-ai::before {
  content: "🤖";
}

.icon-study-plan::before {
  content: "📅";
}

.icon-personal-tech::before {
  content: "💻";
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}


/* sr-only 类用于屏幕阅读器，保持可访问性 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}



/* 响应式设计 */
@media (max-width: 1200px) {
  .sidebar {
    position: fixed;
    bottom: 20px;
    top: auto;
    right: 50%;
    transform: translateX(50%);
    width: 90px;
    max-width: 90px;
  }
  
  .sidebar:hover {
    width: 90px; /* 不再扩展宽度 */
  }
}
</style>