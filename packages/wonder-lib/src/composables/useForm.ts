import { ref, reactive, computed, watch, nextTick } from 'vue'

/**
 * 表单验证规则
 */
export interface FormRule {
  required?: boolean
  message?: string
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (value: any, formData: any) => boolean | string | Promise<boolean | string>
  trigger?: 'blur' | 'change' | 'submit'
}

/**
 * 字段验证结果
 */
export interface FieldValidation {
  valid: boolean
  message: string
  dirty: boolean
  touched: boolean
}

/**
 * 表单配置
 */
export interface FormConfig {
  validateOnChange?: boolean
  validateOnBlur?: boolean
  resetOnSubmit?: boolean
  scrollToError?: boolean
}

/**
 * 表单状态
 */
export interface FormState {
  valid: boolean
  invalid: boolean
  dirty: boolean
  pristine: boolean
  touched: boolean
  untouched: boolean
  pending: boolean
  submitting: boolean
  submitted: boolean
}

const defaultConfig: FormConfig = {
  validateOnChange: true,
  validateOnBlur: true,
  resetOnSubmit: false,
  scrollToError: true
}

/**
 * 表单管理 Hook
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  rules: Partial<Record<keyof T, FormRule[]>> = {},
  config: FormConfig = {}
) {
  const formConfig = { ...defaultConfig, ...config }
  
  // 表单数据
  const formData = reactive<T>({ ...initialValues })
  const originalData = { ...initialValues }
  
  // 验证状态
  const validations = reactive<Record<keyof T, FieldValidation>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = {
        valid: true,
        message: '',
        dirty: false,
        touched: false
      }
      return acc
    }, {} as Record<keyof T, FieldValidation>)
  )
  
  // 表单状态
  const submitting = ref(false)
  const submitted = ref(false)
  const pending = ref(false)
  
  // 计算属性
  const valid = computed(() => {
    return Object.values(validations).every(v => v.valid)
  })
  
  const invalid = computed(() => !valid.value)
  
  const dirty = computed(() => {
    return Object.values(validations).some(v => v.dirty)
  })
  
  const pristine = computed(() => !dirty.value)
  
  const touched = computed(() => {
    return Object.values(validations).some(v => v.touched)
  })
  
  const untouched = computed(() => !touched.value)
  
  const errors = computed(() => {
    return Object.entries(validations)
      .filter(([, validation]) => !validation.valid)
      .reduce((acc, [key, validation]) => {
        acc[key as keyof T] = validation.message
        return acc
      }, {} as Partial<Record<keyof T, string>>)
  })
  
  const firstError = computed(() => {
    const errorEntries = Object.entries(errors.value)
    return errorEntries.length > 0 ? errorEntries[0] : null
  })
  
  const state = computed<FormState>(() => ({
    valid: valid.value,
    invalid: invalid.value,
    dirty: dirty.value,
    pristine: pristine.value,
    touched: touched.value,
    untouched: untouched.value,
    pending: pending.value,
    submitting: submitting.value,
    submitted: submitted.value
  }))
  
  /**
   * 验证单个字段
   */
  const validateField = async (field: keyof T): Promise<boolean> => {
    const fieldRules = rules[field] || []
    const value = formData[field]
    
    for (const rule of fieldRules) {
      // 必填验证
      if (rule.required && (value === null || value === undefined || value === '')) {
        validations[field].valid = false
        validations[field].message = rule.message || `${String(field)} 是必填项`
        return false
      }
      
      // 跳过空值的其他验证（除非是必填）
      if (!rule.required && (value === null || value === undefined || value === '')) {
        continue
      }
      
      // 最小长度验证
      if (rule.min !== undefined && String(value).length < rule.min) {
        validations[field].valid = false
        validations[field].message = rule.message || `${String(field)} 最少需要 ${rule.min} 个字符`
        return false
      }
      
      // 最大长度验证
      if (rule.max !== undefined && String(value).length > rule.max) {
        validations[field].valid = false
        validations[field].message = rule.message || `${String(field)} 最多允许 ${rule.max} 个字符`
        return false
      }
      
      // 正则验证
      if (rule.pattern && !rule.pattern.test(String(value))) {
        validations[field].valid = false
        validations[field].message = rule.message || `${String(field)} 格式不正确`
        return false
      }
      
      // 自定义验证器
      if (rule.validator) {
        try {
          const result = await rule.validator(value, formData)
          if (result !== true) {
            validations[field].valid = false
            validations[field].message = typeof result === 'string' ? result : (rule.message || `${String(field)} 验证失败`)
            return false
          }
        } catch (error) {
          validations[field].valid = false
          validations[field].message = rule.message || `${String(field)} 验证出错`
          return false
        }
      }
    }
    
    // 验证通过
    validations[field].valid = true
    validations[field].message = ''
    return true
  }
  
  /**
   * 验证所有字段
   */
  const validate = async (): Promise<boolean> => {
    pending.value = true
    
    try {
      const results = await Promise.all(
        Object.keys(formData).map(field => validateField(field as keyof T))
      )
      
      const isValid = results.every(result => result)
      
      // 滚动到第一个错误
      if (!isValid && formConfig.scrollToError) {
        await nextTick()
        scrollToFirstError()
      }
      
      return isValid
    } finally {
      pending.value = false
    }
  }
  
  /**
   * 清除验证状态
   */
  const clearValidation = (field?: keyof T) => {
    if (field) {
      validations[field].valid = true
      validations[field].message = ''
    } else {
      Object.keys(validations).forEach(key => {
        const fieldKey = key as keyof T
        validations[fieldKey].valid = true
        validations[fieldKey].message = ''
      })
    }
  }
  
  /**
   * 重置表单
   */
  const reset = () => {
    // 重置数据
    Object.keys(formData).forEach(key => {
      formData[key as keyof T] = originalData[key as keyof T]
    })
    
    // 重置验证状态
    Object.keys(validations).forEach(key => {
      const fieldKey = key as keyof T
      validations[fieldKey].valid = true
      validations[fieldKey].message = ''
      validations[fieldKey].dirty = false
      validations[fieldKey].touched = false
    })
    
    // 重置表单状态
    submitting.value = false
    submitted.value = false
    pending.value = false
  }
  
  /**
   * 设置字段值
   */
  const setFieldValue = (field: keyof T, value: any) => {
    formData[field] = value
    validations[field].dirty = true
    
    if (formConfig.validateOnChange) {
      validateField(field)
    }
  }
  
  /**
   * 设置字段错误
   */
  const setFieldError = (field: keyof T, message: string) => {
    validations[field].valid = false
    validations[field].message = message
  }
  
  /**
   * 标记字段为已触摸
   */
  const setFieldTouched = (field: keyof T, touched = true) => {
    validations[field].touched = touched
    
    if (touched && formConfig.validateOnBlur) {
      validateField(field)
    }
  }
  
  /**
   * 提交表单
   */
  const submit = async (onSubmit: (data: T) => Promise<void> | void) => {
    submitting.value = true
    
    try {
      const isValid = await validate()
      
      if (isValid) {
        await onSubmit(formData)
        submitted.value = true
        
        if (formConfig.resetOnSubmit) {
          reset()
        }
      }
      
      return isValid
    } finally {
      submitting.value = false
    }
  }
  
  /**
   * 滚动到第一个错误
   */
  const scrollToFirstError = () => {
    if (typeof document === 'undefined') return
    
    const firstErrorField = firstError.value?.[0]
    if (firstErrorField) {
      const element = document.querySelector(`[name="${String(firstErrorField)}"]`) ||
                    document.querySelector(`#${String(firstErrorField)}`) ||
                    document.querySelector(`[data-field="${String(firstErrorField)}"]`)
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // 聚焦到输入框
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          element.focus()
        }
      }
    }
  }
  
  /**
   * 获取字段属性
   */
  const getFieldProps = (field: keyof T) => {
    return {
      name: String(field),
      value: formData[field],
      error: !validations[field].valid ? validations[field].message : undefined,
      onInput: (value: any) => setFieldValue(field, value),
      onBlur: () => setFieldTouched(field, true)
    }
  }
  
  // 监听表单数据变化
  Object.keys(formData).forEach(key => {
    const fieldKey = key as keyof T
    watch(
      () => formData[fieldKey],
      (newValue, oldValue) => {
        if (newValue !== oldValue) {
          validations[fieldKey].dirty = true
        }
      }
    )
  })
  
  return {
    // 表单数据
    formData,
    
    // 验证状态
    validations: readonly(validations),
    valid,
    invalid,
    errors,
    firstError,
    
    // 表单状态
    state,
    dirty,
    pristine,
    touched,
    untouched,
    pending: readonly(pending),
    submitting: readonly(submitting),
    submitted: readonly(submitted),
    
    // 方法
    validate,
    validateField,
    clearValidation,
    reset,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    submit,
    getFieldProps
  }
}

/**
 * 常用验证规则
 */
export const validators = {
  required: (message = '此字段为必填项'): FormRule => ({
    required: true,
    message
  }),
  
  email: (message = '请输入有效的邮箱地址'): FormRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message
  }),
  
  phone: (message = '请输入有效的手机号码'): FormRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message
  }),
  
  url: (message = '请输入有效的网址'): FormRule => ({
    pattern: /^https?:\/\/.+/,
    message
  }),
  
  minLength: (min: number, message?: string): FormRule => ({
    min,
    message: message || `最少需要 ${min} 个字符`
  }),
  
  maxLength: (max: number, message?: string): FormRule => ({
    max,
    message: message || `最多允许 ${max} 个字符`
  }),
  
  pattern: (regex: RegExp, message = '格式不正确'): FormRule => ({
    pattern: regex,
    message
  }),
  
  custom: (validator: FormRule['validator'], message = '验证失败'): FormRule => ({
    validator,
    message
  })
}