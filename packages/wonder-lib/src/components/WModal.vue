<template>
  <Teleport to="body">
    <Transition name="w-modal" appear>
      <div v-if="modelValue" class="w-modal" @click="handleMaskClick">
        <div :class="modalClasses" @click.stop>
          <!-- 头部 -->
          <div v-if="$slots.header || title || closable" class="w-modal__header">
            <slot name="header">
              <h3 v-if="title" class="w-modal__title">{{ title }}</h3>
            </slot>
            
            <button
              v-if="closable"
              type="button"
              class="w-modal__close"
              @click="handleClose"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <!-- 内容 -->
          <div class="w-modal__body">
            <slot></slot>
          </div>
          
          <!-- 底部 -->
          <div v-if="$slots.footer" class="w-modal__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ModalProps, ModalSize } from '../types/components'

interface Emits {
  'update:modelValue': [value: boolean]
  close: []
  open: []
}

const props = withDefaults(defineProps<ModalProps>(), {
  size: 'medium',
  closable: true,
  maskClosable: true,
  destroyOnClose: false
})

const emit = defineEmits<Emits>()

// 计算模态框样式类
const modalClasses = computed(() => {
  const classes = ['w-modal__content']
  
  classes.push(`w-modal__content--${props.size}`)
  
  if (props.class) classes.push(props.class)
  
  return classes.join(' ')
})

// 处理遮罩点击
const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}

// 处理关闭
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    emit('open')
    // 禁止页面滚动
    document.body.style.overflow = 'hidden'
  } else {
    // 恢复页面滚动
    document.body.style.overflow = ''
  }
})

// 组件卸载时恢复页面滚动
onUnmounted(() => {
  document.body.style.overflow = ''
})

// 监听 ESC 键
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && props.modelValue && props.closable) {
      handleClose()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style lang="scss">
.w-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  
  .w-modal__content {
    position: relative;
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    max-height: calc(100vh - 2rem);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    // 尺寸样式
    &--small {
      width: 100%;
      max-width: 24rem;
    }
    
    &--medium {
      width: 100%;
      max-width: 32rem;
    }
    
    &--large {
      width: 100%;
      max-width: 48rem;
    }
    
    &--full {
      width: calc(100vw - 2rem);
      height: calc(100vh - 2rem);
      max-width: none;
      max-height: none;
    }
  }
  
  .w-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.5rem 0 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    
    .w-modal__title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }
    
    .w-modal__close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      background: none;
      color: #6b7280;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: all 0.2s ease-in-out;
      
      &:hover {
        background-color: #f3f4f6;
        color: #374151;
      }
    }
  }
  
  .w-modal__body {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    
    // 当没有头部时，增加顶部内边距
    .w-modal__content:not(:has(.w-modal__header)) & {
      padding-top: 1.5rem;
    }
    
    // 当没有底部时，增加底部内边距
    .w-modal__content:not(:has(.w-modal__footer)) & {
      padding-bottom: 1.5rem;
    }
  }
  
  .w-modal__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 0 1.5rem 1.5rem 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
}

// 过渡动画
.w-modal-enter-active,
.w-modal-leave-active {
  transition: opacity 0.3s ease;
  
  .w-modal__content {
    transition: transform 0.3s ease;
  }
}

.w-modal-enter-from,
.w-modal-leave-to {
  opacity: 0;
  
  .w-modal__content {
    transform: scale(0.9) translateY(-1rem);
  }
}

.w-modal-enter-to,
.w-modal-leave-from {
  opacity: 1;
  
  .w-modal__content {
    transform: scale(1) translateY(0);
  }
}

// 响应式设计
@media (max-width: 640px) {
  .w-modal {
    padding: 0.5rem;
    
    .w-modal__content {
      &--small,
      &--medium,
      &--large {
        width: 100%;
        max-width: none;
      }
    }
    
    .w-modal__header {
      padding: 1rem 1rem 0 1rem;
    }
    
    .w-modal__body {
      padding: 1rem;
    }
    
    .w-modal__footer {
      padding: 0 1rem 1rem 1rem;
    }
  }
}
</style>