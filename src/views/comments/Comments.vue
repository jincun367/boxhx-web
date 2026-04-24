<template>
  <div class="comments-page">
    <div class="page-header">
      <h1>评论中心</h1>
      <p>拉动台灯绳开始写评论...</p>
    </div>
    
    <div class="interactive-container">
      <!-- 台灯区域 -->
      <div class="lamp-container">
        <div class="lamp-rope" @mousedown="startDrag" ref="rope"></div>
        <div class="lamp-top"></div>
        <div class="lamp"></div>
        <div class="lamp-bottom"></div>
        <div class="lamp-blub" :class="{ on: isLightOn }" :style="{ backgroundColor: lightColor }" ref="blub"></div>
        <div class="lamp-shadow" :class="{ on: isLightOn }" :style="{ background: shadowGradient }" ref="shadow"></div>
        <div class="lamp-line" :style="{ background: lineGradient }"></div>
        <div class="lamp-line-bottom" :style="{ background: lineBottomGradient }"></div>
      </div>

      <!-- 富文本编辑器区域 -->
      <div class="editor-window" :class="{ show: isLightOn }" :style="editorStyle">
        <h2>写评论</h2>
        <div id="editor-container" class="editor-area"></div>
        <div class="editor-actions">
          <button class="submit-btn" @click="submitComment" :style="{ backgroundColor: lightColor }">
            发表评论
          </button>
          <button class="clear-btn" @click="clearEditor">清空</button>
        </div>
      </div>
    </div>

    <!-- 评论列表区域 -->
    <div class="comments-list" v-if="comments.length > 0">
      <h3>最新评论</h3>
      <div class="comment-item" v-for="comment in comments" :key="comment.id">
        <div class="comment-header">
          <span class="comment-author">{{ comment.author }}</span>
          <span class="comment-time">{{ formatTime(comment.time) }}</span>
        </div>
        <div class="comment-content" v-html="comment.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Boot } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

// 灯光状态
const isLightOn = ref(false)
const isDragging = ref(false)
const hasTriggered = ref(false)
const lightColor = ref('#ffffff')

// DOM 引用
const rope = ref(null)
const blub = ref(null)
const shadow = ref(null)

// 编辑器相关
const editor = ref(null)
const comments = ref([])

// 灯光颜色数组
const lightColors = [
  '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff',
  '#fdffb2', '#ffb2fd', '#b2fdff', '#b2ffb2', '#ffd700'
]

// 计算属性
const shadowGradient = computed(() => {
  return `radial-gradient(circle, ${lightColor.value}80 0%, ${lightColor.value}00 70%)`
})

const lineGradient = computed(() => {
  return `linear-gradient(to bottom, ${lightColor.value}60 0%, ${lightColor.value}30 50%, ${lightColor.value}10 100%)`
})

const lineBottomGradient = computed(() => {
  return `linear-gradient(to bottom, ${lightColor.value}70 0%, ${lightColor.value}40 50%, ${lightColor.value}20 100%)`
})

const editorStyle = computed(() => ({
  border: `1px solid ${lightColor.value}80`,
  boxShadow: `0 0 20px ${lightColor.value}40`
}))

// 开始拖动
const startDrag = (e) => {
  isDragging.value = true
  hasTriggered.value = false
  e.preventDefault()
}

// 鼠标移动处理
const handleMouseMove = (e) => {
  if (!isDragging.value || !rope.value) return

  const rect = rope.value.getBoundingClientRect()
  const mouseY = e.clientY
  const newHeight = mouseY - rect.top
  const initialHeight = 109
  const maxHeight = initialHeight * 1.5

  if (newHeight > initialHeight) {
    const clampedHeight = Math.min(newHeight, maxHeight)
    rope.value.style.height = clampedHeight + 'px'

    if (newHeight > initialHeight + 20 && !hasTriggered.value) {
      toggleLight()
      hasTriggered.value = true
    }
  }
}

// 切换灯光
const toggleLight = () => {
  if (isLightOn.value) {
    // 关闭灯光
    isLightOn.value = false
    rope.value.style.backgroundColor = '#414141'
    rope.value.style.boxShadow = 'none'
  } else {
    // 打开灯光
    const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)]
    lightColor.value = randomColor
    isLightOn.value = true
    rope.value.style.backgroundColor = `${randomColor}80`
    rope.value.style.boxShadow = `0 0 10px ${randomColor}80`
    
    // 灯光打开后初始化编辑器
    if (isLightOn.value && !editor.value) {
      nextTick(() => {
        initEditor()
      })
    }
  }
}

