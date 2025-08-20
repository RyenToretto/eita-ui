<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="htmlType"
    @click="handleClick"
  >
    <!-- 加载图标 -->
    <span v-if="loading" class="w-button__loading">
      <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.25"/>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" stroke-opacity="0.75"/>
      </svg>
    </span>
    
    <!-- 前置图标 -->
    <span v-if="icon && iconPosition === 'left' && !loading" class="w-button__icon w-button__icon--left">
      <slot name="icon">
        <i :class="icon"></i>
      </slot>
    </span>
    
    <!-- 按钮内容 -->
    <span class="w-button__content">
      <slot></slot>
    </span>
    
    <!-- 后置图标 -->
    <span v-if="icon && iconPosition === 'right' && !loading" class="w-button__icon w-button__icon--right">
      <slot name="icon">
        <i :class="icon"></i>
      </slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonProps, ButtonType, ButtonSize, ButtonVariant } from '../types/components'

interface Props extends ButtonProps {
  /**
   * HTML 按钮类型
   */
  htmlType?: 'button' | 'submit' | 'reset'
}

interface Emits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  variant: 'solid',
  iconPosition: 'left',
  htmlType: 'button',
  disabled: false,
  loading: false,
  block: false
})

const emit = defineEmits<Emits>()

// 计算按钮样式类
const buttonClasses = computed(() => {
  const classes = ['w-button']
  
  // 基础样式
  classes.push(`w-button--${props.type}`)
  classes.push(`w-button--${props.size}`)
  classes.push(`w-button--${props.variant}`)
  
  // 状态样式
  if (props.disabled) classes.push('w-button--disabled')
  if (props.loading) classes.push('w-button--loading')
  if (props.block) classes.push('w-button--block')
  
  // 自定义类名
  if (props.class) classes.push(props.class)
  
  return classes.join(' ')
})

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<style lang="scss">
.w-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  user-select: none;
  white-space: nowrap;
  
  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
}

