// 组件通用类型定义

// 按钮类型
export type ButtonType = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'

// 输入框类型
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
export type InputSize = 'small' | 'medium' | 'large'

// 模态框类型
export type ModalSize = 'small' | 'medium' | 'large' | 'full'

// 通用尺寸
export type Size = 'small' | 'medium' | 'large'

// 颜色主题
export type ColorTheme = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

// 组件基础属性
export interface BaseComponentProps {
  /**
   * 组件类名
   */
  class?: string
  /**
   * 组件样式
   */
  style?: string | Record<string, any>
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否加载中
   */
  loading?: boolean
}

// 按钮组件属性
export interface ButtonProps extends BaseComponentProps {
  /**
   * 按钮类型
   */
  type?: ButtonType
  /**
   * 按钮尺寸
   */
  size?: ButtonSize
  /**
   * 按钮变体
   */
  variant?: ButtonVariant
  /**
   * 是否为块级按钮
   */
  block?: boolean
  /**
   * 图标
   */
  icon?: string
  /**
   * 图标位置
   */
  iconPosition?: 'left' | 'right'
}

// 输入框组件属性
export interface InputProps extends BaseComponentProps {
  /**
   * 输入框类型
   */
  type?: InputType
  /**
   * 输入框尺寸
   */
  size?: InputSize
  /**
   * 占位符
   */
  placeholder?: string
  /**
   * 是否只读
   */
  readonly?: boolean
  /**
   * 最大长度
   */
  maxlength?: number
  /**
   * 是否显示清除按钮
   */
  clearable?: boolean
  /**
   * 前缀图标
   */
  prefixIcon?: string
  /**
   * 后缀图标
   */
  suffixIcon?: string
}

// 模态框组件属性
export interface ModalProps extends BaseComponentProps {
  /**
   * 是否显示
   */
  modelValue?: boolean
  /**
   * 模态框尺寸
   */
  size?: ModalSize
  /**
   * 标题
   */
  title?: string
  /**
   * 是否显示关闭按钮
   */
  closable?: boolean
  /**
   * 是否点击遮罩关闭
   */
  maskClosable?: boolean
  /**
   * 是否显示底部
   */
  showFooter?: boolean
}

// 卡片阴影类型
export type CardShadow = 'none' | 'small' | 'medium' | 'large' | 'extra-large'

// 卡片内边距类型
export type CardPadding = 'none' | 'small' | 'medium' | 'large'

// 卡片属性接口
export interface CardProps extends BaseComponentProps {
  title?: string
  shadow?: CardShadow
  padding?: CardPadding
  rounded?: boolean
  bordered?: boolean
  hoverable?: boolean
}

// 加载类型
export type LoadingType = 'spinner' | 'dots' | 'pulse' | 'bars'

// 加载属性接口
export interface LoadingProps extends BaseComponentProps {
  modelValue: boolean
  type?: LoadingType
  size?: Size
  overlay?: boolean
  text?: string
}

// 表单验证规则
export interface FormRule {
  required?: boolean
  pattern?: RegExp
  min?: number
  max?: number
  validator?: (value: any) => boolean | string
  message?: string
}

// 表单属性
export interface FormProps {
  title?: string
  description?: string
  layout?: 'vertical' | 'horizontal' | 'inline'
  size?: 'small' | 'medium' | 'large'
  showActions?: boolean
  showCancel?: boolean
  submitText?: string
  cancelText?: string
  loading?: boolean
  disabled?: boolean
  validateOnChange?: boolean
  validateOnBlur?: boolean
  initialValues?: Record<string, any>
  rules?: Record<string, FormRule[]>
}

// 表格列定义
export interface TableColumn {
  key: string
  title: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  hidden?: boolean
  formatter?: (value: any) => string
  cellClass?: string | ((row: any) => string)
}

// 表格属性
export interface TableProps {
  data: any[]
  columns: TableColumn[]
  title?: string
  description?: string
  size?: 'small' | 'medium' | 'large'
  bordered?: boolean
  striped?: boolean
  hoverable?: boolean
  selectable?: boolean
  searchable?: boolean
  pagination?: boolean
  pageSize?: number
  loading?: boolean
  showToolbar?: boolean
  rowKey?: string | ((row: any, index: number) => string)
  rowClass?: string | ((row: any, index: number) => string)
}

// 图表数据
export interface ChartData {
  label: string
  value: number
  x?: number | string
  y?: number
  color?: string
}

// 图表属性
export interface ChartProps {
  data: ChartData[]
  type?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
  title?: string
  description?: string
  width?: number
  height?: number
  responsive?: boolean
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  showTooltip?: boolean
  loading?: boolean
  smooth?: boolean
  fill?: boolean
}