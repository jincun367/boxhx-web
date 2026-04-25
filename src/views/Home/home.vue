<template>
  <div class="slide-container">
    <!-- ====== Slide 1: 标题页 ====== -->
    <div class="slide bg-1 active" id="s0">
      <div class="deco deco-pink" style="width:500px;height:500px;top:-200px;right:-150px"></div>
      <div class="deco deco-amber" style="width:400px;height:400px;bottom:-120px;left:-120px"></div>

      <div class="anim era-badge" style="background:rgba(255,105,135,.08);color:#E8395B;">
        <span class="lc lc-32 c-rose"><i data-lucide="calendar"></i></span> 2026 年初
      </div>

      <div class="anim" style="margin-top:20px">
        <span class="concept-word">慧学教育</span>
      </div>

      <div class="anim t-huge c-dark" style="margin-top:12px;letter-spacing:8px">
        慧 学 教 育 <span style="font-size:1.8rem;color:#FF6987">(｡･ω･｡)ﾉ</span>
      </div>

      <div class="anim line"></div>
      <div class="anim t-mid c-gray italic">智慧学习 · 成就未来 ✧</div>
    </div>

    <!-- ====== Slide 2: 学习资源中心 ====== -->
    <div class="slide bg-3" id="s1">
      <div class="deco deco-peach" style="width:450px;height:450px;top:-150px;left:-120px"></div>

      <div class="anim t-mid c-gray">优质学习资源 (｀・ω・´)</div>
      <div class="anim line" style="background:linear-gradient(90deg,#FF8C42,#D97706)"></div>

      <div class="spread-row">
        <div v-for="card in studyCards" :key="card.id" class="spread-node" :style="{ background: `linear-gradient(135deg, #1A1932 0%, ${getGradientColor(card.id)})` }">
          <div class="t-big c-white">{{ card.icon }}</div>
          <div class="t-mid c-white bold">{{ card.title }}</div>
          <div class="t-sm c-gray">{{ card.desc }}</div>
        </div>
      </div>
    </div>

    <!-- ====== Slide 3: AI智能工具 ====== -->
    <div class="slide bg-2" id="s2">
      <div class="deco deco-rose"
        style="width:600px;height:600px;top:50%;left:50%;margin-top:-300px;margin-left:-300px"></div>

      <div class="anim t-mid c-gray italic">AI智能辅助工具 (｀・ω・´)</div>
      <div class="anim line" style="background:linear-gradient(90deg,#9B59B6,#E8395B)"></div>

      <div class="grid-row">
        <div 
          v-for="(tool, index) in aiTools" 
          :key="tool.id" 
          class="grid-node" 
          style="background:rgba(26, 25, 50, .6); padding: 20px; border-radius: 16px; text-align: center;"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = -1"
        >
          <img 
            :src="handleGetCurrentImage(index)" 
            :alt="tool.name" 
            style="width: 60px; height: 60px; margin-bottom: 12px;" 
            loading="lazy"
          />
          <div class="t-mid c-white bold">{{ tool.name }}</div>
        </div>
      </div>
    </div>

    <!-- ====== Slide 4: 四六级真题资源 ====== -->
    <div class="slide bg-4" id="s3">
      <div class="deco deco-lav" style="width:500px;height:500px;bottom:-180px;right:-150px"></div>

      <div class="anim t-mid c-gray italic">四六级真题资源 (｀・ω・´)</div>
      <div class="anim line" style="background:linear-gradient(90deg,#9B59B6,#E8395B)"></div>

      <div class="anim timeline">
        <div v-for="item in Cettext.slice(0, 3)" :key="item.id" class="tl-item">
          <div class="tl-dot" :style="{ borderColor: getLineColor(item.id) }"></div>
          <div class="tl-label" :class="getLabelClass(item.id)">{{ item.subtitle }}</div>
          <div class="tl-text">{{ item.title }}</div>
          <div class="t-sm c-gray" style="margin-top: 4px;">{{ item.description.split('\\n')[0] }}</div>
          <div style="margin-top: 8px; display: flex; gap: 12px;">
            <a :href="item.link" target="_blank" class="era-badge" style="background:rgba(255,77,141,.15);color:#FF4D8D; font-size:1.2rem; padding: 6px 16px;">
              {{ item.buttonText }}
            </a>
            <a :href="item.answer" target="_blank" class="era-badge" style="background:rgba(6,214,160,.15);color:#06D6A0; font-size:1.2rem; padding: 6px 16px;">
              {{ item.answerText }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ====== Slide 5: 总结 ====== -->
    <div class="slide bg-6" id="s5">
      <div class="deco deco-pink" style="width:450px;height:450px;top:-150px;right:-120px"></div>

      <div class="anim t-huge c-dark">慧学教育的核心价值 (｡･ω･｡)ﾉ</div>
      <div class="anim line" style="background:linear-gradient(90deg,#FF6987,#059669)"></div>

      <div class="anim" style="margin: 30px 0;">
        <svg width="700" height="120" viewBox="0 0 700 120">
          <defs>
            <marker id="ar1" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0,10 3.5,0 7" fill="#FF4D8D" />
            </marker>
          </defs>
          <!-- 学习需求 -->
          <rect x="10" y="25" width="160" height="70" rx="16" fill="rgba(255,77,141,.15)" stroke="#FF4D8D"
            stroke-width="2" />
          <text x="90" y="55" text-anchor="middle" fill="#FF4D8D" font-size="15" font-weight="800">学习需求</text>
          <text x="90" y="75" text-anchor="middle" fill="#FF8FA5" font-size="12" font-weight="600">明确目标</text>
          <!-- 箭头 -->
          <line x1="175" y1="60" x2="245" y2="60" stroke="#FF4D8D" stroke-width="3" marker-end="url(#ar1)" />
          <!-- 智能匹配 -->
          <rect x="252" y="25" width="190" height="70" rx="16" fill="rgba(255,45,110,.15)" stroke="#FF2D6E"
            stroke-width="2" />
          <text x="347" y="55" text-anchor="middle" fill="#FF2D6E" font-size="15"
            font-weight="800">智能匹配资源</text>
          <text x="347" y="75" text-anchor="middle" fill="#FF8FA5" font-size="12"
            font-weight="600">个性化推荐</text>
          <!-- 箭头 -->
          <line x1="447" y1="60" x2="507" y2="60" stroke="#FF4D8D" stroke-width="3" marker-end="url(#ar1)" />
          <!-- 成功达成 -->
          <rect x="514" y="25" width="170" height="70" rx="16" fill="rgba(6,214,160,.15)" stroke="#06D6A0"
            stroke-width="2" />
          <text x="599" y="55" text-anchor="middle" fill="#06D6A0" font-size="15"
            font-weight="800">成功达成</text>
          <text x="599" y="75" text-anchor="middle" fill="#5CC9B6" font-size="12"
            font-weight="600">实现学习目标</text>
        </svg>
      </div>

      <div class="anim t-big c-dark" style="margin-top:16px">
        让学习<span class="bg-rose c-rose bold" style="font-size:3.4rem">更高效</span> (｡･ω･｡)ﾉ
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import initJson from '@/resource/init.json'
import { imageMap, getCurrentImage, useHoveredIndex } from '@/hooks/aiuntils.js'

// 导入lucide图标库
const lucide = {
  createIcons: () => {},
  icons: {}
}

// 数据初始化
const Cettext = ref(initJson.Cettext)
const studyCards = ref(initJson.studyCards)
const aiTools = ref(initJson.aiTools)

// 颜色映射函数
const getGradientColor = (id) => {
  const colors = ['#FF4D8D', '#FF8FA5', '#C77DFF', '#FFB347', '#06D6A0']
  return colors[(id - 1) % colors.length]
}

const getLineColor = (id) => {
  const colors = ['#FF4D8D', '#FF8FA5', '#C77DFF']
  return colors[(id - 1) % colors.length]
}

const getLabelClass = (id) => {
  const classes = ['c-pink', 'c-orange', 'c-purple']
  return classes[(id - 1) % classes.length]
}

// 修复图片路径问题
const getAssetUrl = (path) => {
  // 将 '@/assets/AIimage/...' 转换为正确的public路径
  return path.replace('@/', '/').replace('assets/', 'AIimage/');
}

// 幻灯片控制
const slides = ref([])
const total = ref(0)
let cur = 0

const go = (n) => {
  if (n < 0 || n >= total.value || n === cur) return
  // 移除当前激活状态
  slides.value[cur]?.classList.remove('active')
  // 添加新激活状态
  cur = n
  nextTick(() => {
    slides.value[cur]?.classList.add('active')
    // 触发动画
    slides.value[cur]?.querySelectorAll('.anim').forEach((e, i) => {
      e.classList.remove('show')
      setTimeout(() => e.classList.add('show'), 200 + i * 300)
    })
  })
}

onMounted(() => {
  // 初始化幻灯片引用
  slides.value = document.querySelectorAll('.slide')
  total.value = slides.value.length

  // 初始动画
  slides.value[0]?.querySelectorAll('.anim').forEach((e, i) => {
    setTimeout(() => e.classList.add('show'), 400 + i * 350)
  })

  // 键盘事件监听
  document.addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) { 
      e.preventDefault(); go(cur + 1) 
    }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { 
      e.preventDefault(); go(cur - 1) 
    }
    else if (e.key === 'Home') { 
      e.preventDefault(); go(0) 
    }
    else if (e.key === 'End') { 
      e.preventDefault(); go(total.value - 1) 
    }
  })

  // 触摸事件
  let tx = 0, ty = 0
  document.addEventListener('touchstart', e => { 
    tx = e.changedTouches[0].screenX; 
    ty = e.changedTouches[0].screenY 
  })
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - tx, dy = e.changedTouches[0].screenY - ty
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) { 
      dx < 0 ? go(cur + 1) : go(cur - 1) 
    }
  })

  // 滚轮事件
  let wc = false
  document.addEventListener('wheel', e => {
    if (wc) return; 
    wc = true; 
    setTimeout(() => wc = false, 800)
    e.deltaY > 0 ? go(cur + 1) : go(cur - 1)
  })
})

