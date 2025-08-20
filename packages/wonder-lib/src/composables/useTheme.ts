import { ref, computed, watch, nextTick } from 'vue'
import { useStorage, usePreferredColorScheme } from '@vueuse/core'

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 主题配置
 */
export interface ThemeConfig {
  defaultMode?: ThemeMode
  storageKey?: string
  attribute?: string
  enableTransitions?: boolean
  transitionDuration?: number
  customThemes?: Record<string, ThemeVariables>
}

/**
 * 主题变量
 */
export interface ThemeVariables {
  primary?: string
  secondary?: string
  accent?: string
  background?: string
  surface?: string
  text?: string
  textSecondary?: string
  border?: string
  shadow?: string
  [key: string]: string | undefined
}

/**
 * 预设主题
 */
const presetThemes: Record<string, ThemeVariables> = {
  light: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    shadow: 'rgba(0, 0, 0, 0.1)'
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    accent: '#22d3ee',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)'
  },
  blue: {
    primary: '#2563eb',
    secondary: '#475569',
    accent: '#0ea5e9',
    background: '#f8fafc',
    surface: '#f1f5f9',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#cbd5e1',
    shadow: 'rgba(37, 99, 235, 0.1)'
  },
  green: {
    primary: '#059669',
    secondary: '#475569',
    accent: '#06b6d4',
    background: '#f0fdf4',
    surface: '#ecfdf5',
    text: '#064e3b',
    textSecondary: '#047857',
    border: '#bbf7d0',
    shadow: 'rgba(5, 150, 105, 0.1)'
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#475569',
    accent: '#a855f7',
    background: '#faf5ff',
    surface: '#f3e8ff',
    text: '#581c87',
    textSecondary: '#7c2d92',
    border: '#d8b4fe',
    shadow: 'rgba(124, 58, 237, 0.1)'
  }
}

const defaultConfig: ThemeConfig = {
  defaultMode: 'auto',
  storageKey: 'theme-mode',
  attribute: 'data-theme',
  enableTransitions: true,
  transitionDuration: 200,
  customThemes: {}
}

/**
 * 主题管理 Hook
 */
