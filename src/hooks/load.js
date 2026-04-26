/**
 * 滚动定位工具函数
 * 将指定ID的元素滚动到导航栏正下方
 */

// 缓存上次查询的导航栏元素
let cachedNavbar = null;
let cachedNavbarHeight = null;

/**
 * 获取导航栏高度（带缓存）
 * @returns {number} 导航栏高度（px）
 */
const getNavbarHeight = () => {
  // 如果已有缓存且元素仍然存在，直接返回缓存值
  if (cachedNavbar && document.body.contains(cachedNavbar)) {
    return cachedNavbarHeight || 64;
  }
  
  // 否则重新查询
  cachedNavbar = document.querySelector('.navigation-container');
  
  // 如果导航栏不存在，返回0（适用于没有导航栏的页面）
  if (!cachedNavbar) {
    cachedNavbarHeight = 0;
    return 0;
  }
  
  cachedNavbarHeight = cachedNavbar.offsetHeight;
  return cachedNavbarHeight;
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
  
  // 使用原生 scrollIntoView API
  targetElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};

/**
 * 滚动到指定元素位置（使其顶部距离导航栏底部5px）
 * @param {string} elementId - 目标元素的ID
 */
export const scrollToSectionWithSpacing = (elementId) => {
  if (!elementId) {
    console.warn('scrollToSectionWithSpacing: elementId is required');
    return;
  }
  
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    console.warn(`scrollToSectionWithSpacing: Element with id "${elementId}" not found`);
    return;
  }
  
  // 使用原生 scrollIntoView API
  targetElement.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};

/**
 * 为所有带有data-scroll-to属性的元素添加点击事件监听器
 * 使用方式：在元素上添加 data-scroll-to="section-id" 属性
 */
export const initScrollListeners = () => {
  // 使用事件委托，减少事件监听器的数量
  document.addEventListener('click', (e) => {
    const targetElement = e.target.closest('[data-scroll-to]');
    if (targetElement) {
      e.preventDefault();
      const targetId = targetElement.getAttribute('data-scroll-to');
      if (targetId) {
        scrollToSection(targetId);
      }
    }
  });
};

// 默认导出
export default {
  scrollToSection,
  scrollToSectionWithSpacing,
  initScrollListeners,
  getNavbarHeight
};