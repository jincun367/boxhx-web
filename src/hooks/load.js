/**
 * 滚动定位工具函数
 * 将指定ID的元素滚动到导航栏正下方
 */

/**
 * 获取导航栏高度
 * @returns {number} 导航栏高度（px）
 */
const getNavbarHeight = () => {
  const navbar = document.querySelector('.navigation-container');
  return navbar ? navbar.offsetHeight : 64; // 默认高度64px
};

/**
 * 滚动到指定元素位置（使其顶部对齐导航栏底部）
 * @param {string} elementId - 目标元素的ID
 */
export const scrollToSection = (elementId) => {
  if (!elementId) {
    console.warn('scrollToSection: elementId is required');
    return;
  }
  
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    console.warn(`scrollToSection: Element with id "${elementId}" not found`);
    return;
  }
  
  // 获取导航栏高度
  const navbarHeight = getNavbarHeight();
  
  // 计算目标位置（元素顶部位置 - 导航栏高度）
  const targetPosition = targetElement.offsetTop - navbarHeight;
  
  // 平滑滚动到目标位置
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
};

/**
 * 为所有带有data-scroll-to属性的元素添加点击事件监听器
 * 使用方式：在元素上添加 data-scroll-to="section-id" 属性
 */
export const initScrollListeners = () => {
  const scrollElements = document.querySelectorAll('[data-scroll-to]');
  
  scrollElements.forEach(element => {
    const targetId = element.getAttribute('data-scroll-to');
    if (targetId) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection(targetId);
      });
    }
  });
};

// 默认导出
export default {
  scrollToSection,
  initScrollListeners,
  getNavbarHeight
};