// Vue nextTick
const nextTick = (fn) => {
  Promise.resolve().then(fn)
}

// 当前悬停的图片索引
const hoveredIndex = useHoveredIndex()

// 修复索引越界问题并调用公共函数
const handleGetCurrentImage = (index) => {
  // 添加防御性检查：确保索引在有效范围内
  if (index < 0 || index >= aiTools.value.length) {
    return ''
  }

  return getCurrentImage(aiTools.value, hoveredIndex.value, index, imageMap)
}

</script>

<style scoped>
@import url('@/styles/common.scss');

.slide-container {
  width: 100vw;
  height: calc(100vh - 64px);
  position: relative;
  overflow: hidden;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  padding: 50px 80px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .6s ease;
}

.slide.active {
  opacity: 1;
  pointer-events: auto;
}

.slide .anim {
  opacity: 0;
  transition: none;
}

.slide.active .anim.show {
  opacity: 1;
  transform: translateY(0);
  transition: opacity .7s cubic-bezier(.25, .46, .45, .94), transform .7s cubic-bezier(.25, .46, .45, .94);
}

.deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.deco-pink {
  background: radial-gradient(circle, rgba(255, 77, 141, .15), transparent);
}

.deco-peach {
  background: radial-gradient(circle, rgba(255, 143, 165, .12), transparent);
}

