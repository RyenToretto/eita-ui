<template>
  <div class="page-components">
    <div class="components-container">
      <h1 class="components-title">Wonder-Lib 组件库演示</h1>
      <p class="components-description">展示已实现的基础组件和业务组件</p>

      <!-- 基础组件演示 -->
      <section class="components-section">
        <h2 class="section-title">基础组件</h2>
        
        <!-- 按钮组件 -->
        <div class="component-demo">
          <h3 class="demo-title">WButton 按钮组件</h3>
          <div class="demo-content">
            <div class="button-group">
              <WButton type="primary">主要按钮</WButton>
              <WButton type="secondary">次要按钮</WButton>
              <WButton type="success">成功按钮</WButton>
              <WButton type="warning">警告按钮</WButton>
              <WButton type="danger">危险按钮</WButton>
            </div>
            <div class="button-group">
              <WButton size="small">小按钮</WButton>
              <WButton size="medium">中按钮</WButton>
              <WButton size="large">大按钮</WButton>
            </div>
            <div class="button-group">
              <WButton variant="outline" type="primary">轮廓按钮</WButton>
              <WButton variant="ghost" type="primary">幽灵按钮</WButton>
              <WButton :loading="buttonLoading" type="primary" @click="handleButtonClick">加载按钮</WButton>
              <WButton disabled type="primary">禁用按钮</WButton>
            </div>
          </div>
        </div>

        <!-- 输入框组件 -->
        <div class="component-demo">
          <h3 class="demo-title">WInput 输入框组件</h3>
          <div class="demo-content">
            <div class="input-group">
              <WInput v-model="inputValue" placeholder="请输入内容" />
              <WInput v-model="passwordValue" type="password" placeholder="请输入密码" />
              <WInput v-model="emailValue" type="email" placeholder="请输入邮箱" />
            </div>
            <div class="input-group">
              <WInput v-model="inputValue" size="small" placeholder="小尺寸" />
              <WInput v-model="inputValue" size="medium" placeholder="中尺寸" />
              <WInput v-model="inputValue" size="large" placeholder="大尺寸" />
            </div>
            <div class="input-group">
              <WInput v-model="inputValue" disabled placeholder="禁用状态" />
              <WInput v-model="inputValue" readonly placeholder="只读状态" />
              <WInput v-model="inputValue" error="输入格式错误" placeholder="错误状态" />
            </div>
          </div>
        </div>

        <!-- 卡片组件 -->
        <div class="component-demo">
          <h3 class="demo-title">WCard 卡片组件</h3>
          <div class="demo-content">
            <div class="card-grid">
              <WCard title="基础卡片" description="这是一个基础卡片的描述信息">
                <p>卡片内容区域，可以放置任何内容。</p>
              </WCard>
              
              <WCard shadow="hover">
                <template #header>
                  <div class="custom-header">
                    <h4>自定义头部</h4>
                    <WButton size="small" variant="ghost">操作</WButton>
                  </div>
                </template>
                <p>这是一个带有自定义头部的卡片。</p>
                <template #footer>
                  <div class="card-footer">
                    <span class="footer-text">自定义底部</span>
                  </div>
                </template>
              </WCard>
              
              <WCard hoverable>
                <h4>可悬停卡片</h4>
                <p>鼠标悬停时会有阴影效果。</p>
              </WCard>
            </div>
          </div>
        </div>

        <!-- 加载组件 -->
        <div class="component-demo">
          <h3 class="demo-title">WLoading 加载组件</h3>
          <div class="demo-content">
            <div class="loading-group">
              <div class="loading-item">
                <WLoading type="spinner" />
                <span>旋转器</span>
              </div>
              <div class="loading-item">
                <WLoading type="dots" />
                <span>点状</span>
              </div>
              <div class="loading-item">
                <WLoading type="pulse" />
                <span>脉冲</span>
              </div>
            </div>
            <div class="loading-demo-area">
              <WButton @click="toggleOverlayLoading">{{ overlayLoading ? '隐藏' : '显示' }}遮罩加载</WButton>
              <div class="loading-overlay-demo">
                <WLoading v-if="overlayLoading" overlay text="加载中..." />
                <p>这是一个演示区域，点击按钮显示遮罩加载效果。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 业务组件演示 -->
      <section class="components-section">
        <h2 class="section-title">业务组件</h2>
        
        <!-- 表单组件 -->
        <div class="component-demo">
          <h3 class="demo-title">WForm 表单组件</h3>
          <div class="demo-content">
            <WForm
              ref="formRef"
              title="用户信息表单"
              description="请填写完整的用户信息"
              :initial-values="formData"
              :rules="formRules"
              :loading="formLoading"
              @submit="handleFormSubmit"
              @cancel="handleFormCancel"
              show-cancel
            >
              <div class="form-row">
                <WInput
                  v-model="formData.name"
                  placeholder="请输入姓名"
                  label="姓名"
                />
                <WInput
                  v-model="formData.email"
                  type="email"
                  placeholder="请输入邮箱"
                  label="邮箱"
                />
              </div>
              <div class="form-row">
                <WInput
                  v-model="formData.phone"
                  placeholder="请输入手机号"
                  label="手机号"
                />
                <WInput
                  v-model="formData.company"
                  placeholder="请输入公司名称"
                  label="公司"
                />
              </div>
            </WForm>
          </div>
        </div>

        <!-- 表格组件 -->
        <div class="component-demo">
          <h3 class="demo-title">WTable 表格组件</h3>
          <div class="demo-content">
            <WTable
              :data="tableData"
              :columns="tableColumns"
              title="用户列表"
              description="系统中的所有用户信息"
              :loading="tableLoading"
              selectable
              searchable
              pagination
              :page-size="5"
              show-toolbar
              hoverable
              @row-click="handleRowClick"
              @row-select="handleRowSelect"
            >
              <template #toolbar-right>
                <WButton size="small" type="primary" @click="refreshTable">刷新</WButton>
                <WButton size="small" @click="addUser">添加用户</WButton>
              </template>
              
              <template #cell-status="{ value }">
                <span :class="getStatusClass(value)">{{ getStatusText(value) }}</span>
              </template>
              
              <template #cell-actions="{ row }">
                <div class="table-actions">
                  <WButton size="small" variant="ghost" @click="editUser(row)">编辑</WButton>
                  <WButton size="small" variant="ghost" type="danger" @click="deleteUser(row)">删除</WButton>
                </div>
              </template>
            </WTable>
          </div>
        </div>

        <!-- 图表组件 -->
        <div class="component-demo">
          <h3 class="demo-title">WChart 图表组件</h3>
          <div class="demo-content">
            <div class="chart-grid">
              <WChart
                :data="lineChartData"
                type="line"
                title="月度销售趋势"
                :loading="chartLoading"
                responsive
                smooth
              />
              
              <WChart
                :data="barChartData"
                type="bar"
                title="产品销量对比"
                responsive
              />
              
              <WChart
                :data="pieChartData"
                type="pie"
                title="市场份额分布"
                responsive
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 模态框演示 -->
      <section class="components-section">
        <h2 class="section-title">交互组件</h2>
        
        <div class="component-demo">
          <h3 class="demo-title">WModal 模态框组件</h3>
          <div class="demo-content">
            <div class="modal-buttons">
              <WButton @click="showBasicModal">基础模态框</WButton>
              <WButton @click="showCustomModal">自定义模态框</WButton>
              <WButton @click="showConfirmModal">确认模态框</WButton>
            </div>
            
            <!-- 基础模态框 -->
            <WModal
              v-model="basicModalVisible"
              title="基础模态框"
              @confirm="handleBasicConfirm"
              @cancel="handleBasicCancel"
            >
              <p>这是一个基础的模态框内容。</p>
              <p>您可以在这里放置任何内容。</p>
            </WModal>
            
            <!-- 自定义模态框 -->
            <WModal
              v-model="customModalVisible"
              width="800px"
              :show-footer="false"
            >
              <template #header>
                <div class="custom-modal-header">
                  <h3>自定义头部</h3>
                  <WButton size="small" variant="ghost" @click="customModalVisible = false">×</WButton>
                </div>
              </template>
              
              <div class="custom-modal-content">
                <h4>自定义内容区域</h4>
                <p>这是一个完全自定义的模态框，包含自定义头部和内容。</p>
                <div class="custom-actions">
                  <WButton @click="customModalVisible = false">关闭</WButton>
                </div>
              </div>
            </WModal>
            
            <!-- 确认模态框 -->
            <WModal
              v-model="confirmModalVisible"
              title="确认操作"
              type="warning"
              @confirm="handleConfirmAction"
              @cancel="confirmModalVisible = false"
            >
              <p>您确定要执行此操作吗？此操作不可撤销。</p>
            </WModal>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 页面元数据
