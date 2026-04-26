<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <ul class="nav-list">
        <li class="nav-item" @click="handleScrollToSection('cet')" title="四六级">
          <div class="nav-item-content">
            <div class="icon icon-cet"></div>
          </div>
        </li>
        <li class="nav-item" @click="handleScrollToSection('postgraduate')" title="考研">
          <div class="nav-item-content">
            <div class="icon icon-postgraduate"></div>
          </div>
        </li>
        <li class="nav-item" @click="handleScrollToSection('ai-tools')" title="AI工具">
          <div class="nav-item-content">
            <div class="icon icon-ai"></div>
          </div>
        </li>
        <li class="nav-item" @click="handleScrollToSection('study-plan')" title="学习计划">
          <div class="nav-item-content">
            <div class="icon icon-study-plan"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { scrollToSection } from '@/hooks/load.js'

// 接收从父组件传入的 scrollToSection 方法

// 接收从父组件传入的 scrollToSection 方法
const props = defineProps({
  scrollToSection: {
    type: Function,
    required: true
  }
});

// 直接调用传入的函数
const handleScrollToSection = (sectionId) => {
  props.scrollToSection(sectionId);
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  background: linear-gradient(135deg, rgba(30, 40, 50, 0.9), rgba(20, 30, 40, 0.95));
  backdrop-filter: blur(15px);
  border-radius: 80px;
  padding:0 5px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(66, 185, 131, 0.2);
  z-index: 999;
  transition: all 0.3s ease;
}

.sidebar:hover {
  background: linear-gradient(135deg, rgba(30, 40, 50, 0.95), rgba(20, 30, 40, 1));
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(66, 185, 131, 0.4);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}



.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  width: 100%;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:10px 0;
}


.icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.icon-cet {
  background: linear-gradient(135deg, #42b983, #35495e);
  color: white;
}

.icon-postgraduate {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.icon-ai {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
}

.icon-study-plan {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.icon:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.icon-cet::before {
  content: "📚";
}

.icon-postgraduate::before {
  content: "📖";
}

.icon-ai::before {
  content: "🤖";
}

.icon-study-plan::before {
  content: "📅";
}

.nav-item:hover .icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}







@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}



/* 响应式设计 */
@media (max-width: 1200px) {
  .sidebar {
    position: fixed;
    bottom: 30px;
    top: auto;
    right: 50%;
    transform: translateX(50%);
    width: 280px;
    padding: 15px;
    flex-direction: row;
    border-radius: 25px;
  }
  
  .sidebar-content {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
  
  .sidebar-header {
    display: none;
  }
  
  .nav-list {
    flex-direction: row;
    gap: 10px;
  }
  
  .nav-item {
    min-width: 60px;
    border-radius: 50%;
  }
  
  .nav-item-content {
    flex-direction: column;
    gap: 5px;
    text-align: center;
    padding: 15px;
  }
  
  .nav-item:hover {
    transform: scale(1.05);
  }
  

  
  .sidebar:hover {
    width: 280px;
    transform: translateX(50%) scale(1.05);
  }
  
  .sidebar:hover .nav-item {
    transform: none;
  }
  
  .sidebar-footer {
    display: none;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 240px;
    padding: 12px;
  }
  
  .nav-item {
    min-width: 50px;
  }
  
  .nav-item-content {
    padding: 8px 6px;
  }
  
  .icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  

}
</style>