// 鼠标释放
const handleMouseUp = () => {
  if (isDragging.value && rope.value) {
    rope.value.style.transition = 'height 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    rope.value.style.height = '109px'

    setTimeout(() => {
      rope.value.style.transition = 'height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }, 500)

    isDragging.value = false
  }
}

// 初始化富文本编辑器
const initEditor = async () => {
  if (!document.getElementById('editor-container')) return
  
  try {
    // 等待编辑器资源加载完成
    await Boot()
    
    const { createEditor } = await import('@wangeditor/editor')
    
    editor.value = createEditor({
      selector: '#editor-container',
      config: {
        placeholder: '请输入您的评论...',
        readOnly: false,
        autoFocus: true,
        scroll: true,
        MENU_CONF: {}
      }
    })
    
    console.log('编辑器初始化成功', editor.value)
    
    // 激活编辑器，使其可编辑
    setTimeout(() => {
      if (editor.value) {
        editor.value.focus()
      }
    }, 100)
    
  } catch (error) {
    console.error('编辑器初始化失败:', error)
  }
}

// 提交评论
const submitComment = () => {
  if (!editor.value) return
  
  const content = editor.value.getHtml()
  if (!content || content === '<p><br></p>') {
    alert('请输入评论内容')
    return
  }

  const newComment = {
    id: Date.now(),
    author: '用户',
    content: content,
    time: new Date()
  }

  comments.value.unshift(newComment)
  clearEditor()
  alert('评论发表成功！')
}

// 清空编辑器
const clearEditor = () => {
  if (editor.value) {
    editor.value.clear()
  }
}

// 格式化时间
const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 生命周期
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
.comments-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a3a 0%, #0d1520 100%);
  color: #fff;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #42b983, #66d9a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: #a0aec0;
  font-size: 1.1rem;
}

.interactive-container {
  display: flex;
  align-items: stretch;
  gap: 50px;
  justify-content: center;
  margin-bottom: 60px;
}

/* 台灯样式 */
.lamp-container {
  position: relative;
  width: 200px;
  height: 210px;
}

.lamp-rope {
  position: absolute;
  top: 108%;
  left: 25%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 109px;
  background-color: #414141;
  transform-origin: top center;
  z-index: 2;
  transition: height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              background-color 300ms ease, 
              box-shadow 300ms ease;
  cursor: pointer;
}

.lamp-top {
  position: absolute;
  top: 22px;
  left: 20%;
  width: 60%;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(to right, #3b3b3b 0%, #2b2b2b 50%, #212120 100%);
}

.lamp {
  position: absolute;
  top: 30px;
  left: 0;
  -webkit-clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
  height: 150px;
  width: 200px;
  background: linear-gradient(to right, #414141 0%, #2c2c2c 50%, #1c1c1b 100%);
  z-index: 3;
}

.lamp-bottom {
  position: absolute;
  bottom: 22px;
  left: 0;
  width: 100%;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(to right, #040403 0%, #222222 50%, #2c2e21 100%);
}

.lamp-blub {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 130px;
  border-radius: 50% 50% 0 0;
  filter: blur(15px);
  opacity: 0;
  transition: opacity 300ms ease;
  z-index: 5;
}

.lamp-blub.on {
  opacity: 0.8 !important;
}

.lamp-shadow {
  position: absolute;
  top: 140px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 220px;
  background: radial-gradient(circle, rgba(253,255,178,0.3) 0%, rgba(253,255,178,0) 70%);
  opacity: 0;
  transition: opacity 300ms ease;
  z-index: 1;
}

.lamp-shadow.on {
  opacity: 1 !important;
}

.lamp-line {
  position: absolute;
  top: 172px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 172px;
  border-radius: 0 0 3px 3px;
  z-index: 2;
  transition: background 300ms ease;
}

.lamp-line-bottom {
  position: absolute;
  top: 332px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 30px;
  border-radius: 50%;
  box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.5);
  z-index: 1;
  transition: background 300ms ease;
}

/* 编辑器窗口样式 */
.editor-window {
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 30px;
  width: 500px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(20px);
  transition: all 0.5s ease;
}

.editor-window.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

.editor-window h2 {
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
}

.editor-area {
  min-height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.editor-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.submit-btn, .clear-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.submit-btn {
  color: #000000;
}

.submit-btn:hover {
  opacity: 0.9;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.clear-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.clear-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 评论列表样式 */
.comments-list {
  max-width: 800px;
  margin: 0 auto;
}

.comments-list h3 {
  color: #42b983;
  margin-bottom: 20px;
  text-align: center;
}

.comment-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #a0aec0;
  font-size: 0.9rem;
}

.comment-author {
  color: #42b983;
  font-weight: 600;
}

.comment-content {
  line-height: 1.6;
  color: #e2e8f0;
}

.comment-content :deep(p) {
  margin: 0;
}

.comment-content :deep(ul),
.comment-content :deep(ol) {
  margin: 0;
  padding-left: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .interactive-container {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
  
  .editor-window {
    width: 100%;
    max-width: 400px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>