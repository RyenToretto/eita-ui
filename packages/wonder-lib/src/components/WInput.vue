<template>
  <div :class="wrapperClasses">
    <!-- 标签 -->
    <label v-if="label" :for="inputId" class="w-input__label">
      {{ label }}
      <span v-if="required" class="w-input__required">*</span>
    </label>
    
    <!-- 输入框容器 -->
    <div class="w-input__container">
      <!-- 前置图标 -->
      <span v-if="prefixIcon" class="w-input__prefix-icon">
        <slot name="prefix-icon">
          <i :class="prefixIcon"></i>
        </slot>
      </span>
      
      <!-- 输入框 -->
      <input
        :id="inputId"
        ref="inputRef"
        :class="inputClasses"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <!-- 后置图标 -->
      <span v-if="suffixIcon || clearable" class="w-input__suffix-icon">
        <!-- 清除按钮 -->
        <button
          v-if="clearable && modelValue && !disabled && !readonly"
          type="button"
          class="w-input__clear"
          @click="handleClear"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <!-- 后置图标 -->
        <slot v-else name="suffix-icon">
          <i v-if="suffixIcon" :class="suffixIcon"></i>
        </slot>
      </span>
    </div>
    
    <!-- 帮助文本 -->
    <div v-if="helpText || errorMessage" class="w-input__help">
      <span v-if="errorMessage" class="w-input__error">{{ errorMessage }}</span>
      <span v-else-if="helpText" class="w-input__help-text">{{ helpText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InputProps, InputSize } from '../types/components'

interface Props extends InputProps {
  /**
   * 输入框类型
   */
  type?: 'text' | 'password' | 'number' | 'tel' | 'url' | 'search'
  /**
   * 自动完成
   */
  autocomplete?: string
  /**
   * 错误信息
   */
  errorMessage?: string
}

interface Emits {
  'update:modelValue': [value: string]
  change: [value: string, event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
  keydown: [event: KeyboardEvent]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'medium',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  autocomplete: 'off'
})

const emit = defineEmits<Emits>()

// 响应式数据
const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

// 生成唯一 ID
const inputId = computed(() => {
  return `w-input-${Math.random().toString(36).substr(2, 9)}`
})

// 计算包装器样式类
const wrapperClasses = computed(() => {
  const classes = ['w-input']
  
  classes.push(`w-input--${props.size}`)
  
  if (props.disabled) classes.push('w-input--disabled')
  if (props.errorMessage) classes.push('w-input--error')
  if (isFocused.value) classes.push('w-input--focused')
  
  return classes.join(' ')
})

// 计算输入框样式类
const inputClasses = computed(() => {
  const classes = ['w-input__field']
  
  if (props.prefixIcon) classes.push('w-input__field--has-prefix')
  if (props.suffixIcon || props.clearable) classes.push('w-input__field--has-suffix')
  
  return classes.join(' ')
})

// 处理输入事件
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

// 处理变化事件
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', target.value, event)
}

// 处理聚焦事件
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

// 处理失焦事件
const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

// 处理清除事件
const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

// 暴露方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
})
</script>

<style lang="scss">
.w-input {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.w-input__label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.w-input__required {
  color: #ef4444;
  margin-left: 0.125rem;
}

.w-input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.w-input__field {
  flex: 1;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #111827;
  transition: all 0.2s ease-in-out;
  outline: none;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  &:read-only {
    background-color: #f9fafb;
    cursor: default;
  }
}

.w-input__field--has-prefix {
  padding-left: 2.5rem;
}

.w-input__field--has-suffix {
  padding-right: 2.5rem;
}

.w-input__prefix-icon,
.w-input__suffix-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  pointer-events: none;
}

.w-input__prefix-icon {
  left: 0.75rem;
}

.w-input__suffix-icon {
  right: 0.75rem;
}

.w-input__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  pointer-events: auto;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: #374151;
  }
}

.w-input__help {
  font-size: 0.75rem;
  line-height: 1rem;
}

.w-input__error {
  color: #ef4444;
}

.w-input__help-text {
  color: #6b7280;
}

// 尺寸样式
.w-input--small .w-input__field {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.w-input--small .w-input__field--has-prefix {
  padding-left: 2rem;
}

.w-input--small .w-input__field--has-suffix {
  padding-right: 2rem;
}

.w-input--small .w-input__prefix-icon {
  left: 0.5rem;
}

.w-input--small .w-input__suffix-icon {
  right: 0.5rem;
}

.w-input--medium .w-input__field {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.w-input--large .w-input__field {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  line-height: 1.5rem;
}

.w-input--large .w-input__field--has-prefix {
  padding-left: 3rem;
}

.w-input--large .w-input__field--has-suffix {
  padding-right: 3rem;
}

.w-input--large .w-input__prefix-icon {
  left: 1rem;
}

.w-input--large .w-input__suffix-icon {
  right: 1rem;
}

// 状态样式
.w-input--disabled .w-input__label {
  color: #9ca3af;
}

.w-input--error .w-input__field {
  border-color: #ef4444;
  
  &:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
}

.w-input--focused .w-input__field {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>