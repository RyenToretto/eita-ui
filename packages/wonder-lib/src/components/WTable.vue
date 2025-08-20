<template>
  <div :class="tableClasses">
    <!-- 表格头部 -->
    <div v-if="title || $slots.header" class="w-table__header">
      <div class="w-table__title-section">
        <h3 v-if="title" class="w-table__title">{{ title }}</h3>
        <p v-if="description" class="w-table__description">{{ description }}</p>
      </div>
      <div class="w-table__actions">
        <slot name="header" />
      </div>
    </div>

    <!-- 表格工具栏 -->
    <div v-if="showToolbar" class="w-table__toolbar">
      <div class="w-table__toolbar-left">
        <slot name="toolbar-left" />
      </div>
      <div class="w-table__toolbar-right">
        <WInput
          v-if="searchable"
          v-model="searchValue"
          placeholder="搜索..."
          size="small"
          class="w-table__search"
        />
        <slot name="toolbar-right" />
      </div>
    </div>

    <!-- 表格容器 -->
    <div class="w-table__container">
      <WLoading v-if="loading" overlay />
      
      <table class="w-table__table">
        <!-- 表头 -->
        <thead class="w-table__thead">
          <tr class="w-table__tr">
            <th
              v-if="selectable"
              class="w-table__th w-table__th--selection"
            >
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="handleSelectAll"
              >
            </th>
            <th
              v-for="column in visibleColumns"
              :key="column.key"
              :class="getColumnClasses(column)"
              :style="getColumnStyle(column)"
              @click="handleSort(column)"
            >
              <div class="w-table__th-content">
                <span>{{ column.title }}</span>
                <div v-if="column.sortable" class="w-table__sort-icons">
                  <span
                    :class="[
                      'w-table__sort-icon',
                      'w-table__sort-icon--asc',
                      { 'w-table__sort-icon--active': sortKey === column.key && sortOrder === 'asc' }
                    ]"
                  >↑</span>
                  <span
                    :class="[
                      'w-table__sort-icon',
                      'w-table__sort-icon--desc',
                      { 'w-table__sort-icon--active': sortKey === column.key && sortOrder === 'desc' }
                    ]"
                  >↓</span>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        
        <!-- 表体 -->
        <tbody class="w-table__tbody">
          <tr
            v-for="(row, index) in paginatedData"
            :key="getRowKey(row, index)"
            :class="getRowClasses(row, index)"
            @click="handleRowClick(row, index)"
          >
            <td
              v-if="selectable"
              class="w-table__td w-table__td--selection"
            >
              <input
                type="checkbox"
                :checked="selectedRows.includes(getRowKey(row, index))"
                @change="handleRowSelect(row, index)"
                @click.stop
              >
            </td>
            <td
              v-for="column in visibleColumns"
              :key="column.key"
              :class="getCellClasses(column, row)"
              :style="getColumnStyle(column)"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :index="index"
                :value="getCellValue(row, column.key)"
              >
                {{ formatCellValue(getCellValue(row, column.key), column) }}
              </slot>
            </td>
          </tr>
          
          <!-- 空数据 -->
          <tr v-if="paginatedData.length === 0" class="w-table__empty">
            <td :colspan="totalColumns" class="w-table__empty-cell">
              <slot name="empty">
                <div class="w-table__empty-content">
                  <span>暂无数据</span>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="pagination && filteredData.length > 0" class="w-table__pagination">
      <div class="w-table__pagination-info">
        共 {{ filteredData.length }} 条数据
      </div>
      <div class="w-table__pagination-controls">
        <WButton
          size="small"
          variant="outline"
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          上一页
        </WButton>
        <span class="w-table__pagination-current">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <WButton
          size="small"
          variant="outline"
          :disabled="currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          下一页
        </WButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableProps, TableColumn } from '../types/components'

const props = withDefaults(defineProps<TableProps>(), {
  size: 'medium',
  bordered: false,
  striped: false,
  hoverable: true,
  selectable: false,
  searchable: false,
  pagination: false,
  pageSize: 10,
  loading: false,
  showToolbar: false,
  rowKey: 'id'
})

const emit = defineEmits<{
  'row-click': [row: any, index: number]
  'row-select': [selectedRows: any[]]
  'sort-change': [key: string, order: 'asc' | 'desc' | null]
  'page-change': [page: number]
  'search': [keyword: string]
}>()