definePageMeta({
  title: '组件演示 - Wonder-Lib'
})

// 响应式数据
const buttonLoading = ref(false)
const overlayLoading = ref(false)
const formLoading = ref(false)
const tableLoading = ref(false)
const chartLoading = ref(false)

// 输入框数据
const inputValue = ref('')
const passwordValue = ref('')
const emailValue = ref('')

// 表单数据
const formRef = ref()
const formData = ref({
  name: '',
  email: '',
  phone: '',
  company: ''
})

const formRules = {
  name: [
    { required: true, message: '请输入姓名' },
    { min: 2, message: '姓名至少2个字符' }
  ],
  email: [
    { required: true, message: '请输入邮箱' },
    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
  ]
}

// 表格数据
const tableData = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', phone: '13800138001', status: 'active', createTime: '2024-01-15' },
  { id: 2, name: '李四', email: 'lisi@example.com', phone: '13800138002', status: 'inactive', createTime: '2024-01-16' },
  { id: 3, name: '王五', email: 'wangwu@example.com', phone: '13800138003', status: 'active', createTime: '2024-01-17' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', phone: '13800138004', status: 'pending', createTime: '2024-01-18' },
  { id: 5, name: '钱七', email: 'qianqi@example.com', phone: '13800138005', status: 'active', createTime: '2024-01-19' },
  { id: 6, name: '孙八', email: 'sunba@example.com', phone: '13800138006', status: 'inactive', createTime: '2024-01-20' }
])

