import { ref, computed, watch, type Ref } from 'vue'

/**
 * 验证规则函数类型
 */
export type ValidationRule<T = any> = (
  value: T,
  field?: string,
  data?: Record<string, any>
) => string | boolean | Promise<string | boolean>

/**
 * 验证结果
 */
export interface ValidationResult {
  valid: boolean
  message?: string
}

/**
 * 字段验证配置
 */
export interface FieldValidationConfig<T = any> {
  rules: ValidationRule<T>[]
  trigger?: 'change' | 'blur' | 'submit' | 'manual'
  debounce?: number
  required?: boolean
  label?: string
}

/**
 * 表单验证配置
 */
export interface FormValidationConfig {
  [field: string]: FieldValidationConfig
}

/**
 * 验证状态
 */
export interface ValidationState {
  pending: boolean
  valid: boolean
  invalid: boolean
  message?: string
  touched: boolean
  dirty: boolean
}

/**
 * 内置验证规则
 */
export const validationRules = {
  /**
   * 必填验证
   */
  required: (message = '此字段为必填项'): ValidationRule => {
    return (value) => {
      if (value === null || value === undefined || value === '') {
        return message
      }
      if (Array.isArray(value) && value.length === 0) {
        return message
      }
      return true
    }
  },

  /**
   * 最小长度验证
   */
  minLength: (min: number, message?: string): ValidationRule => {
    return (value) => {
      if (value === null || value === undefined) return true
      const length = String(value).length
      if (length < min) {
        return message || `最少需要 ${min} 个字符`
      }
      return true
    }
  },

  /**
   * 最大长度验证
   */
  maxLength: (max: number, message?: string): ValidationRule => {
    return (value) => {
      if (value === null || value === undefined) return true
      const length = String(value).length
      if (length > max) {
        return message || `最多允许 ${max} 个字符`
      }
      return true
    }
  },

  /**
   * 最小值验证
   */
  min: (min: number, message?: string): ValidationRule => {
    return (value) => {
      if (value === null || value === undefined || value === '') return true
      const num = Number(value)
      if (isNaN(num) || num < min) {
        return message || `值不能小于 ${min}`
      }
      return true
    }
  },

  /**
   * 最大值验证
   */
  max: (max: number, message?: string): ValidationRule => {
    return (value) => {
      if (value === null || value === undefined || value === '') return true
      const num = Number(value)
      if (isNaN(num) || num > max) {
        return message || `值不能大于 ${max}`
      }
      return true
    }
  },

  /**
   * 邮箱验证
   */
  email: (message = '请输入有效的邮箱地址'): ValidationRule => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return (value) => {
      if (value === null || value === undefined || value === '') return true
      if (!emailRegex.test(String(value))) {
        return message
      }
      return true
    }
  },

  /**
   * 手机号验证
   */
  phone: (message = '请输入有效的手机号码'): ValidationRule => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return (value) => {
      if (value === null || value === undefined || value === '') return true
      if (!phoneRegex.test(String(value))) {
        return message
      }
      return true
    }
  },

  /**
   * URL验证
   */
  url: (message = '请输入有效的URL地址'): ValidationRule => {
    const urlRegex = /^https?:\/\/.+/
    return (value) => {
      if (value === null || value === undefined || value === '') return true
      if (!urlRegex.test(String(value))) {
        return message
      }
      return true
    }
  },

  /**
   * 正则表达式验证
   */
  pattern: (regex: RegExp, message = '格式不正确'): ValidationRule => {
    return (value) => {
      if (value === null || value === undefined || value === '') return true
      if (!regex.test(String(value))) {
        return message
      }
      return true
    }
  },

  /**
   * 数字验证
   */
  numeric: (message = '请输入有效的数字'): ValidationRule => {
    return (value) => {
      if (value === null || value === undefined || value === '') return true
      if (isNaN(Number(value))) {
        return message
      }
      return true
    }
  },

  /**
   * 整数验证
   */
  integer: (message = '请输入整数'): ValidationRule => {
    return (value) => {
      if (value === null || value === undefined || value === '') return true
      const num = Number(value)
      if (isNaN(num) || !Number.isInteger(num)) {
        return message
      }
      return true
    }
  },

  /**
   * 确认密码验证
   */
  confirmed: (targetField: string, message = '两次输入的密码不一致'): ValidationRule => {
    return (value, field, data) => {
      if (value === null || value === undefined || value === '') return true
      if (!data || value !== data[targetField]) {
        return message
      }
      return true
    }
  },

  /**
   * 自定义验证
   */
  custom: (validator: (value: any) => boolean | string, message = '验证失败'): ValidationRule => {
    return (value) => {
      const result = validator(value)
      if (result === true) {
        return true
      }
      return typeof result === 'string' ? result : message
    }
  }
}