// 响应式数据
const searchValue = ref('')
const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc' | null>(null)
const selectedRows = ref<string[]>([])
const currentPage = ref(1)

// 计算属性
const tableClasses = computed(() => [
  'w-table',
  `w-table--${props.size}`,
  {
    'w-table--bordered': props.bordered,
    'w-table--striped': props.striped,
    'w-table--hoverable': props.hoverable,
    'w-table--loading': props.loading
  }
])

const visibleColumns = computed(() => {
  return props.columns.filter(col => !col.hidden)
})

const totalColumns = computed(() => {
  let count = visibleColumns.value.length
  if (props.selectable) count++
  return count
})

// 数据过滤和排序
const filteredData = computed(() => {
  let data = [...props.data]
  
  // 搜索过滤
  if (searchValue.value && props.searchable) {
    const keyword = searchValue.value.toLowerCase()
    data = data.filter(row => {
      return visibleColumns.value.some(column => {
        const value = getCellValue(row, column.key)
        return String(value).toLowerCase().includes(keyword)
      })
    })
  }
  
  // 排序
  if (sortKey.value && sortOrder.value) {
    data.sort((a, b) => {
      const aVal = getCellValue(a, sortKey.value!)
      const bVal = getCellValue(b, sortKey.value!)
      
      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }
  
  return data
})

// 分页数据
const totalPages = computed(() => {
  if (!props.pagination) return 1
  return Math.ceil(filteredData.value.length / props.pageSize)
})

const paginatedData = computed(() => {
  if (!props.pagination) return filteredData.value
  
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredData.value.slice(start, end)
})

// 选择相关
const isAllSelected = computed(() => {
  return paginatedData.value.length > 0 && 
    paginatedData.value.every(row => selectedRows.value.includes(getRowKey(row, 0)))
})

const isIndeterminate = computed(() => {
  const selectedCount = paginatedData.value.filter(row => 
    selectedRows.value.includes(getRowKey(row, 0))
  ).length
  return selectedCount > 0 && selectedCount < paginatedData.value.length
})

// 工具函数
const getCellValue = (row: any, key: string) => {
  return key.split('.').reduce((obj, k) => obj?.[k], row)
}

const getRowKey = (row: any, index: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }
  return getCellValue(row, props.rowKey) || index
}

const formatCellValue = (value: any, column: TableColumn) => {
  if (column.formatter) {
    return column.formatter(value)
  }
  return value ?? ''
}

const getColumnClasses = (column: TableColumn) => [
  'w-table__th',
  {
    'w-table__th--sortable': column.sortable,
    'w-table__th--sorted': sortKey.value === column.key
  },
  column.align ? `w-table__th--${column.align}` : ''
]

const getCellClasses = (column: TableColumn, row: any) => [
  'w-table__td',
  column.align ? `w-table__td--${column.align}` : '',
  column.cellClass ? (typeof column.cellClass === 'function' ? column.cellClass(row) : column.cellClass) : ''
]

const getRowClasses = (row: any, index: number) => [
  'w-table__tr',
  {
    'w-table__tr--selected': selectedRows.value.includes(getRowKey(row, index))
  },
  props.rowClass ? (typeof props.rowClass === 'function' ? props.rowClass(row, index) : props.rowClass) : ''
]

const getColumnStyle = (column: TableColumn) => {
  const style: Record<string, any> = {}
  if (column.width) style.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  if (column.minWidth) style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth
  return style
}

// 事件处理
const handleSort = (column: TableColumn) => {
  if (!column.sortable) return
  
  if (sortKey.value === column.key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : sortOrder.value === 'desc' ? null : 'asc'
  } else {
    sortKey.value = column.key
    sortOrder.value = 'asc'
  }
  
  if (sortOrder.value === null) {
    sortKey.value = null
  }
  
  emit('sort-change', sortKey.value, sortOrder.value)
}

const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
}

const handleRowSelect = (row: any, index: number) => {
  const key = getRowKey(row, index)
  const selectedIndex = selectedRows.value.indexOf(key)
  
  if (selectedIndex > -1) {
    selectedRows.value.splice(selectedIndex, 1)
  } else {
    selectedRows.value.push(key)
  }
  
  emit('row-select', selectedRows.value.map(key => {
    return paginatedData.value.find((row, idx) => getRowKey(row, idx) === key)
  }).filter(Boolean))
}