.deco-lav {
  background: radial-gradient(circle, rgba(200, 100, 255, .1), transparent);
}

.deco-amber {
  background: radial-gradient(circle, rgba(255, 180, 100, .1), transparent);
}

.deco-rose {
  background: radial-gradient(circle, rgba(255, 50, 100, .12), transparent);
}

.t-hero {
  font-size: 5.5rem;
  font-weight: 900;
  line-height: 1.15;
  text-align: center;
}

.t-huge {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
}

.t-big {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.3;
  text-align: center;
}

.t-mid {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
}

.t-body {
  font-size: 1.7rem;
  font-weight: 400;
  line-height: 1.6;
  text-align: center;
}

.t-sm {
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
}

.c-pink { color: #FF4D8D; }
.c-rose { color: #FF2D6E; }
.c-orange { color: #FF8FA5; }
.c-purple { color: #C77DFF; }
.c-teal { color: #FF6B9D; }
.c-blue { color: #FF8FA5; }
.c-dark { color: #FFFFFE; }
.c-gray { color: #A7A9BE; }
.c-white { color: #fff; }
.c-amber { color: #FFB347; }
.c-indigo { color: #C77DFF; }
.c-emerald { color: #06D6A0; }
.c-red { color: #FF2D6E; }

.bg-pink {
  background: rgba(255, 77, 141, .15);
  padding: 6px 20px;
  border-radius: 10px;
}

.bg-rose {
  background: rgba(255, 45, 110, .15);
  padding: 6px 20px;
  border-radius: 10px;
}

.bg-peach {
  background: rgba(255, 143, 165, .12);
  padding: 6px 20px;
  border-radius: 10px;
}

.bg-teal {
  background: rgba(255, 107, 157, .12);
  padding: 6px 20px;
  border-radius: 10px;
}

.bg-purple {
  background: rgba(199, 125, 255, .12);
  padding: 6px 20px;
  border-radius: 10px;
}

.bg-amber {
  background: rgba(255, 179, 71, .12);
  padding: 6px 20px;
  border-radius: 10px;
}

.bg-emerald {
  background: rgba(6, 214, 160, .12);
  padding: 6px 20px;
  border-radius: 10px;
}

.ul-rose {
  text-decoration: underline;
  text-decoration-color: #FF2D6E;
  text-decoration-thickness: 4px;
  text-underline-offset: 8px;
}

.ul-pink {
  text-decoration: underline;
  text-decoration-color: #FF4D8D;
  text-decoration-thickness: 4px;
  text-underline-offset: 8px;
}

.ul-amber {
  text-decoration: underline;
  text-decoration-color: #FFB347;
  text-decoration-thickness: 4px;
  text-underline-offset: 8px;
}

.ul-teal {
  text-decoration: underline;
  text-decoration-color: #FF6B9D;
  text-decoration-thickness: 4px;
  text-underline-offset: 8px;
}

.bold { font-weight: 900; }
.italic { font-style: italic; }

.line {
  width: 70px;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #FF4D8D, #FF8FA5);
  margin: 18px auto;
}

.bg-1 { background: radial-gradient(ellipse at 50% 30%, #1A1932 0%, #0F0E17 100%); }
.bg-2 { background: radial-gradient(ellipse at 30% 20%, #1A1932 0%, #0F0E17 100%); }
.bg-3 { background: radial-gradient(ellipse at 70% 80%, #1A1932 0%, #0F0E17 100%); }
.bg-4 { background: radial-gradient(ellipse at 50% 50%, #1A1932 0%, #0F0E17 100%); }
.bg-5 { background: radial-gradient(ellipse at 50% 70%, #1A1932 0%, #0F0E17 100%); }
.bg-6 { background: radial-gradient(ellipse at 50% 80%, #1A1932 0%, #0F0E17 100%); }

.era-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 28px;
  border-radius: 40px;
  font-size: 1.8rem;
  font-weight: 800;
}

.concept-word {
  font-size: 5rem;
  font-weight: 900;
  letter-spacing: 6px;
  background: linear-gradient(135deg, #FF4D8D, #FF8FA5, #C77DFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 引用卡片 */
.quote-card {
  background: rgba(26, 25, 50, .6);
  border-radius: 24px;
  padding: 40px 48px;
  border: 2px solid rgba(255, 77, 141, .15);
  box-shadow: 0 8px 40px rgba(255, 77, 141, .1);
  max-width: 950px;
  width: 90%;
  position: relative;
}

.quote-mark {
  position: absolute;
  top: -18px;
  left: 30px;
  font-size: 5rem;
  font-weight: 900;
  color: rgba(255, 77, 141, .2);
  line-height: 1;
  font-family: Georgia, serif;
}

/* 人物卡片 */
.person-card {
  display: flex;
  align-items: center;
  gap: 28px;
  background: rgba(26, 25, 50, .6);
  border-radius: 20px;
  padding: 28px 36px;
  border: 2px solid rgba(255, 77, 141, .15);
  box-shadow: 0 6px 24px rgba(255, 77, 141, .08);
  max-width: 800px;
  width: 85%;
}

.person-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.person-info {
  text-align: left;
}

/* 时间线 */
timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 85%;
  max-width: 800px;
  position: relative;
  padding-left: 60px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 24px;
  top: 10px;
  bottom: 10px;
  width: 3px;
  background: linear-gradient(180deg, #FF4D8D, #FFB347, #06D6A0);
  border-radius: 2px;
}

.tl-item {
  position: relative;
  padding: 16px 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tl-dot {
  position: absolute;
  left: -44px;
  top: 22px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 3px solid;
  background: #0F0E17;
}

.tl-label {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.tl-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFFFFE;
}

/* 火焰扩散图 */
.spread-row {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.spread-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-radius: 16px;
  min-width: 110px;
}

/* AI工具网格布局 */
.grid-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 80%;
  max-width: 800px;
}

.grid-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border-radius: 16px;
  background: rgba(26, 25, 50, .6);
  text-align: center;
}
</style>