/**
 * 单字段验证 Hook
 */
export function useFieldValidation<T>(
  value: Ref<T>,
  config: FieldValidationConfig<T>
) {
  const { rules, trigger = 'change', debounce = 0, required = false, label = '' } = config
  
  const pending = ref(false)
  const message = ref<string>()
  const touched = ref(false)
  const dirty = ref(false)
  
  // 验证状态
  const valid = computed(() => !message.value)
  const invalid = computed(() => !!message.value)
  
  const state = computed<ValidationState>(() => ({
    pending: pending.value,
    valid: valid.value,
    invalid: invalid.value,
    message: message.value,
    touched: touched.value,
    dirty: dirty.value
  }))
  
  // 执行验证
  const validate = async (data?: Record<string, any>): Promise<ValidationResult> => {
    pending.value = true
    message.value = undefined
    
    try {
      // 如果是必填字段，先检查是否为空
      if (required) {
        const requiredRule = validationRules.required(`${label}为必填项`)
        const requiredResult = await requiredRule(value.value, label, data)
        if (requiredResult !== true) {
          message.value = typeof requiredResult === 'string' ? requiredResult : `${label}为必填项`
          return { valid: false, message: message.value }
        }
      }
      
      // 执行其他验证规则
      for (const rule of rules) {
        const result = await rule(value.value, label, data)
        if (result !== true) {
          message.value = typeof result === 'string' ? result : '验证失败'
          return { valid: false, message: message.value }
        }
      }
      
      return { valid: true }
    } catch (error) {
      message.value = '验证过程中发生错误'
      return { valid: false, message: message.value }
    } finally {
      pending.value = false
    }
  }
  
  // 清除验证状态
  const clearValidation = () => {
    message.value = undefined
    touched.value = false
    dirty.value = false
  }
  
  // 标记为已触摸
  const touch = () => {
    touched.value = true
  }
  
  // 监听值变化
  let debounceTimer: NodeJS.Timeout | null = null
  
  watch(
    value,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        dirty.value = true
      }
      
      if (trigger === 'change' && touched.value) {
        if (debounce > 0) {
          if (debounceTimer) {
            clearTimeout(debounceTimer)
          }
          debounceTimer = setTimeout(() => {
            validate()
          }, debounce)
        } else {
          validate()
        }
      }
    },
    { deep: true }
  )
  
  return {
    state,
    valid,
    invalid,
    pending,
    message,
    touched,
    dirty,
    validate,
    clearValidation,
    touch
  }
}

/**
 * 表单验证 Hook
 */
