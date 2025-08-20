<template>
  <form :class="formClasses" @submit.prevent="handleSubmit">
    <div v-if="title" class="w-form__header">
      <h3 class="w-form__title">{{ title }}</h3>
      <p v-if="description" class="w-form__description">{{ description }}</p>
    </div>
    
    <div class="w-form__body">
      <slot />
    </div>
    
    <div v-if="showActions" class="w-form__actions">
      <slot name="actions">
        <WButton
          v-if="showCancel"
          type="secondary"
          variant="outline"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </WButton>
        <WButton
          type="primary"
          :loading="loading"
          :disabled="!isValid || loading"
          html-type="submit"
        >
          {{ submitText }}
        </WButton>
      </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { FormProps } from '../types/components'

const props = withDefaults(defineProps<FormProps>(), {
  layout: 'vertical',
  size: 'medium',
  showActions: true,
  showCancel: false,
  submitText: '提交',
  cancelText: '取消',
  loading: false,
  disabled: false,
  validateOnChange: true,
  validateOnBlur: true
})

const emit = defineEmits<{
  submit: [data: Record<string, any>]
  cancel: []
  validate: [isValid: boolean, errors: Record<string, string>]
}>()

// 表单验证状态
const formData = ref<Record<string, any>>({})
const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})

// 计算属性
const formClasses = computed(() => [
  'w-form',
  `w-form--${props.layout}`,
  `w-form--${props.size}`,
  {
    'w-form--disabled': props.disabled,
    'w-form--loading': props.loading
  }
])

const isValid = computed(() => {
  return Object.keys(errors.value).length === 0
})

// 表单提交处理
const handleSubmit = () => {
  if (props.disabled || props.loading) return
  
  // 验证所有字段
  validateForm()
  
  if (isValid.value) {
    emit('submit', { ...formData.value })
  }
}

// 取消处理
const handleCancel = () => {
  emit('cancel')
}

// 表单验证
const validateForm = () => {
  const newErrors: Record<string, string> = {}
  
  if (props.rules) {
    Object.keys(props.rules).forEach(field => {
      const fieldRules = props.rules![field]
      const value = formData.value[field]
      
      for (const rule of fieldRules) {
        if (rule.required && (!value || value === '')) {
          newErrors[field] = rule.message || `${field} 是必填项`
          break
        }
        
        if (rule.pattern && value && !rule.pattern.test(value)) {
          newErrors[field] = rule.message || `${field} 格式不正确`
          break
        }
        
        if (rule.min && value && value.length < rule.min) {
          newErrors[field] = rule.message || `${field} 最少需要 ${rule.min} 个字符`
          break
        }
        
        if (rule.max && value && value.length > rule.max) {
          newErrors[field] = rule.message || `${field} 最多允许 ${rule.max} 个字符`
          break
        }
        
        if (rule.validator && value) {
          const result = rule.validator(value)
          if (result !== true) {
            newErrors[field] = typeof result === 'string' ? result : rule.message || `${field} 验证失败`
            break
          }
        }
      }
    })
  }
  
  errors.value = newErrors
  emit('validate', isValid.value, errors.value)
}

// 设置字段值
const setFieldValue = (field: string, value: any) => {
  formData.value[field] = value
  touched.value[field] = true
  
  if (props.validateOnChange) {
    validateForm()
  }
}

// 获取字段错误
const getFieldError = (field: string) => {
  return errors.value[field]
}

// 重置表单
const resetForm = () => {
  formData.value = {}
  errors.value = {}
  touched.value = {}
}

// 暴露方法给父组件
defineExpose({
  validate: validateForm,
  resetForm,
  setFieldValue,
  getFieldError,
  formData: readonly(formData),
  errors: readonly(errors),
  isValid
})

// 监听初始数据
watch(() => props.initialValues, (newValues) => {
  if (newValues) {
    formData.value = { ...newValues }
  }
}, { immediate: true })
</script>

<style lang="scss">
.w-form {
  width: 100%;
  
  &__header {
    margin-bottom: 24px;
  }
  
  &__title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }
  
  &__description {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
  
  &__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  &__actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
    
    &:empty {
      display: none;
    }
  }
  
  // 布局样式
  &--horizontal {
    .w-form__body {
      gap: 20px;
    }
  }
  
  &--inline {
    .w-form__body {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 16px;
    }
    
    .w-form__actions {
      margin-top: 0;
      margin-left: auto;
    }
  }
  
  // 尺寸样式
  &--small {
    .w-form__body {
      gap: 12px;
    }
    
    .w-form__actions {
      margin-top: 16px;
      gap: 8px;
    }
  }
  
  &--large {
    .w-form__body {
      gap: 20px;
    }
    
    .w-form__actions {
      margin-top: 32px;
      gap: 16px;
    }
  }
  
  // 状态样式
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  &--loading {
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      z-index: 10;
    }
  }
}
</style>