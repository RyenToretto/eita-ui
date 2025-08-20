# Wonder Lib

一个为 Nuxt 4 设计的综合性 UI 组件库，支持自动导入和 TypeScript。

## 特性

- 🚀 **Nuxt 4 优化**: 专为 Nuxt 4 设计，完美集成
- 📦 **自动导入**: 组件、composables 和工具函数自动导入
- 🎨 **丰富组件**: 包含基础组件和业务组件
- 🔧 **实用工具**: 提供格式化、验证、日期处理等工具
- 📱 **响应式**: 支持移动端和桌面端
- 🌙 **主题系统**: 内置主题切换支持
- 💾 **状态管理**: 集成存储和表单管理
- 🔒 **类型安全**: 完整的 TypeScript 支持

## 安装

```bash
npm install wonder-lib
# 或
pnpm add wonder-lib
# 或
yarn add wonder-lib
```

## 使用

### 1. 在 Nuxt 项目中注册模块

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'wonder-lib/nuxt'
  ],
  
  // Wonder Lib 配置
  wonderLib: {
    prefix: 'W', // 组件前缀
    globalStyles: true, // 是否注入全局样式
    theme: {
      primaryColor: '#3b82f6',
      borderRadius: '0.375rem'
    }
  }
})
```

### 2. 使用组件

```vue
<template>
  <div>
    <!-- 基础组件 -->
    <WButton @click="handleClick">点击我</WButton>
    <WInput v-model="inputValue" placeholder="请输入内容" />
    <WModal v-model="showModal" title="模态框">
      <p>这是模态框内容</p>
    </WModal>
    
    <!-- 业务组件 -->
    <WForm :config="formConfig" @submit="handleSubmit" />
    <WTable :data="tableData" :columns="columns" />
  </div>
</template>

<script setup>
// 组件会自动导入，无需手动 import
const inputValue = ref('')
const showModal = ref(false)

const handleClick = () => {
  showModal.value = true
}
</script>
```

### 3. 使用 Composables

```typescript
// 自动导入，无需手动 import
const { data, loading, error } = useApi('/api/users')
const { user, login, logout } = useAuth()
const { theme, toggleTheme } = useTheme()
const { form, validate, reset } = useForm({
  name: '',
  email: ''
})
```

### 4. 使用工具函数

```typescript
// 格式化工具
const formattedDate = format.date(new Date(), 'YYYY-MM-DD')
const formattedNumber = format.number(1234.56, { currency: 'CNY' })

// 验证工具
const isValidEmail = validate.email('test@example.com')
const isValidPhone = validate.phone('13800138000')

// 日期工具
const tomorrow = date.addDays(new Date(), 1)
const isToday = date.isToday(new Date())

// 通用工具
const clonedObj = utils.deepClone(originalObj)
const debouncedFn = utils.debounce(fn, 300)
```

## API 文档

### 组件

#### 基础组件
- `WButton` - 按钮组件
- `WInput` - 输入框组件
- `WModal` - 模态框组件
- `WCard` - 卡片组件
- `WLoading` - 加载组件

#### 业务组件
- `WForm` - 表单组件
- `WTable` - 表格组件
- `WChart` - 图表组件

### Composables

#### API 相关
- `useApi(url, options)` - API 请求
- `useGet(url, options)` - GET 请求
- `usePost(url, options)` - POST 请求
- `usePut(url, options)` - PUT 请求
- `useDelete(url, options)` - DELETE 请求
- `usePagination(fetchFn, options)` - 分页处理

#### 认证相关
- `useAuth()` - 用户认证

#### 主题相关
- `useTheme()` - 主题管理

#### 表单相关
- `useForm(initialData, config)` - 表单管理
- `useFieldValidation(rules)` - 字段验证
- `useFormValidation(schema)` - 表单验证

#### 存储相关
- `useStorage(key, defaultValue, config)` - 通用存储
- `useLocalStorage(key, defaultValue)` - 本地存储
- `useSessionStorage(key, defaultValue)` - 会话存储
- `useMemoryStorage(key, defaultValue)` - 内存存储

### 工具函数

#### 格式化工具 (`format`)
- `date(date, format)` - 日期格式化
- `number(number, options)` - 数字格式化
- `currency(amount, currency)` - 货币格式化
- `fileSize(bytes)` - 文件大小格式化

#### 验证工具 (`validate`)
- `email(email)` - 邮箱验证
- `phone(phone)` - 手机号验证
- `idCard(idCard)` - 身份证验证
- `url(url)` - URL 验证

#### 日期工具 (`date`)
- `addDays(date, days)` - 添加天数
- `isToday(date)` - 是否为今天
- `format(date, format)` - 日期格式化
- `diff(date1, date2, unit)` - 日期差值

#### 通用工具 (`utils`)
- `deepClone(obj)` - 深拷贝
- `debounce(fn, delay)` - 防抖
- `throttle(fn, delay)` - 节流
- `generateId()` - 生成唯一ID

## 配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  wonderLib: {
    // 组件前缀，默认为 'W'
    prefix: 'Wonder',
    
    // 是否注入全局样式，默认为 true
    globalStyles: true,
    
    // 主题配置
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      borderRadius: '0.375rem',
      fontFamily: 'Inter, sans-serif'
    },
    
    // 自动导入配置
    autoImport: {
      components: true, // 自动导入组件
      composables: true, // 自动导入 composables
      utils: true // 自动导入工具函数
    }
  }
})
```

## 开发

```bash
# 克隆项目
git clone https://github.com/your-org/wonder-lib.git

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！