const tableColumns = [
  { key: 'id', title: 'ID', width: 80, sortable: true },
  { key: 'name', title: '姓名', sortable: true },
  { key: 'email', title: '邮箱' },
  { key: 'phone', title: '手机号' },
  { key: 'status', title: '状态', align: 'center' },
  { key: 'createTime', title: '创建时间', sortable: true },
  { key: 'actions', title: '操作', align: 'center', width: 150 }
]

// 图表数据
const lineChartData = ref([
  { label: '1月', value: 120 },
  { label: '2月', value: 190 },
  { label: '3月', value: 300 },
  { label: '4月', value: 500 },
  { label: '5月', value: 200 },
  { label: '6月', value: 300 }
])

const barChartData = ref([
  { label: '产品A', value: 320 },
  { label: '产品B', value: 240 },
  { label: '产品C', value: 180 },
  { label: '产品D', value: 150 }
])

const pieChartData = ref([
  { label: '移动端', value: 45 },
  { label: 'PC端', value: 35 },
  { label: '平板', value: 20 }
])

// 模态框状态
const basicModalVisible = ref(false)
const customModalVisible = ref(false)
const confirmModalVisible = ref(false)

// 事件处理函数
const handleButtonClick = () => {
  buttonLoading.value = true
  setTimeout(() => {
    buttonLoading.value = false
  }, 2000)
}

const toggleOverlayLoading = () => {
  overlayLoading.value = !overlayLoading.value
  if (overlayLoading.value) {
    setTimeout(() => {
      overlayLoading.value = false
    }, 3000)
  }
}

