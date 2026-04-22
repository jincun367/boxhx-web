import { onMounted, onUnmounted } from 'vue'

/**
 * 图片懒加载指令
 * 使用 Intersection Observer API 实现高性能懒加载
 */

// 全局 Intersection Observer 实例
let observer = null

/**
 * 初始化懒加载观察器
 */
const initLazyObserver = () => {
  if (observer) return observer
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        loadImage(img)
        observer.unobserve(img)
      }
    })
  }, {
    rootMargin: '50px', // 提前 50px 开始加载
    threshold: 0.1      // 10% 可见时触发
  })
  
  return observer
}

/**
 * 加载图片
 */
const loadImage = (img) => {
  const src = img.getAttribute('data-src')
  if (!src) return
  
  // 创建新的 Image 对象预加载
  const image = new Image()
  image.onload = () => {
    img.src = src
    img.classList.add('lazy-loaded')
    img.classList.remove('lazy-loading')
  }
  image.onerror = () => {
    img.classList.add('lazy-error')
    img.classList.remove('lazy-loading')
    console.warn('图片加载失败:', src)
  }
  
  img.classList.add('lazy-loading')
  image.src = src
}

/**
 * Vue 指令定义
 */
export const vLazy = {
  mounted(el, binding) {
    const observer = initLazyObserver()
    
    // 设置占位图
    if (binding.value?.placeholder) {
      el.src = binding.value.placeholder
    }
    
    // 添加懒加载类名
    el.classList.add('lazy-image')
    
    // 开始观察
    observer.observe(el)
  },
  
  unmounted(el) {
    if (observer) {
      observer.unobserve(el)
    }
  }
}

/**
 * 组合式函数 - 在组件中使用
 */
export const useLazyLoad = () => {
  const lazyLoad = (imgElement, options = {}) => {
    const observer = initLazyObserver()
    
    if (options.placeholder && imgElement.src !== options.placeholder) {
      imgElement.src = options.placeholder
    }
    
    imgElement.classList.add('lazy-image')
    observer.observe(imgElement)
    
    // 返回清理函数
    return () => observer.unobserve(imgElement)
  }
  
  return { lazyLoad }
}

/**
 * 手动触发图片加载（用于特殊情况）
 */
export const loadImageManually = (imgElement) => {
  if (imgElement.getAttribute('data-src')) {
    loadImage(imgElement)
  }
}

/**
 * 批量加载可视区域内的所有图片
 */
export const loadVisibleImages = () => {
  const images = document.querySelectorAll('[data-src]')
  images.forEach(img => {
    const rect = img.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      loadImageManually(img)
    }
  })
}

/**
 * 全局样式（可选，可在 CSS 文件中定义）
 */
export const lazyStyles = `
.lazy-image {
  transition: opacity 0.3s ease;
  opacity: 0.7;
}

.lazy-loading {
  opacity: 0.5;
  filter: blur(5px);
}

.lazy-loaded {
  opacity: 1;
  filter: blur(0);
  transition: opacity 0.5s ease, filter 0.5s ease;
}

.lazy-error {
  opacity: 0.3;
  background-color: #f5f5f5;
}
`

/**
 * 默认导出
 */
export default {
  install(app) {
    // 注册全局指令
    app.directive('lazy', vLazy)
    
    // 注入全局方法
    app.config.globalProperties.$lazyLoad = loadImageManually
    app.config.globalProperties.$loadVisibleImages = loadVisibleImages
  },
  
  vLazy,
  useLazyLoad,
  loadImageManually,
  loadVisibleImages
}