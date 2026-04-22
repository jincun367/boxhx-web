import userData from '@/resource/init.json'

// 模拟延时
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 获取token
export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

// 设置token
export const setToken = (token, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem('token', token)
  } else {
    sessionStorage.setItem('token', token)
  }
}

// 清除token
export const removeToken = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

// 检查用户是否已认证
export const isAuthenticated = () => {
  const token = getToken()
  return !!token
}

// 模拟登录API
export const loginApi = async (credentials) => {
  await sleep(800) // 模拟网络延迟
  
  const user = userData.users.find(
    u => u.username === credentials.username && u.password === credentials.password
  )
  
  if (user) {
    // 模拟生成token
    const token = `fake-jwt-token.${btoa(JSON.stringify(user))}.signature`
    
    return {
      success: true,
      data: {
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    }
  } else {
    throw new Error('用户名或密码错误')
  }
}

// 模拟注册API
export const registerApi = async (userData) => {
  await sleep(1000) // 模拟网络延迟
  
  // 检查用户名是否已存在
  const existingUser = userData.users.find(u => u.username === userData.username)
  if (existingUser) {
    throw new Error('用户名已存在')
  }
  
  // 检查邮箱是否已存在
  const existingEmail = userData.users.find(u => u.email === userData.email)
  if (existingEmail) {
    throw new Error('邮箱已被注册')
  }
  
  // 创建新用户
  const newUser = {
    id: userData.users.length + 1,
    username: userData.username,
    email: userData.email,
    password: userData.password
  }
  
  // 注意：在真实情况下，我们会将新用户保存到数据库中
  // 但现在我们只是模拟，所以只返回成功信息
  return {
    success: true,
    data: {
      message: '注册成功',
      userInfo: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    }
  }
}

// 模拟获取用户信息API
export const getUserInfo = async (token) => {
  await sleep(500) // 模拟网络延迟
  
  // 从token中解析用户信息（仅模拟）
  try {
    const tokenParts = token.split('.')
    if (tokenParts.length >= 2) {
      const payload = JSON.parse(atob(tokenParts[1]))
      return {
        success: true,
        data: payload.userInfo || { id: 1, username: 'guest', email: 'guest@example.com' }
      }
    }
  } catch (e) {
    console.error('解析token失败', e)
  }
  
  return {
    success: false,
    message: '获取用户信息失败'
  }
}