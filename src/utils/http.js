import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

// 创建 axios 实例
const http = axios.create({
  // 基础 URL，根据环境变量配置
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // 请求超时时间
  timeout: 10000,
  
  // 请求头配置
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  
  // 跨域请求时是否携带凭证
  withCredentials: false,
  
  // 响应数据类型
  responseType: 'json'
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    
    // 添加 token 到请求头
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    // 显示加载提示（可选）
    if (config.showLoading !== false) {
      // 可以在这里添加全局 loading 状态
    }
    
    console.log(`🚀 发送请求: ${config.method?.toUpperCase()} ${config.url}`)
    
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('❌ 请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数
    
    const { data, config } = response
    
    console.log(`✅ 请求成功: ${config.method?.toUpperCase()} ${config.url}`, data)
    
    // 根据后端返回的数据结构进行处理
    // 假设后端返回格式为 { code: number, data: any, message: string }
    if (data && typeof data === 'object') {
      // 业务成功
      if (data.code === 200 || data.code === 0) {
        return data.data !== undefined ? data.data : data
      }
      
      // 业务错误处理
      if (data.code === 401) {
        // 未授权，跳转到登录页
        ElMessageBox.confirm('登录已过期，请重新登录', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')
          window.location.href = '/login'
        })
        return Promise.reject(new Error(data.message || '未授权'))
      }
      
      if (data.code === 403) {
        ElMessage.error(data.message || '权限不足')
        return Promise.reject(new Error(data.message || '权限不足'))
      }
      
      // 其他业务错误
      if (data.code && data.code !== 200 && data.code !== 0) {
        ElMessage.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message || '请求失败'))
      }
    }
    
    return data
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    
    const { config, response } = error
    
    console.error(`❌ 请求失败: ${config?.method?.toUpperCase()} ${config?.url}`, error)
    
    if (response) {
      // 服务器返回了响应，但状态码不在 2xx 范围内
      const { status, data } = response
      
      switch (status) {
        case 400:
          ElMessage.error(data?.message || '请求参数错误')
          break
        case 401:
          ElMessage.error('未授权，请重新登录')
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('权限不足')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        case 502:
          ElMessage.error('网关错误')
          break
        case 503:
          ElMessage.error('服务不可用')
          break
        case 504:
          ElMessage.error('网关超时')
          break
        default:
          ElMessage.error(data?.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        ElMessage.error('请求超时，请检查网络连接')
      } else {
        ElMessage.error('网络错误，请检查网络连接')
      }
    } else {
      // 发送请求时发生了某些错误
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

// 封装常用的请求方法
const httpUtil = {
  // GET 请求
  get(url, params = {}, config = {}) {
    return http.get(url, { ...config, params })
  },
  
  // POST 请求
  post(url, data = {}, config = {}) {
    return http.post(url, data, config)
  },
  
  // PUT 请求
  put(url, data = {}, config = {}) {
    return http.put(url, data, config)
  },
  
  // DELETE 请求
  delete(url, params = {}, config = {}) {
    return http.delete(url, { ...config, params })
  },
  
  // PATCH 请求
  patch(url, data = {}, config = {}) {
    return http.patch(url, data, config)
  },
  
  // 上传文件
  upload(url, formData, config = {}) {
    return http.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      }
    })
  },
  
  // 下载文件
  download(url, params = {}, filename = 'download') {
    return http.get(url, {
      params,
      responseType: 'blob'
    }).then(response => {
      // 创建 blob 链接并下载
      const blob = new Blob([response])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    })
  }
}

// 设置 token
const setToken = (token, persistent = true) => {
  if (persistent) {
    localStorage.setItem('token', token)
  } else {
    sessionStorage.setItem('token', token)
  }
}

// 清除 token
const clearToken = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

// 获取 token
const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

// 导出默认实例和工具方法
export default http
export { httpUtil, setToken, clearToken, getToken }

// 使用示例：
/*
import http, { httpUtil } from '@/utils/http'

// 使用默认实例
http.get('/user/info')

// 使用工具方法
httpUtil.get('/user/list', { page: 1, size: 10 })
httpUtil.post('/user/login', { username: 'admin', password: '123456' })

// 设置 token
import { setToken } from '@/utils/http'
setToken('your-jwt-token')
*/