export function useFormValidation(
  data: Ref<Record<string, any>>,
  config: FormValidationConfig
) {
  const fieldStates = ref<Record<string, ValidationState>>({})
  const pending = ref(false)
  
  // 初始化字段状态
  for (const field in config) {
    fieldStates.value[field] = {
      pending: false,
      valid: true,
      invalid: false,
      touched: false,
      dirty: false
    }
  }
  
  // 表单整体状态
  const valid = computed(() => {
    return Object.values(fieldStates.value).every(state => state.valid)
  })
  
  const invalid = computed(() => !valid.value)
  
  const touched = computed(() => {
    return Object.values(fieldStates.value).some(state => state.touched)
  })
  
  const dirty = computed(() => {
    return Object.values(fieldStates.value).some(state => state.dirty)
  })
  
  // 验证单个字段
  const validateField = async (field: string): Promise<ValidationResult> => {
    const fieldConfig = config[field]
    if (!fieldConfig) {
      return { valid: true }
    }
    
    const fieldState = fieldStates.value[field]
    fieldState.pending = true
    fieldState.message = undefined
    
    try {
      const value = data.value[field]
      const { rules, required = false, label = field } = fieldConfig
      
      // 如果是必填字段，先检查是否为空
      if (required) {
        const requiredRule = validationRules.required(`${label}为必填项`)
        const requiredResult = await requiredRule(value, label, data.value)
        if (requiredResult !== true) {
          const message = typeof requiredResult === 'string' ? requiredResult : `${label}为必填项`
          fieldState.message = message
          fieldState.valid = false
          fieldState.invalid = true
          return { valid: false, message }
        }
      }
      
      // 执行其他验证规则
      for (const rule of rules) {
        const result = await rule(value, label, data.value)
        if (result !== true) {
          const message = typeof result === 'string' ? result : '验证失败'
          fieldState.message = message
          fieldState.valid = false
          fieldState.invalid = true
          return { valid: false, message }
        }
      }
      
      fieldState.valid = true
      fieldState.invalid = false
      return { valid: true }
    } catch (error) {
      const message = '验证过程中发生错误'
      fieldState.message = message
      fieldState.valid = false
      fieldState.invalid = true
      return { valid: false, message }
    } finally {
      fieldState.pending = false
    }
  }
  
  // 验证所有字段
  const validate = async (): Promise<ValidationResult> => {
    pending.value = true
    
    try {
      const results = await Promise.all(
        Object.keys(config).map(field => validateField(field))
      )
      
      const isValid = results.every(result => result.valid)
      const firstError = results.find(result => !result.valid)
      
      return {
        valid: isValid,
        message: firstError?.message
      }
    } finally {
      pending.value = false
    }
  }
  
  // 清除验证状态
  const clearValidation = (field?: string) => {
    if (field) {
      const fieldState = fieldStates.value[field]
      if (fieldState) {
        fieldState.message = undefined
        fieldState.valid = true
        fieldState.invalid = false
        fieldState.touched = false
        fieldState.dirty = false
      }
    } else {
      for (const field in fieldStates.value) {
        const fieldState = fieldStates.value[field]
        fieldState.message = undefined
        fieldState.valid = true
        fieldState.invalid = false
        fieldState.touched = false
        fieldState.dirty = false
      }
    }
  }
  
  // 标记字段为已触摸
  const touchField = (field: string) => {
    const fieldState = fieldStates.value[field]
    if (fieldState) {
      fieldState.touched = true
    }
  }
  
  // 标记所有字段为已触摸
  const touchAll = () => {
    for (const field in fieldStates.value) {
      fieldStates.value[field].touched = true
    }
  }
  
  // 监听数据变化
  watch(
    data,
    (newData, oldData) => {
      for (const field in config) {
        const fieldConfig = config[field]
        const newValue = newData[field]
        const oldValue = oldData?.[field]
        
        if (newValue !== oldValue) {
          const fieldState = fieldStates.value[field]
          fieldState.dirty = true
          
          // 根据触发条件执行验证
          if (fieldConfig.trigger === 'change' && fieldState.touched) {
            const debounce = fieldConfig.debounce || 0
            if (debounce > 0) {
              setTimeout(() => {
                validateField(field)
              }, debounce)
            } else {
              validateField(field)
            }
          }
        }
      }
    },
    { deep: true }
  )
  
  return {
    fieldStates: readonly(fieldStates),
    valid,
    invalid,
    pending,
    touched,
    dirty,
    validate,
    validateField,
    clearValidation,
    touchField,
    touchAll
  }
}

/**
 * 异步验证器
 */
export function createAsyncValidator(
  validator: (value: any) => Promise<boolean | string>,
  message = '验证失败'
): ValidationRule {
  return async (value) => {
    try {
      const result = await validator(value)
      if (result === true) {
        return true
      }
      return typeof result === 'string' ? result : message
    } catch (error) {
      return '验证过程中发生错误'
    }
  }
}

/**
 * 组合验证器
 */
export function combineValidators(...validators: ValidationRule[]): ValidationRule {
  return async (value, field, data) => {
    for (const validator of validators) {
      const result = await validator(value, field, data)
      if (result !== true) {
        return result
      }
    }
    return true
  }
}