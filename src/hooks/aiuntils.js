import { ref } from 'vue'

// 显式导入所有 AI 工具图片，确保 Vite 打包时包含它们
import ClaudeAn from '@/assets/AIimage/Claude_an.png'
import ClaudeLight from '@/assets/AIimage/Claude_light.png'
import GrokAn from '@/assets/AIimage/Grok_an.png'
import GrokLight from '@/assets/AIimage/Grok_light.png'
import MidjourneyAn from '@/assets/AIimage/Midjourney_an.png'
import MidjourneyLight from '@/assets/AIimage/Midjourney_light.png'
import ChatgptAn from '@/assets/AIimage/chatgpt_an.png'
import ChatgptLight from '@/assets/AIimage/chatgpt_light.png'
import DeepseekAn from '@/assets/AIimage/deepseek_an.png'
import DeepseekLight from '@/assets/AIimage/deepseek_light.png'
import DoubaoAn from '@/assets/AIimage/doubao_an.png'
import DoubaoLight from '@/assets/AIimage/doubao_light.png'
import KimiAn from '@/assets/AIimage/kimi_an.png'
import KimiLight from '@/assets/AIimage/kimi_light.png'
import LingmaAn from '@/assets/AIimage/lingma_an.png'
import LingmaLight from '@/assets/AIimage/lingma_light.png'
import WenxinyiyanAn from '@/assets/AIimage/文心一言_an.png'
import WenxinyiyanLight from '@/assets/AIimage/文心一言_light.png'

// 图片路径映射
export const imageMap = {
  '@/assets/AIimage/Claude_an.png': ClaudeAn,
  '@/assets/AIimage/Claude_light.png': ClaudeLight,
  '@/assets/AIimage/Grok_an.png': GrokAn,
  '@/assets/AIimage/Grok_light.png': GrokLight,
  '@/assets/AIimage/Midjourney_an.png': MidjourneyAn,
  '@/assets/AIimage/Midjourney_light.png': MidjourneyLight,
  '@/assets/AIimage/chatgpt_an.png': ChatgptAn,
  '@/assets/AIimage/chatgpt_light.png': ChatgptLight,
  '@/assets/AIimage/deepseek_an.png': DeepseekAn,
  '@/assets/AIimage/deepseek_light.png': DeepseekLight,
  '@/assets/AIimage/doubao_an.png': DoubaoAn,
  '@/assets/AIimage/doubao_light.png': DoubaoLight,
  '@/assets/AIimage/kimi_an.png': KimiAn,
  '@/assets/AIimage/kimi_light.png': KimiLight,
  '@/assets/AIimage/lingma_an.png': LingmaAn,
  '@/assets/AIimage/lingma_light.png': LingmaLight,
  '@/assets/AIimage/文心一言_an.png': WenxinyiyanAn,
  '@/assets/AIimage/文心一言_light.png': WenxinyiyanLight
}

// 获取当前应该显示的图片路径（带防御性检查）
export const getCurrentImage = (aiTools, hoveredIndex, index) => {
  // 添加防御性检查：确保索引在有效范围内
  if (index < 0 || index >= aiTools.length) {
    return ''
  }

  const path = hoveredIndex === index 
    ? aiTools[index].lightImage 
    : aiTools[index].darkImage
  return imageMap[path] || path
}

// 创建悬停索引的ref
export const useHoveredIndex = () => {
  return ref(-1)
}