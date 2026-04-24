<template>
  <div class="study-plan-container">
    <!-- 表单部分 -->
    <div class="form-section">
      <h3>创建学习计划</h3>
      <el-form :model="formData" label-width="80px" class="study-form">
        <el-form-item label="学习内容">
          <el-input 
            v-model="formData.content" 
            placeholder="请输入学习内容"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="计划用时">
          <el-input 
            v-model="formData.duration" 
            placeholder="例如：2小时 或 30分钟"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="addPlanItem"
            :disabled="!formData.content || !formData.duration"
          >
            添加到计划
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 计划列表预览 -->
    <div class="preview-section" v-if="planItems.length > 0">
      <h3>学习计划预览</h3>
      <div class="plan-list" ref="planListRef">
        <div class="plan-item" v-for="(item, index) in planItems" :key="index">
          <div class="content">{{ item.content }}</div>
          <div class="duration">{{ item.duration }}</div>
          <el-button 
            size="small" 
            type="danger" 
            @click="removePlanItem(index)"
            circle
          >
            ×
          </el-button>
        </div>
      </div>
      
      <!-- 导出按钮 -->
      <div class="export-section">
        <el-button 
          type="success" 
          size="large"
          @click="exportToPDF"
          :loading="isExporting"
        >
          {{ isExporting ? '生成中...' : '导出为PDF' }}
        </el-button>
      </div>
    </div>

    <!-- 空状态提示 -->
    <div v-else class="empty-state">
      <el-empty description="暂无学习计划，请先添加计划项" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ElMessage } from 'element-plus'

// 表单数据
const formData = reactive({
  content: '',
  duration: ''
})

// 计划项列表
const planItems = ref([])

// 导出状态
const isExporting = ref(false)

// 计划列表引用（用于PDF导出）
const planListRef = ref(null)

// 添加计划项
const addPlanItem = () => {
  if (formData.content.trim() && formData.duration.trim()) {
    planItems.value.push({
      content: formData.content.trim(),
      duration: formData.duration.trim()
    })
    // 清空表单
    formData.content = ''
    formData.duration = ''
  }
}

// 删除计划项
const removePlanItem = (index) => {
  planItems.value.splice(index, 1)
}

// 导出为PDF
const exportToPDF = async () => {
  if (planItems.value.length === 0) {
    ElMessage.warning('请先添加学习计划项')
    return
  }

  try {
    isExporting.value = true
    
    // 创建一个临时的预览容器用于PDF生成
    const tempContainer = document.createElement('div')
    tempContainer.style.cssText = `
      padding: 20px;
      font-family: Arial, sans-serif;
      background: white;
      color: black;
      width: 600px;
    `
    
    // 添加标题
    const title = document.createElement('h2')
    title.textContent = '我的学习计划'
    title.style.cssText = 'text-align: center; margin-bottom: 20px; color: #333;'
    tempContainer.appendChild(title)
    
    // 添加计划项
    planItems.value.forEach((item, index) => {
      const itemDiv = document.createElement('div')
      itemDiv.style.cssText = 'margin-bottom: 15px; padding: 10px; border-left: 3px solid #409EFF;'
      
      const contentDiv = document.createElement('div')
      contentDiv.textContent = `${index + 1}. ${item.content}`
      contentDiv.style.cssText = 'font-weight: bold; margin-bottom: 5px;'
      
      const durationDiv = document.createElement('div')
      durationDiv.textContent = `计划用时: ${item.duration}`
      durationDiv.style.cssText = 'color: #666; font-size: 14px;'
      
      itemDiv.appendChild(contentDiv)
      itemDiv.appendChild(durationDiv)
      tempContainer.appendChild(itemDiv)
    })
    
    // 添加生成时间
    const timeDiv = document.createElement('div')
    timeDiv.textContent = `生成时间: ${new Date().toLocaleString('zh-CN')}`
    timeDiv.style.cssText = 'text-align: right; margin-top: 20px; color: #999; font-size: 12px;'
    tempContainer.appendChild(timeDiv)
    
    // 将临时容器添加到body
    document.body.appendChild(tempContainer)
    
    // 使用html2canvas生成图片
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // 提高清晰度
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    
    // 移除临时容器
    document.body.removeChild(tempContainer)
    
    // 创建PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4宽度
    const pageHeight = 295 // A4高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    let heightLeft = imgHeight
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // 如果内容超出一页，添加更多页面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // 下载PDF
    pdf.save(`学习计划_${new Date().getTime()}.pdf`)
    ElMessage.success('PDF导出成功！')
    
  } catch (error) {
    console.error('PDF导出失败:', error)
    ElMessage.error('PDF导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}
</script>

<style scoped>
.study-plan-container {
  width: 100%;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.form-section h3 {
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
}

.study-form {
  max-width: 500px;
  margin: 0 auto;
}

.preview-section {
  margin-top: 20px;
}

.preview-section h3 {
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
}

.plan-list {
  margin-bottom: 20px;
}

.plan-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(66, 185, 131, 0.3);
}

.plan-item .content {
  flex: 1;
  color: #ffffff;
  font-size: 16px;
  margin-right: 15px;
}

.plan-item .duration {
  color: #67c29c;
  font-size: 14px;
  min-width: 80px;
  text-align: right;
}

.export-section {
  text-align: center;
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-state :deep(.el-empty__description) {
  color: #e0f0e0;
}
</style>