import { ref, computed, watch } from 'vue'
import { useStorage } from '@vueuse/core'

/**
 * 用户信息接口
 */
export interface User {
  id: string | number
  username: string
  email: string
  avatar?: string
  roles?: string[]
  permissions?: string[]
  [key: string]: any
}

/**
 * 认证状态
 */
export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

/**
 * 登录参数
 */
export interface LoginCredentials {
  username?: string
  email?: string
  password: string
  remember?: boolean
}

/**
 * 注册参数
 */
export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword?: string
  [key: string]: any
}

/**
 * 认证配置
 */
export interface AuthConfig {
  tokenKey?: string
  refreshTokenKey?: string
  userKey?: string
  loginUrl?: string
  registerUrl?: string
  logoutUrl?: string
  refreshUrl?: string
  profileUrl?: string
  autoRefresh?: boolean
  refreshThreshold?: number // 刷新令牌的时间阈值（分钟）
}

const defaultConfig: AuthConfig = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  userKey: 'auth_user',
  loginUrl: '/api/auth/login',
  registerUrl: '/api/auth/register',
  logoutUrl: '/api/auth/logout',
  refreshUrl: '/api/auth/refresh',
  profileUrl: '/api/auth/profile',
  autoRefresh: true,
  refreshThreshold: 5
}

/**
 * 用户认证 Hook
 */
export function useAuth(config: AuthConfig = {}) {
  const authConfig = { ...defaultConfig, ...config }
  
  // 持久化存储
  const token = useStorage(authConfig.tokenKey!, null as string | null)
  const refreshToken = useStorage(authConfig.refreshTokenKey!, null as string | null)
  const user = useStorage(authConfig.userKey!, null as User | null)
  
  // 状态管理
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // 计算属性
  const isAuthenticated = computed(() => {
    return !!(token.value && user.value)
  })
  
  const hasRole = (role: string) => {
    return user.value?.roles?.includes(role) || false
  }
  
  const hasPermission = (permission: string) => {
    return user.value?.permissions?.includes(permission) || false
  }
  
  const hasAnyRole = (roles: string[]) => {
    return roles.some(role => hasRole(role))
  }
  
  const hasAllRoles = (roles: string[]) => {
    return roles.every(role => hasRole(role))
  }
  
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some(permission => hasPermission(permission))
  }
  
  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every(permission => hasPermission(permission))
  }
  
  /**
   * 登录
   */
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch(authConfig.loginUrl!, {
        method: 'POST',
        body: credentials
      })
      
      if (response.token && response.user) {
        token.value = response.token
        refreshToken.value = response.refreshToken || null
        user.value = response.user
        
        // 设置自动刷新
        if (authConfig.autoRefresh && response.refreshToken) {
          setupAutoRefresh()
        }
        
        return true
      }
      
      throw new Error('登录响应格式错误')
    } catch (err: any) {
      error.value = err?.message || '登录失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 注册
   */
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await $fetch(authConfig.registerUrl!, {
        method: 'POST',
        body: data
      })
      
      if (response.token && response.user) {
        token.value = response.token
        refreshToken.value = response.refreshToken || null
        user.value = response.user
        
        return true
      }
      
      return true // 注册成功但需要验证
    } catch (err: any) {
      error.value = err?.message || '注册失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 登出
   */
  const logout = async (): Promise<void> => {
    try {
      if (token.value && authConfig.logoutUrl) {
        await $fetch(authConfig.logoutUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
      }
    } catch (err) {
      console.warn('登出请求失败:', err)
    } finally {
      // 清除本地数据
      token.value = null
      refreshToken.value = null
      user.value = null
      error.value = null
      
      // 清除自动刷新
      clearAutoRefresh()
    }
  }
  
  /**
   * 刷新令牌
   */
  const refresh = async (): Promise<boolean> => {
    try {
      if (!refreshToken.value) {
        throw new Error('没有刷新令牌')
      }
      
      const response = await $fetch(authConfig.refreshUrl!, {
        method: 'POST',
        body: {
          refreshToken: refreshToken.value
        }
      })
      
      if (response.token) {
        token.value = response.token
        if (response.refreshToken) {
          refreshToken.value = response.refreshToken
        }
        if (response.user) {
          user.value = response.user
        }
        
        return true
      }
      
      throw new Error('刷新令牌失败')
    } catch (err: any) {
      error.value = err?.message || '刷新令牌失败'
      await logout() // 刷新失败，强制登出
      return false
    }
  }
  
  /**
   * 获取用户信息
   */
  const fetchProfile = async (): Promise<boolean> => {
    try {
      if (!token.value) {
        throw new Error('未登录')
      }
      
      isLoading.value = true
      
      const response = await $fetch(authConfig.profileUrl!, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      
      if (response.user) {
        user.value = response.user
        return true
      }
      
      throw new Error('获取用户信息失败')
    } catch (err: any) {
      error.value = err?.message || '获取用户信息失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * 更新用户信息
   */
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!token.value) {
        throw new Error('未登录')
      }
      
      isLoading.value = true
      
      const response = await $fetch(authConfig.profileUrl!, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: data
      })
      
      if (response.user) {
        user.value = { ...user.value, ...response.user }
        return true
      }
      
      return true
    } catch (err: any) {
      error.value = err?.message || '更新用户信息失败'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // 自动刷新相关
  let refreshTimer: NodeJS.Timeout | null = null
  
  const setupAutoRefresh = () => {
    if (!authConfig.autoRefresh || !refreshToken.value) return
    
    clearAutoRefresh()
    
    // 设置定时刷新（提前5分钟刷新）
    const refreshInterval = (authConfig.refreshThreshold! - 1) * 60 * 1000
    refreshTimer = setInterval(() => {
      refresh()
    }, refreshInterval)
  }
  
  const clearAutoRefresh = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }
  
  // 监听令牌变化，设置自动刷新
  watch(
    () => refreshToken.value,
    (newToken) => {
      if (newToken && authConfig.autoRefresh) {
        setupAutoRefresh()
      } else {
        clearAutoRefresh()
      }
    },
    { immediate: true }
  )
  
  // 初始化时检查认证状态
  const initialize = async () => {
    if (token.value && user.value) {
      // 验证令牌是否有效
      const isValid = await fetchProfile()
      if (!isValid) {
        await logout()
      }
    }
  }
  
  return {
    // 状态
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // 权限检查
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
    
    // 方法
    login,
    register,
    logout,
    refresh,
    fetchProfile,
    updateProfile,
    initialize
  }
}