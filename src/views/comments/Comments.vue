<template>
  <div class="comments-page">
    <div class="page-header">
      <h1>评论中心</h1>
      <p>拉动台灯绳（任意方向）开始写评论...</p>
    </div>
    
    <div class="interactive-container">
      <!-- 台灯区域（位于左侧） -->
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
      <div class="editor-window" v-if="isLightOn" :style="editorStyle">
        <h2>写评论</h2>
        <div id="toolbar-container" class="toolbar-container"></div>
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
import { createEditor, createToolbar } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

// 灯光状态
const isLightOn = ref(false)
const isDragging = ref(false)
const hasTriggered = ref(false)
const lightColor = ref('#ffffff')

// DOM 引用
const rope = ref(null)

// 编辑器实例
let editorInstance = null
let toolbarInstance = null

// 评论数据
const comments = ref([])

// 拖动起始点（用于任意方向触发）
let dragStartX = 0
let dragStartY = 0

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

// 初始化编辑器
const initEditor = () => {
  if (editorInstance) return

  const editorContainer = document.getElementById('editor-container')
  const toolbarContainer = document.getElementById('toolbar-container')
  
  if (!editorContainer || !toolbarContainer) {
    console.error('编辑器容器未找到')
    return
  }

  try {
    editorInstance = createEditor({
      selector: '#editor-container',
      config: {
        placeholder: '请输入您的评论...',
        autoFocus: true,
        scroll: true,
        MENU_CONF: {}
      }
    })
    
    toolbarInstance = createToolbar({
      editor: editorInstance,
      selector: '#toolbar-container',
      config: {}
    })
    
    console.log('编辑器初始化成功')
    setTimeout(() => editorInstance.focus(), 100)
  } catch (error) {
    console.error('编辑器初始化失败:', error)
  }
}

const destroyEditor = () => {
  if (toolbarInstance) {
    toolbarInstance.destroy()
    toolbarInstance = null
  }
  if (editorInstance) {
    editorInstance.destroy()
    editorInstance = null
  }
}

// 切换灯光
const toggleLight = () => {
  if (isLightOn.value) {
    isLightOn.value = false
    destroyEditor()
    if (rope.value) {
      rope.value.style.backgroundColor = '#414141'
      rope.value.style.boxShadow = 'none'
    }
  } else {
    const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)]
    lightColor.value = randomColor
    isLightOn.value = true
    
    if (rope.value) {
      rope.value.style.backgroundColor = `${randomColor}80`
      rope.value.style.boxShadow = `0 0 10px ${randomColor}80`
    }
    
    nextTick(() => {
      initEditor()
    })
  }
}

// 开始拖动：记录起始位置，重置触发标志
const startDrag = (e) => {
  isDragging.value = true
  hasTriggered.value = false
  dragStartX = e.clientX
  dragStartY = e.clientY
  e.preventDefault()
}

// 鼠标移动：判断任意方向移动距离，同时保留向下拉绳子变长的效果
const handleMouseMove = (e) => {
  if (!isDragging.value || !rope.value) return

  // 计算移动距离（欧几里得距离）
  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  const distance = Math.hypot(dx, dy)
  const threshold = 15 // 移动超过15px即触发开灯

  // 任意方向移动超过阈值且尚未触发 -> 开灯
  if (distance > threshold && !hasTriggered.value) {
    toggleLight()
    hasTriggered.value = true
  }

  // 保留原有体验：仅当向下拉（dy > 0）时，绳子变长
  if (dy > 0) {
    const rect = rope.value.getBoundingClientRect()
    const initialHeight = 109
    const newHeight = initialHeight + dy
    const maxHeight = initialHeight * 1.5
    const clampedHeight = Math.min(newHeight, maxHeight)
    if (clampedHeight > initialHeight) {
      rope.value.style.height = clampedHeight + 'px'
    }
  }
}

