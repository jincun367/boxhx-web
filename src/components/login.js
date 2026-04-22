import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 登录模块 - 提供登录和注册相关的业务逻辑
 */

export const useLogin = () => {
  // 响应式数据
  const showLogin = ref(true)
  const formLabelWidth = ref('80px')
  const loading = ref(false)
  
  // 登录表单数据
  const loginForm = reactive({
    username: '',
    password: ''
  })

  // 注册表单数据
  const registerForm = reactive({
    username: '',
    password: '',
    confirmPassword: ''
  })

  // 表单验证规则
  const loginRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ]
  }

  const registerRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== registerForm.password) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ]
  }

  /**
   * 切换登录/注册模式
   */
  const toggleToRegister = () => {
    showLogin.value = !showLogin.value
    // 清空表单数据
    if (showLogin.value) {
      Object.assign(registerForm, {
        username: '',
        password: '',
        confirmPassword: ''
      })
    } else {
      Object.assign(loginForm, {
        username: '',
        password: ''
      })
    }
  }

  /**
   * 处理登录
   */
  const handleLogin = async () => {
    try {
      loading.value = true
      
      // 表单验证
      if (!loginForm.username.trim()) {
        ElMessage.error('请输入用户名')
        return
      }
      if (!loginForm.password.trim()) {
        ElMessage.error('请输入密码')
        return
      }

      console.log('登录表单数据:', loginForm)
      
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 这里应该是实际的登录 API 调用
      // const response = await loginApi(loginForm)
      
      ElMessage.success('登录成功')
      
      // 登录成功后的处理，比如跳转到首页
      // router.push('/')
      
    } catch (error) {
      console.error('登录失败:', error)
      ElMessage.error('登录失败，请检查用户名和密码')
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理注册
   */
  const handleRegister = async () => {
    try {
      loading.value = true
      
      // 表单验证
      if (!registerForm.username.trim()) {
        ElMessage.error('请输入用户名')
        return
      }
      if (!registerForm.password.trim()) {
        ElMessage.error('请输入密码')
        return
      }
      if (!registerForm.confirmPassword.trim()) {
        ElMessage.error('请确认密码')
        return
      }
      if (registerForm.password !== registerForm.confirmPassword) {
        ElMessage.error('两次输入密码不一致')
        return
      }

      console.log('注册表单数据:', registerForm)
      
      // 模拟注册请求
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 这里应该是实际的注册 API 调用
      // const response = await registerApi(registerForm)
      
      ElMessage.success('注册成功')
      
      // 注册成功后切换到登录模式
      showLogin.value = true
      Object.assign(loginForm, {
        username: registerForm.username,
        password: ''
      })
      
    } catch (error) {
      console.error('注册失败:', error)
      ElMessage.error('注册失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置表单
   */
  const resetForm = (formType) => {
    if (formType === 'login') {
      Object.assign(loginForm, {
        username: '',
        password: ''
      })
    } else {
      Object.assign(registerForm, {
        username: '',
        password: '',
        confirmPassword: ''
      })
    }
  }

  return {
    // 状态数据
    showLogin,
    formLabelWidth,
    loading,
    
    // 表单数据
    loginForm,
    registerForm,
    
    // 验证规则
    loginRules,
    registerRules,
    
    // 方法
    toggleToRegister,
    handleLogin,
    handleRegister,
    resetForm
  }
}

/**
 * 模拟登录 API
 */
export const loginApi = async (credentials) => {
  // 模拟 API 调用
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟登录逻辑
      if (credentials.username === 'admin' && credentials.password === '123456') {
        resolve({
          success: true,
          data: {
            token: 'mock-jwt-token',
            userInfo: {
              id: 1,
              username: 'admin',
              nickname: '管理员'
            }
          }
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 1000)
  })
}

/**
 * 模拟注册 API
 */
export const registerApi = async (userData) => {
  // 模拟 API 调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          message: '注册成功'
        }
      })
    }, 1000)
  })
}

/**
 * 默认导出
 */
export default {
  useLogin,
  loginApi,
  registerApi
}