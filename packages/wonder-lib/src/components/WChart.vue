<template>
  <div :class="chartClasses">
    <!-- 图表头部 -->
    <div v-if="title || description" class="w-chart__header">
      <h3 v-if="title" class="w-chart__title">{{ title }}</h3>
      <p v-if="description" class="w-chart__description">{{ description }}</p>
    </div>

    <!-- 图表容器 -->
    <div class="w-chart__container" :style="containerStyle">
      <WLoading v-if="loading" overlay />
      <canvas
        ref="canvasRef"
        :width="width"
        :height="height"
      ></canvas>
      
      <!-- 空数据状态 -->
      <div v-if="!loading && (!data || data.length === 0)" class="w-chart__empty">
        <slot name="empty">
          <div class="w-chart__empty-content">
            <span>暂无数据</span>
          </div>
        </slot>
      </div>
    </div>

    <!-- 图例 -->
    <div v-if="showLegend && legendData.length > 0" class="w-chart__legend">
      <div
        v-for="(item, index) in legendData"
        :key="index"
        class="w-chart__legend-item"
        @click="handleLegendClick(item, index)"
      >
        <span
          class="w-chart__legend-color"
          :style="{ backgroundColor: item.color }"
        ></span>
        <span class="w-chart__legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChartProps, ChartData } from '../types/components'

const props = withDefaults(defineProps<ChartProps>(), {
  type: 'line',
  width: 400,
  height: 300,
  responsive: true,
  showLegend: true,
  loading: false,
  smooth: true,
  showGrid: true,
  showTooltip: true
})

const emit = defineEmits<{
  'legend-click': [item: any, index: number]
  'data-click': [data: any, index: number]
}>()

// 模板引用
const canvasRef = ref<HTMLCanvasElement | null>(null)

// 响应式数据
const chartInstance = ref<any>(null)
const legendData = ref<Array<{ label: string; color: string }>>([]) 

// 计算属性
const chartClasses = computed(() => [
  'w-chart',
  `w-chart--${props.type}`,
  {
    'w-chart--loading': props.loading,
    'w-chart--responsive': props.responsive
  }
])

const containerStyle = computed(() => {
  const style: Record<string, any> = {}
  
  if (props.responsive) {
    style.width = '100%'
    style.height = 'auto'
  } else {
    style.width = `${props.width}px`
    style.height = `${props.height}px`
  }
  
  return style
})

// 图表配置
const getChartConfig = () => {
  const baseConfig = {
    responsive: props.responsive,
    maintainAspectRatio: !props.responsive,
    plugins: {
      legend: {
        display: false // 使用自定义图例
      },
      tooltip: {
        enabled: props.showTooltip,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales: {
      x: {
        display: props.showGrid,
        grid: {
          display: props.showGrid,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        display: props.showGrid,
        grid: {
          display: props.showGrid,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const element = elements[0]
        const dataIndex = element.index
        const data = props.data[dataIndex]
        emit('data-click', data, dataIndex)
      }
    }
  }

  // 根据图表类型调整配置
  switch (props.type) {
    case 'line':
      return {
        ...baseConfig,
        elements: {
          line: {
            tension: props.smooth ? 0.4 : 0
          }
        }
      }
    case 'pie':
    case 'doughnut':
      return {
        ...baseConfig,
        scales: {} // 饼图不需要坐标轴
      }
    default:
      return baseConfig
  }
}

// 数据转换
const transformData = () => {
  if (!props.data || props.data.length === 0) return null

  const colors = props.colors || [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ]

  switch (props.type) {
    case 'line':
    case 'bar':
      return {
        labels: props.data.map(item => item.label || item.x),
        datasets: [{
          label: props.title || 'Data',
          data: props.data.map(item => item.value || item.y),
          backgroundColor: props.type === 'bar' ? colors[0] : 'transparent',
          borderColor: colors[0],
          borderWidth: 2,
          fill: props.type === 'line' ? props.fill : false
        }]
      }
    
    case 'pie':
    case 'doughnut':
      return {
        labels: props.data.map(item => item.label),
        datasets: [{
          data: props.data.map(item => item.value),
          backgroundColor: colors.slice(0, props.data.length),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      }
    
    default:
      return null
  }
}

// 更新图例数据
const updateLegendData = () => {
  if (!props.data || props.data.length === 0) {
    legendData.value = []
    return
  }

  const colors = props.colors || [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ]

  switch (props.type) {
    case 'pie':
    case 'doughnut':
      legendData.value = props.data.map((item, index) => ({
        label: item.label,
        color: colors[index % colors.length]
      }))
      break
    
    default:
      legendData.value = [{
        label: props.title || 'Data',
        color: colors[0]
      }]
      break
  }
}

// 创建图表
const createChart = async () => {
  if (!canvasRef.value || props.loading) return

  // 动态导入 Chart.js (这里模拟，实际需要安装 chart.js)
  try {
    // const { Chart, registerables } = await import('chart.js')
    // Chart.register(...registerables)
    
    const chartData = transformData()
    if (!chartData) return

    const config = {
      type: props.type,
      data: chartData,
      options: getChartConfig()
    }

    // 销毁现有图表
    if (chartInstance.value) {
      chartInstance.value.destroy()
    }

    // 创建新图表 (这里模拟，实际需要 Chart.js)
    // chartInstance.value = new Chart(canvasRef.value, config)
    
    // 模拟图表创建
    console.log('Chart config:', config)
    
    // 更新图例
    updateLegendData()
  } catch (error) {
    console.error('Failed to create chart:', error)
  }
}

// 事件处理
const handleLegendClick = (item: any, index: number) => {
  emit('legend-click', item, index)
}

// 生命周期
onMounted(() => {
  createChart()
})

// 监听数据变化
watch(() => [props.data, props.type, props.colors], () => {
  createChart()
}, { deep: true })

// 监听加载状态
watch(() => props.loading, (loading) => {
  if (!loading) {
    nextTick(() => {
      createChart()
    })
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})

// 暴露方法
defineExpose({
  refresh: createChart,
  getChart: () => chartInstance.value,
  updateData: (newData: ChartData[]) => {
    // 更新数据的方法
    createChart()
  }
})
</script>

<style lang="scss">
.w-chart {
  width: 100%;
  
  &__header {
    margin-bottom: 16px;
  }
  
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
  }
  
  &__description {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
  
  &__container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 8px;
    
    canvas {
      max-width: 100%;
      height: auto;
    }
  }
  
  &__empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #9ca3af;
      font-size: 14px;
    }
  }
  
  &__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;
    justify-content: center;
  }
  
  &__legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #374151;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 0.8;
    }
  }
  
  &__legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  
  &__legend-label {
    white-space: nowrap;
  }
  
  // 响应式
  &--responsive {
    .w-chart__container {
      width: 100%;
      height: auto;
    }
  }
  
  // 加载状态
  &--loading {
    .w-chart__container {
      min-height: 200px;
    }
  }
  
  // 图表类型特定样式
  &--pie,
  &--doughnut {
    .w-chart__legend {
      justify-content: flex-start;
    }
  }
}
</style>