const handleSelectAll = () => {
  if (isAllSelected.value) {
    // 取消全选
    paginatedData.value.forEach((row, index) => {
      const key = getRowKey(row, index)
      const selectedIndex = selectedRows.value.indexOf(key)
      if (selectedIndex > -1) {
        selectedRows.value.splice(selectedIndex, 1)
      }
    })
  } else {
    // 全选
    paginatedData.value.forEach((row, index) => {
      const key = getRowKey(row, index)
      if (!selectedRows.value.includes(key)) {
        selectedRows.value.push(key)
      }
    })
  }
  
  emit('row-select', selectedRows.value.map(key => {
    return paginatedData.value.find((row, idx) => getRowKey(row, idx) === key)
  }).filter(Boolean))
}

const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  emit('page-change', page)
}

// 监听搜索
watch(searchValue, (newValue) => {
  currentPage.value = 1 // 搜索时重置到第一页
  emit('search', newValue)
})

// 暴露方法
defineExpose({
  clearSelection: () => {
    selectedRows.value = []
  },
  selectAll: handleSelectAll,
  getSelectedRows: () => selectedRows.value,
  refresh: () => {
    // 可以用于刷新数据
  }
})
</script>

<style lang="scss">
.w-table {
  width: 100%;
  background: #fff;
  border-radius: 8px;
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  &__title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
  }
  
  &__description {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
  
  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    gap: 16px;
    
    &-left,
    &-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  
  &__search {
    width: 240px;
  }
  
  &__container {
    position: relative;
    overflow-x: auto;
  }
  
  &__table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }
  
  &__thead {
    background: #f9fafb;
  }
  
  &__th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 1px solid #e5e7eb;
    white-space: nowrap;
    
    &--selection {
      width: 48px;
      text-align: center;
    }
    
    &--sortable {
      cursor: pointer;
      user-select: none;
      
      &:hover {
        background: #f3f4f6;
      }
    }
    
    &--center {
      text-align: center;
    }
    
    &--right {
      text-align: right;
    }
  }
  
  &__th-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__sort-icons {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  
  &__sort-icon {
    font-size: 10px;
    color: #9ca3af;
    line-height: 1;
    
    &--active {
      color: #3b82f6;
    }
  }
  
  &__tbody {
    .w-table__tr {
      &:hover {
        background: #f9fafb;
      }
      
      &--selected {
        background: #eff6ff;
      }
    }
  }
  
  &__td {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    color: #374151;
    
    &--selection {
      width: 48px;
      text-align: center;
    }
    
    &--center {
      text-align: center;
    }
    
    &--right {
      text-align: right;
    }
  }
  
  &__empty {
    &-cell {
      padding: 48px 16px;
      text-align: center;
      color: #9ca3af;
      border-bottom: none;
    }
    
    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
  }
  
  &__pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-top: 1px solid #e5e7eb;
    
    &-info {
      font-size: 14px;
      color: #6b7280;
    }
    
    &-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    &-current {
      font-size: 14px;
      color: #374151;
      min-width: 60px;
      text-align: center;
    }
  }
  
  // 尺寸变体
  &--small {
    .w-table__th,
    .w-table__td {
      padding: 8px 12px;
      font-size: 13px;
    }
  }
  
  &--large {
    .w-table__th,
    .w-table__td {
      padding: 16px 20px;
      font-size: 15px;
    }
  }
  
  // 边框变体
  &--bordered {
    border: 1px solid #e5e7eb;
    
    .w-table__th,
    .w-table__td {
      border-right: 1px solid #e5e7eb;
      
      &:last-child {
        border-right: none;
      }
    }
  }
  
  // 斑马纹
  &--striped {
    .w-table__tbody {
      .w-table__tr:nth-child(even) {
        background: #f9fafb;
      }
    }
  }
  
  // 悬停效果
  &--hoverable {
    .w-table__tbody {
      .w-table__tr {
        transition: background-color 0.2s;
        
        &:hover {
          background: #f3f4f6;
        }
      }
    }
  }
  
  // 加载状态
  &--loading {
    .w-table__container {
      min-height: 200px;
    }
  }
}
</style>