const handleFormSubmit = (data: any) => {
  console.log('表单提交:', data)
  formLoading.value = true
  setTimeout(() => {
    formLoading.value = false
    alert('表单提交成功！')
  }, 2000)
}

const handleFormCancel = () => {
  console.log('表单取消')
  formData.value = {
    name: '',
    email: '',
    phone: '',
    company: ''
  }
}

const handleRowClick = (row: any, index: number) => {
  console.log('行点击:', row, index)
}

const handleRowSelect = (selectedRows: any[]) => {
  console.log('选中行:', selectedRows)
}

const refreshTable = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 1000)
}

const addUser = () => {
  console.log('添加用户')
}

const editUser = (row: any) => {
  console.log('编辑用户:', row)
}

const deleteUser = (row: any) => {
  console.log('删除用户:', row)
}

const getStatusClass = (status: string) => {
  const classes = {
    active: 'status-active',
    inactive: 'status-inactive',
    pending: 'status-pending'
  }
  return classes[status as keyof typeof classes] || ''
}

const getStatusText = (status: string) => {
  const texts = {
    active: '活跃',
    inactive: '非活跃',
    pending: '待审核'
  }
  return texts[status as keyof typeof texts] || status
}

const showBasicModal = () => {
  basicModalVisible.value = true
}

const showCustomModal = () => {
  customModalVisible.value = true
}

const showConfirmModal = () => {
  confirmModalVisible.value = true
}

const handleBasicConfirm = () => {
  console.log('基础模态框确认')
  basicModalVisible.value = false
}

const handleBasicCancel = () => {
  console.log('基础模态框取消')
  basicModalVisible.value = false
}

const handleConfirmAction = () => {
  console.log('确认操作执行')
  confirmModalVisible.value = false
  alert('操作已执行！')
}

// 模拟图表加载
onMounted(() => {
  chartLoading.value = true
  setTimeout(() => {
    chartLoading.value = false
  }, 1500)
})
</script>

<style lang="scss">
.page-components {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24px;
  
  .components-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .components-title {
    font-size: 32px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 8px 0;
    text-align: center;
  }
  
  .components-description {
    font-size: 16px;
    color: #6b7280;
    text-align: center;
    margin: 0 0 48px 0;
  }
  
  .components-section {
    margin-bottom: 48px;
    
    .section-title {
      font-size: 24px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 24px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
  }
  
  .component-demo {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    .demo-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }
    
    .demo-content {
      .button-group {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }
      
      .input-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }
      
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        
        .custom-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          h4 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }
        }
        
        .card-footer {
          text-align: right;
          
          .footer-text {
            font-size: 14px;
            color: #6b7280;
          }
        }
      }
      
      .loading-group {
        display: flex;
        gap: 32px;
        margin-bottom: 24px;
        
        .loading-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          
          span {
            font-size: 14px;
            color: #6b7280;
          }
        }
      }
      
      .loading-demo-area {
        .loading-overlay-demo {
          position: relative;
          background: #f9fafb;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 48px;
          margin-top: 16px;
          text-align: center;
          min-height: 120px;
          
          p {
            margin: 0;
            color: #6b7280;
          }
        }
      }
      
      .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 16px;
      }
      
      .table-actions {
        display: flex;
        gap: 8px;
        justify-content: center;
      }
      
      .chart-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
      }
      
      .modal-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      
      .custom-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0 16px 0;
        border-bottom: 1px solid #e5e7eb;
        
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
      }
      
      .custom-modal-content {
        padding: 24px 0;
        
        h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .custom-actions {
          margin-top: 24px;
          text-align: right;
        }
      }
    }
  }
  
  // 状态样式
  .status-active {
    color: #10b981;
    font-weight: 500;
  }
  
  .status-inactive {
    color: #ef4444;
    font-weight: 500;
  }
  
  .status-pending {
    color: #f59e0b;
    font-weight: 500;
  }
}
</style>