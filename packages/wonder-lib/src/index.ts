/**
 * Wonder-lib 主入口文件
 */

// 导出类型定义
export * from './types'

// 导出组件
export * from './components'

// 导出 Composables
export {
  useApi,
  useGet,
  usePost,
  usePut,
  useDelete,
  usePagination,
  useAuth,
  useTheme,
  useForm,
  useStorage,
  useLocalStorage,
  useSessionStorage,
  useMemoryStorage,
  StorageManager,
  useFieldValidation,
  useFormValidation
} from './composables'

// 导出工具库
export {
  // 格式化工具
  DateFormatter,
  NumberFormatter,
  TextFormatter,
  format,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercentage,
  formatFileSize,
  
  // 验证工具
  Validator,
  StringValidator,
  DateValidator,
  FileValidator,
  validate,
  validateEmail,
  validatePhone,
  validateUrl,
  validateIdCard,
  createValidator,
  
  // 日期工具
  DateUtils,
  date,
  
  // 通用工具
  deepClone,
  deepMerge,
  debounce,
  throttle,
  generateId,
  generateUUID,
  randomString,
  randomNumber,
  unique,
  uniqueBy,
  groupBy,
  chunk,
  shuffle,
  sum,
  average,
  max,
  min,
  invert,
  get,
  set,
  unset,
  has,
  paths,
  flatten,
  unflatten,
  delay,
  retry,
  timeout,
  memoize,
  compose,
  pipe,
  curry,
  partial,
  is,
  utils,
  
  // URL 工具
  URLUtils,
  RouteUtils,
  url,
  route
} from './utils'

// Version
export const version = '1.0.0'