const handleMouseUp = () => {
  if (isDragging.value && rope.value) {
    // 绳子回弹动画
    rope.value.style.transition = 'height 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    rope.value.style.height = '109px'

    setTimeout(() => {
      if (rope.value) rope.value.style.transition = 'height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }, 500)

    isDragging.value = false
  }
}

// 提交评论
const submitComment = () => {
  if (!editorInstance) {
    alert('编辑器尚未初始化，请稍后再试')
    return
  }
  
  const content = editorInstance.getHtml()
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

const clearEditor = () => {
  if (editorInstance) {
    editorInstance.clear()
    editorInstance.focus()
  }
}

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
  destroyEditor()
})
</script>
<style scoped>
.comments-page { min-height: 100vh; background: linear-gradient(135deg, #1a2a3a 0%, #0d1520 100%); color: #fff; padding: 40px 20px; }
.page-header { text-align: center; margin-bottom: 40px; }
.page-header h1 { font-size: 2.5rem; margin-bottom: 10px; background: linear-gradient(45deg, #42b983, #66d9a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.page-header p { color: #a0aec0; font-size: 1.1rem; }

/* ===== 修改点 1：增加 min-height ===== */
.interactive-container {
  display: flex;
  align-items: stretch;
  gap: 50px;
  justify-content: center;
  margin-bottom: 60px;
  min-height: 360px;   /* 保证收起编辑器后仍有高度，防止评论区上移重叠 */
}
.lamp-container { position: relative; width: 200px; height: 210px; flex-shrink: 0; }
.lamp-rope { position: absolute; top: 108%; left: 25%; transform: translate(-50%, -50%); width: 2px; height: 109px; background-color: #414141; transform-origin: top center; z-index: 2; transition: height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 300ms ease, box-shadow 300ms ease; cursor: pointer; }
.lamp-rope::before { content: ''; position: absolute; top: 0; left: -9px; width: 20px; height: 100%; background: transparent; cursor: pointer; z-index: 10; }
.lamp-top { position: absolute; top: 22px; left: 20%; width: 60%; height: 16px; border-radius: 50%; background: linear-gradient(to right, #3b3b3b 0%, #2b2b2b 50%, #212120 100%); }
.lamp { position: absolute; top: 30px; left: 0; clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%); height: 150px; width: 200px; background: linear-gradient(to right, #414141 0%, #2c2c2c 50%, #1c1c1b 100%); z-index: 3; }
.lamp-bottom { position: absolute; bottom: 22px; left: 0; width: 100%; height: 16px; border-radius: 50%; background: linear-gradient(to right, #040403 0%, #222222 50%, #2c2e21 100%); }
.lamp-blub { position: absolute; top: 40px; left: 50%; transform: translateX(-50%); width: 160px; height: 130px; border-radius: 50% 50% 0 0; filter: blur(15px); opacity: 0; transition: opacity 300ms ease; z-index: 5; }
.lamp-blub.on { opacity: 0.8 !important; }
.lamp-shadow { position: absolute; top: 140px; left: 50%; transform: translateX(-50%); width: 300px; height: 220px; background: radial-gradient(circle, rgba(253,255,178,0.3) 0%, rgba(253,255,178,0) 70%); opacity: 0; transition: opacity 300ms ease; z-index: 1; }
.lamp-shadow.on { opacity: 1 !important; }
.lamp-line { position: absolute; top: 172px; left: 50%; transform: translateX(-50%); width: 18px; height: 172px; border-radius: 0 0 3px 3px; z-index: 2; transition: background 300ms ease; }
.lamp-line-bottom { position: absolute; top: 332px; left: 50%; transform: translateX(-50%); width: 140px; height: 30px; border-radius: 50%; box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.5); z-index: 1; transition: background 300ms ease; }
.editor-window { background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(10px); border-radius: 12px; padding: 24px; width: 550px; transition: border 0.3s ease, box-shadow 0.3s ease; }
.editor-window h2 { color: #ffffff; text-align: center; margin-bottom: 20px; font-family: Arial, sans-serif; }
.toolbar-container { background-color: rgba(255, 255, 255, 0.05); border-radius: 6px 6px 0 0; border-bottom: 1px solid rgba(255, 255, 255, 0.2); margin-bottom: 0; }
.editor-area { min-height: 200px; background: rgba(255, 255, 255, 0.05); border-radius: 0 0 6px 6px; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.2); border-top: none; }
.editor-actions { display: flex; gap: 15px; justify-content: center; }
.submit-btn, .clear-btn { padding: 12px 24px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.3s ease; font-weight: bold; }
.submit-btn { color: #000000; }
.submit-btn:hover { opacity: 0.9; box-shadow: 0 0 15px rgba(255, 255, 255, 0.5); }
.clear-btn { background-color: rgba(255, 255, 255, 0.1); color: #ffffff; }
.clear-btn:hover { background-color: rgba(255, 255, 255, 0.2); }

/* ===== 修改点 2：增加评论列表的上边距 ===== */
.comments-list {
  max-width: 800px;
  margin: 80px auto 0 auto;  /* 原为 0 auto，现添加上边距 80px */
}

.comments-list h3 { color: #42b983; margin-bottom: 20px; text-align: center; }
.comment-item { background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 20px; margin-bottom: 15px; border: 1px solid rgba(255, 255, 255, 0.1); }
.comment-header { display: flex; justify-content: space-between; margin-bottom: 10px; color: #a0aec0; font-size: 0.9rem; }
.comment-author { color: #42b983; font-weight: 600; }
.comment-content { line-height: 1.6; color: #e2e8f0; }
.comment-content :deep(p) { margin: 0; }
.comment-content :deep(ul), .comment-content :deep(ol) { margin: 0; padding-left: 20px; }

@media (max-width: 768px) {
  .interactive-container {
    flex-direction: column;
    align-items: center;
    gap: 30px;
    padding-left: 0;
    min-height: auto;  /* 移动端无需固定高度，靠下边距即可 */
  }
  .lamp-container { margin-left: 0; }
  .editor-window { width: 100%; max-width: 400px; }
  .page-header h1 { font-size: 2rem; }
  .comments-list {
    margin-top: 40px;  /* 移动端适当减小上边距 */
  }
}
</style>