// 尺寸样式
.w-button--small {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.w-button--medium {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.w-button--large {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  line-height: 1.5rem;
}

// Solid 变体样式
.w-button--solid.w-button--primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
  
  &:hover:not(.w-button--disabled) {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  
  &:active:not(.w-button--disabled) {
    background-color: #1d4ed8;
    border-color: #1d4ed8;
  }
}

.w-button--solid.w-button--secondary {
  background-color: #6b7280;
  border-color: #6b7280;
  color: white;
  
  &:hover:not(.w-button--disabled) {
    background-color: #4b5563;
    border-color: #4b5563;
  }
  
  &:active:not(.w-button--disabled) {
    background-color: #374151;
    border-color: #374151;
  }
}

.w-button--solid.w-button--success {
  background-color: #10b981;
  border-color: #10b981;
  color: white;
  
  &:hover:not(.w-button--disabled) {
    background-color: #059669;
    border-color: #059669;
  }
  
  &:active:not(.w-button--disabled) {
    background-color: #047857;
    border-color: #047857;
  }
}

.w-button--solid.w-button--warning {
  background-color: #f59e0b;
  border-color: #f59e0b;
  color: white;
  
  &:hover:not(.w-button--disabled) {
    background-color: #d97706;
    border-color: #d97706;
  }
  
  &:active:not(.w-button--disabled) {
    background-color: #b45309;
    border-color: #b45309;
  }
}

.w-button--solid.w-button--error {
  background-color: #ef4444;
  border-color: #ef4444;
  color: white;
  
  &:hover:not(.w-button--disabled) {
    background-color: #dc2626;
    border-color: #dc2626;
  }
  
  &:active:not(.w-button--disabled) {
    background-color: #b91c1c;
    border-color: #b91c1c;
  }
}

.w-button--solid.w-button--info {
  background-color: #06b6d4;
  border-color: #06b6d4;
  color: white;
  
  &:hover:not(.w-button--disabled) {
    background-color: #0891b2;
    border-color: #0891b2;
  }
  
  &:active:not(.w-button--disabled) {
    background-color: #0e7490;
    border-color: #0e7490;
  }
}

// Outline 变体样式
.w-button--outline {
  background-color: transparent;
}

.w-button--outline.w-button--primary {
  border-color: #3b82f6;
  color: #3b82f6;
  
  &:hover:not(.w-button--disabled) {
    background-color: #3b82f6;
    color: white;
  }
}

.w-button--outline.w-button--secondary {
  border-color: #6b7280;
  color: #6b7280;
  
  &:hover:not(.w-button--disabled) {
    background-color: #6b7280;
    color: white;
  }
}

.w-button--outline.w-button--success {
  border-color: #10b981;
  color: #10b981;
  
  &:hover:not(.w-button--disabled) {
    background-color: #10b981;
    color: white;
  }
}

.w-button--outline.w-button--warning {
  border-color: #f59e0b;
  color: #f59e0b;
  
  &:hover:not(.w-button--disabled) {
    background-color: #f59e0b;
    color: white;
  }
}

.w-button--outline.w-button--error {
  border-color: #ef4444;
  color: #ef4444;
  
  &:hover:not(.w-button--disabled) {
    background-color: #ef4444;
    color: white;
  }
}

.w-button--outline.w-button--info {
  border-color: #06b6d4;
  color: #06b6d4;
  
  &:hover:not(.w-button--disabled) {
    background-color: #06b6d4;
    color: white;
  }
}

// Ghost 变体样式
.w-button--ghost {
  background-color: transparent;
  border-color: transparent;
}

.w-button--ghost.w-button--primary {
  color: #3b82f6;
  
  &:hover:not(.w-button--disabled) {
    background-color: #eff6ff;
  }
}

.w-button--ghost.w-button--secondary {
  color: #6b7280;
  
  &:hover:not(.w-button--disabled) {
    background-color: #f9fafb;
  }
}

.w-button--ghost.w-button--success {
  color: #10b981;
  
  &:hover:not(.w-button--disabled) {
    background-color: #ecfdf5;
  }
}

.w-button--ghost.w-button--warning {
  color: #f59e0b;
  
  &:hover:not(.w-button--disabled) {
    background-color: #fffbeb;
  }
}

.w-button--ghost.w-button--error {
  color: #ef4444;
  
  &:hover:not(.w-button--disabled) {
    background-color: #fef2f2;
  }
}

.w-button--ghost.w-button--info {
  color: #06b6d4;
  
  &:hover:not(.w-button--disabled) {
    background-color: #ecfeff;
  }
}

// Link 变体样式
.w-button--link {
  background-color: transparent;
  border-color: transparent;
  padding: 0;
  height: auto;
}

.w-button--link.w-button--primary {
  color: #3b82f6;
  
  &:hover:not(.w-button--disabled) {
    color: #2563eb;
    text-decoration: underline;
  }
}

.w-button--link.w-button--secondary {
  color: #6b7280;
  
  &:hover:not(.w-button--disabled) {
    color: #4b5563;
    text-decoration: underline;
  }
}

.w-button--link.w-button--success {
  color: #10b981;
  
  &:hover:not(.w-button--disabled) {
    color: #059669;
    text-decoration: underline;
  }
}

.w-button--link.w-button--warning {
  color: #f59e0b;
  
  &:hover:not(.w-button--disabled) {
    color: #d97706;
    text-decoration: underline;
  }
}

.w-button--link.w-button--error {
  color: #ef4444;
  
  &:hover:not(.w-button--disabled) {
    color: #dc2626;
    text-decoration: underline;
  }
}

.w-button--link.w-button--info {
  color: #06b6d4;
  
  &:hover:not(.w-button--disabled) {
    color: #0891b2;
    text-decoration: underline;
  }
}

// 状态样式
.w-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  
  &:hover {
    transform: none;
  }
}

.w-button--loading {
  cursor: wait;
}

.w-button--block {
  width: 100%;
}

// 图标样式
.w-button__loading {
  display: flex;
  align-items: center;
}

.w-button__icon {
  display: flex;
  align-items: center;
}

.w-button__icon--left {
  margin-right: 0.25rem;
}

.w-button__icon--right {
  margin-left: 0.25rem;
}

.w-button__content {
  display: flex;
  align-items: center;
}

// 动画
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>