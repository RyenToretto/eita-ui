// 组件导出文件
// 导出组件路径，让使用者在自己的项目中处理 Vue 组件编译

// 基础组件路径
export const WButtonPath = './WButton.vue'
export const WInputPath = './WInput.vue'
export const WModalPath = './WModal.vue'
export const WCardPath = './WCard.vue'
export const WLoadingPath = './WLoading.vue'
export const WFormPath = './WForm.vue'
export const WTablePath = './WTable.vue'
export const WChartPath = './WChart.vue'

// 组件映射对象
export const componentPaths = {
  WButton: WButtonPath,
  WInput: WInputPath,
  WModal: WModalPath,
  WCard: WCardPath,
  WLoading: WLoadingPath,
  WForm: WFormPath,
  WTable: WTablePath,
  WChart: WChartPath
}

// 组件名称列表
export const componentNames = Object.keys(componentPaths)