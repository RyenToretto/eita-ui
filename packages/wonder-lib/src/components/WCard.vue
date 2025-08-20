<template>
  <div :class="cardClasses">
    <!-- 头部 -->
    <div v-if="$slots.header || title" class="w-card__header">
      <slot name="header">
        <h3 v-if="title" class="w-card__title">{{ title }}</h3>
      </slot>
    </div>
    
    <!-- 内容 -->
    <div class="w-card__body">
      <slot></slot>
    </div>
    
    <!-- 底部 -->
    <div v-if="$slots.footer" class="w-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CardProps } from '../types/components'

const props = withDefaults(defineProps<CardProps>(), {
  shadow: 'medium',
  padding: 'medium',
  rounded: true,
  bordered: true,
  hoverable: false
})

// 计算卡片样式类
const cardClasses = computed(() => {
  const classes = ['w-card']
  
  // 阴影样式
  classes.push(`w-card--shadow-${props.shadow}`)
  
  // 内边距样式
  classes.push(`w-card--padding-${props.padding}`)
  
  // 圆角样式
  if (props.rounded) classes.push('w-card--rounded')
  
  // 边框样式
  if (props.bordered) classes.push('w-card--bordered')
  
  // 悬停效果
  if (props.hoverable) classes.push('w-card--hoverable')
  
  return classes.join(' ')
})
</script>

<style lang="scss">
.w-card {
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

// 阴影样式
.w-card--shadow-none {
  box-shadow: none;
}

.w-card--shadow-small {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.w-card--shadow-medium {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.w-card--shadow-large {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.w-card--shadow-extra-large {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

// 内边距样式
.w-card--padding-none .w-card__header,
.w-card--padding-none .w-card__body,
.w-card--padding-none .w-card__footer {
  padding: 0;
}

.w-card--padding-small .w-card__header,
.w-card--padding-small .w-card__body,
.w-card--padding-small .w-card__footer {
  padding: 0.75rem;
}

.w-card--padding-medium .w-card__header,
.w-card--padding-medium .w-card__body,
.w-card--padding-medium .w-card__footer {
  padding: 1rem;
}

.w-card--padding-large .w-card__header,
.w-card--padding-large .w-card__body,
.w-card--padding-large .w-card__footer {
  padding: 1.5rem;
}

// 圆角样式
.w-card--rounded {
  border-radius: 0.5rem;
}

// 边框样式
.w-card--bordered {
  border: 1px solid #e5e7eb;
}

// 悬停效果
.w-card--hoverable {
  cursor: pointer;
}

.w-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.w-card__header {
  border-bottom: 1px solid #e5e7eb;
}

.w-card__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

// 当没有边框时，移除底部边框
.w-card:not(.w-card--bordered) .w-card__header {
  border-bottom: none;
}

.w-card__body {
  flex: 1;
}

.w-card__footer {
  border-top: 1px solid #e5e7eb;
}

// 当没有边框时，移除顶部边框
.w-card:not(.w-card--bordered) .w-card__footer {
  border-top: none;
}
</style>