export function useTheme(config: ThemeConfig = {}) {
  const themeConfig = { ...defaultConfig, ...config }
  
  // 系统偏好
  const preferredColorScheme = usePreferredColorScheme()
  
  // 持久化存储
  const storedMode = useStorage(themeConfig.storageKey!, themeConfig.defaultMode!)
  const storedTheme = useStorage('theme-name', 'light')
  const storedVariables = useStorage('theme-variables', {} as ThemeVariables)
  
  // 状态管理
  const mode = ref<ThemeMode>(storedMode.value)
  const currentTheme = ref(storedTheme.value)
  const customVariables = ref<ThemeVariables>(storedVariables.value)
  const isTransitioning = ref(false)
  
  // 合并主题
  const allThemes = computed(() => ({
    ...presetThemes,
    ...themeConfig.customThemes
  }))
  
  // 当前实际模式
  const actualMode = computed(() => {
    if (mode.value === 'auto') {
      return preferredColorScheme.value === 'dark' ? 'dark' : 'light'
    }
    return mode.value
  })
  
  // 当前主题变量
  const themeVariables = computed(() => {
    const baseTheme = allThemes.value[currentTheme.value] || allThemes.value.light
    return {
      ...baseTheme,
      ...customVariables.value
    }
  })
  
  // 可用主题列表
  const availableThemes = computed(() => Object.keys(allThemes.value))
  
  // 是否为暗色模式
  const isDark = computed(() => actualMode.value === 'dark')
  
  /**
   * 设置模式
   */
  const setMode = async (newMode: ThemeMode) => {
    if (newMode === mode.value) return
    
    if (themeConfig.enableTransitions) {
      isTransitioning.value = true
    }
    
    mode.value = newMode
    storedMode.value = newMode
    
    await applyTheme()
    
    if (themeConfig.enableTransitions) {
      setTimeout(() => {
        isTransitioning.value = false
      }, themeConfig.transitionDuration)
    }
  }
  
  /**
   * 切换模式
   */
  const toggleMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'auto']
    const currentIndex = modes.indexOf(mode.value)
    const nextIndex = (currentIndex + 1) % modes.length
    setMode(modes[nextIndex])
  }
  
  /**
   * 切换明暗模式
   */
  const toggleDark = () => {
    setMode(isDark.value ? 'light' : 'dark')
  }
  
  /**
   * 设置主题
   */
  const setTheme = async (themeName: string) => {
    if (!allThemes.value[themeName]) {
      console.warn(`主题 "${themeName}" 不存在`)
      return
    }
    
    if (themeConfig.enableTransitions) {
      isTransitioning.value = true
    }
    
    currentTheme.value = themeName
    storedTheme.value = themeName
    
    await applyTheme()
    
    if (themeConfig.enableTransitions) {
      setTimeout(() => {
        isTransitioning.value = false
      }, themeConfig.transitionDuration)
    }
  }
  
  /**
   * 设置自定义变量
   */
  const setVariables = async (variables: Partial<ThemeVariables>) => {
    customVariables.value = {
      ...customVariables.value,
      ...variables
    }
    storedVariables.value = customVariables.value
    
    await applyTheme()
  }
  
  /**
   * 重置自定义变量
   */
  const resetVariables = async () => {
    customVariables.value = {}
    storedVariables.value = {}
    
    await applyTheme()
  }
  
  /**
   * 应用主题
   */
  const applyTheme = async () => {
    await nextTick()
    
    if (typeof document === 'undefined') return
    
    const root = document.documentElement
    
    // 设置主题属性
    root.setAttribute(themeConfig.attribute!, actualMode.value)
    
    // 设置 CSS 变量
    const variables = themeVariables.value
    Object.entries(variables).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--theme-${key}`, value)
      }
    })
    
    // 设置过渡效果
    if (themeConfig.enableTransitions && isTransitioning.value) {
      root.style.setProperty(
        '--theme-transition',
        `all ${themeConfig.transitionDuration}ms ease-in-out`
      )
    } else {
      root.style.removeProperty('--theme-transition')
    }
  }
  
  /**
   * 获取 CSS 变量值
   */
  const getCSSVariable = (name: string): string => {
    if (typeof document === 'undefined') return ''
    
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--theme-${name}`)
      .trim()
  }
  
  /**
   * 注册自定义主题
   */
  const registerTheme = (name: string, variables: ThemeVariables) => {
    if (!themeConfig.customThemes) {
      themeConfig.customThemes = {}
    }
    themeConfig.customThemes[name] = variables
  }
  
  /**
   * 导出主题配置
   */
  const exportTheme = () => {
    return {
      mode: mode.value,
      theme: currentTheme.value,
      variables: customVariables.value
    }
  }
  
  /**
   * 导入主题配置
   */
  const importTheme = async (config: {
    mode?: ThemeMode
    theme?: string
    variables?: ThemeVariables
  }) => {
    if (config.mode) {
      await setMode(config.mode)
    }
    if (config.theme) {
      await setTheme(config.theme)
    }
    if (config.variables) {
      await setVariables(config.variables)
    }
  }
  
  // 监听系统偏好变化
  watch(
    () => preferredColorScheme.value,
    () => {
      if (mode.value === 'auto') {
        applyTheme()
      }
    }
  )
  
  // 监听模式变化
  watch(
    () => actualMode.value,
    () => {
      applyTheme()
    },
    { immediate: true }
  )
  
  // 监听主题变化
  watch(
    () => themeVariables.value,
    () => {
      applyTheme()
    },
    { deep: true }
  )
  
  return {
    // 状态
    mode: readonly(mode),
    currentTheme: readonly(currentTheme),
    actualMode,
    isDark,
    isTransitioning: readonly(isTransitioning),
    
    // 主题数据
    availableThemes,
    themeVariables,
    customVariables: readonly(customVariables),
    
    // 方法
    setMode,
    toggleMode,
    toggleDark,
    setTheme,
    setVariables,
    resetVariables,
    getCSSVariable,
    registerTheme,
    exportTheme,
    importTheme
  }
}

/**
 * 主题提供者组件的 Props
 */
export interface ThemeProviderProps {
  config?: ThemeConfig
  defaultMode?: ThemeMode
  defaultTheme?: string
}