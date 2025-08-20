<template>
  <div v-if="modelValue" :class="loadingClasses">
    <!-- 遮罩层 -->
    <div v-if="overlay" class="w-loading__overlay"></div>
    
    <!-- 加载内容 -->
    <div class="w-loading__content">
      <!-- 加载图标 -->
      <div :class="spinnerClasses">
        <!-- 默认旋转图标 -->
        <svg v-if="type === 'spinner'" class="w-loading__spinner" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            stroke-width="4"
            stroke-linecap="round"
            stroke-dasharray="31.416"
            stroke-dashoffset="31.416"
          />
        </svg>
        
        <!-- 点状加载 -->
        <div v-else-if="type === 'dots'" class="w-loading__dots">
          <div class="w-loading__dot"></div>
          <div class="w-loading__dot"></div>
          <div class="w-loading__dot"></div>
        </div>
        
        <!-- 脉冲加载 -->
        <div v-else-if="type === 'pulse'" class="w-loading__pulse">
          <div class="w-loading__pulse-ring"></div>
          <div class="w-loading__pulse-ring"></div>
          <div class="w-loading__pulse-ring"></div>
        </div>
        
        <!-- 条形加载 -->
        <div v-else-if="type === 'bars'" class="w-loading__bars">
          <div class="w-loading__bar"></div>
          <div class="w-loading__bar"></div>
          <div class="w-loading__bar"></div>
          <div class="w-loading__bar"></div>
        </div>
        
        <!-- 自定义图标 -->
        <slot v-else name="icon">
          <svg class="w-loading__spinner" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-dasharray="31.416"
              stroke-dashoffset="31.416"
            />
          </svg>
        </slot>
      </div>
      
      <!-- 加载文本 -->
      <div v-if="text || $slots.default" class="w-loading__text">
        <slot>{{ text }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoadingProps } from '../types/components'

const props = withDefaults(defineProps<LoadingProps>(), {
  modelValue: false,
  type: 'spinner',
  size: 'medium',
  overlay: false,
  text: ''
})

// 计算加载容器样式类
const loadingClasses = computed(() => {
  const classes = ['w-loading']
  
  if (props.overlay) classes.push('w-loading--overlay')
  if (props.class) classes.push(props.class)
  
  return classes.join(' ')
})

// 计算加载图标样式类
const spinnerClasses = computed(() => {
  const classes = ['w-loading__icon']
  
  classes.push(`w-loading__icon--${props.size}`)
  
  return classes.join(' ')
})
</script>

<style lang="scss">
.w-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &--overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .w-loading__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(2px);
  }
  
  .w-loading__content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    z-index: 1;
  }
  
  .w-loading__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;
    
    // 尺寸样式
    &--small {
      width: 1rem;
      height: 1rem;
    }
    
    &--medium {
      width: 1.5rem;
      height: 1.5rem;
    }
    
    &--large {
      width: 2rem;
      height: 2rem;
    }
  }
  
  // 旋转加载器
  .w-loading__spinner {
    width: 100%;
    height: 100%;
    animation: w-loading-spin 1s linear infinite;
    
    circle {
      animation: w-loading-dash 1.5s ease-in-out infinite;
    }
  }
  
  // 点状加载器
  .w-loading__dots {
    display: flex;
    gap: 0.25rem;
    
    .w-loading__dot {
      width: 0.375rem;
      height: 0.375rem;
      background-color: currentColor;
      border-radius: 50%;
      animation: w-loading-bounce 1.4s ease-in-out infinite both;
      
      &:nth-child(1) {
        animation-delay: -0.32s;
      }
      
      &:nth-child(2) {
        animation-delay: -0.16s;
      }
    }
  }
  
  // 脉冲加载器
  .w-loading__pulse {
    position: relative;
    width: 100%;
    height: 100%;
    
    .w-loading__pulse-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 2px solid currentColor;
      border-radius: 50%;
      opacity: 1;
      animation: w-loading-pulse 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      
      &:nth-child(2) {
        animation-delay: -1s;
      }
      
      &:nth-child(3) {
        animation-delay: -0.5s;
      }
    }
  }
  
  // 条形加载器
  .w-loading__bars {
    display: flex;
    align-items: center;
    gap: 0.125rem;
    
    .w-loading__bar {
      width: 0.25rem;
      height: 1rem;
      background-color: currentColor;
      border-radius: 0.125rem;
      animation: w-loading-bars 1.2s ease-in-out infinite;
      
      &:nth-child(1) {
        animation-delay: -1.1s;
      }
      
      &:nth-child(2) {
        animation-delay: -1s;
      }
      
      &:nth-child(3) {
        animation-delay: -0.9s;
      }
      
      &:nth-child(4) {
        animation-delay: -0.8s;
      }
    }
  }
  
  .w-loading__text {
    font-size: 0.875rem;
    color: #6b7280;
    text-align: center;
  }
}

// 动画定义
@keyframes w-loading-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes w-loading-dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes w-loading-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes w-loading-pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes w-loading-bars {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>