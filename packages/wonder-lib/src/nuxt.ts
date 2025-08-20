import { defineNuxtModule, addImports, createResolver } from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  /**
   * 组件前缀
   * @default 'W'
   */
  prefix?: string
  /**
   * 是否启用全局样式
   * @default true
   */
  globalStyles?: boolean
  /**
   * 主题配置
   */
  theme?: {
    primaryColor?: string
    borderRadius?: string
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'wonder-lib',
    configKey: 'wonderLib',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0'
    }
  },
  defaults: {
    prefix: 'W',
    globalStyles: true,
    theme: {
      primaryColor: '#3b82f6',
      borderRadius: '0.375rem'
    }
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // 合并配置
    nuxt.options.runtimeConfig.public.wonderLib = defu(
      nuxt.options.runtimeConfig.public.wonderLib || {},
      options
    )

    // 自动导入 composables 和 utils
    const composables = [
      'useApi',
      'useAuth', 
      'useStorage',
      'useTheme',
      'useForm',
      'useGet',
      'usePost',
      'usePut',
      'useDelete',
      'useLocalStorage',
      'useSessionStorage',
      'useMemoryStorage',
      'usePagination',
      'useFieldValidation',
      'useFormValidation'
    ]
    
    const utils = [
      'DateFormatter',
      'Validator',
      'DateUtils',
      'debounce',
      'throttle',
      'deepClone',
      'generateId',
      'generateUUID',
      'delay',
      'retry',
      'memoize'
    ]
    
    // 添加自动导入
    addImports([
      ...composables.map(name => ({ name, from: 'wonder-lib' })),
      ...utils.map(name => ({ name, from: 'wonder-lib' }))
    ])

    // 添加类型声明
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: 'wonder-lib' })
    })
  }
})