/**
 * 通用工具库
 */

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
  
  return obj
}

/**
 * 深度合并对象
 */
export function deepMerge<T extends Record<string, any>>(...objects: Partial<T>[]): T {
  const result = {} as T
  
  for (const obj of objects) {
    if (!obj) continue
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          result[key] = deepMerge(result[key] || {}, value)
        } else {
          result[key] = value
        }
      }
    }
  }
  
  return result
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 生成唯一ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 生成UUID
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 生成随机字符串
 */
export function randomString(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成随机数
 */
export function randomNumber(min = 0, max = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 数组去重
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * 数组去重（根据属性）
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * 数组分组
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * 数组分块
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * 数组打乱
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 数组求和
 */
export function sum(array: number[]): number {
  return array.reduce((total, num) => total + num, 0)
}

/**
 * 数组平均值
 */
export function average(array: number[]): number {
  return array.length > 0 ? sum(array) / array.length : 0
}

/**
 * 数组最大值
 */
export function max(array: number[]): number {
  return Math.max(...array)
}

/**
 * 数组最小值
 */
export function min(array: number[]): number {
  return Math.min(...array)
}

/**
 * 对象键值对互换
 */
export function invert(obj: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[obj[key]] = key
    }
  }
  return result
}

/**
 * 获取对象指定路径的值
 */
export function get(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.')
  let result = obj
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue
    }
    result = result[key]
  }
  
  return result !== undefined ? result : defaultValue
}

/**
 * 设置对象指定路径的值
 */
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  
  current[keys[keys.length - 1]] = value
}

/**
 * 删除对象指定路径的值
 */
export function unset(obj: any, path: string): boolean {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      return false
    }
    current = current[key]
  }
  
  const lastKey = keys[keys.length - 1]
  if (lastKey in current) {
    delete current[lastKey]
    return true
  }
  
  return false
}

/**
 * 检查对象是否有指定路径
 */
export function has(obj: any, path: string): boolean {
  const keys = path.split('.')
  let current = obj
  
  for (const key of keys) {
    if (current == null || typeof current !== 'object' || !(key in current)) {
      return false
    }
    current = current[key]
  }
  
  return true
}

/**
 * 获取对象所有路径
 */
export function paths(obj: any, prefix = ''): string[] {
  const result: string[] = []
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const path = prefix ? `${prefix}.${key}` : key
      result.push(path)
      
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        result.push(...paths(obj[key], path))
      }
    }
  }
  
  return result
}

/**
 * 扁平化对象
 */
export function flatten(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {}
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const path = prefix ? `${prefix}.${key}` : key
      
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(result, flatten(obj[key], path))
      } else {
        result[path] = obj[key]
      }
    }
  }
  
  return result
}

/**
 * 反扁平化对象
 */
export function unflatten(obj: Record<string, any>): any {
  const result: any = {}
  
  for (const path in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, path)) {
      set(result, path, obj[path])
    }
  }
  
  return result
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    times?: number
    delay?: number
    onRetry?: (error: Error, attempt: number) => void
  } = {}
): Promise<T> {
  const { times = 3, delay: delayMs = 1000, onRetry } = options
  
  let lastError: Error
  
  for (let i = 0; i < times; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (i < times - 1) {
        onRetry?.(lastError, i + 1)
        if (delayMs > 0) {
          await delay(delayMs)
        }
      }
    }
  }
  
  throw lastError!
}

/**
 * 超时包装
 */
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    })
  ])
}

/**
 * 缓存函数结果
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * 函数组合
 */
export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg)
}

/**
 * 管道函数
 */
export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg)
}

/**
 * 柯里化函数
 */
export function curry<T extends (...args: any[]) => any>(fn: T): any {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...args)
    }
    return (...nextArgs: any[]) => curried(...args, ...nextArgs)
  }
}

/**
 * 偏函数
 */
export function partial<T extends (...args: any[]) => any>(
  fn: T,
  ...partialArgs: any[]
): (...args: any[]) => ReturnType<T> {
  return (...args: any[]) => fn(...partialArgs, ...args)
}

/**
 * 类型检查
 */
export const is = {
  undefined: (value: any): value is undefined => typeof value === 'undefined',
  null: (value: any): value is null => value === null,
  boolean: (value: any): value is boolean => typeof value === 'boolean',
  number: (value: any): value is number => typeof value === 'number' && !isNaN(value),
  string: (value: any): value is string => typeof value === 'string',
  function: (value: any): value is Function => typeof value === 'function',
  object: (value: any): value is object => value !== null && typeof value === 'object',
  array: (value: any): value is any[] => Array.isArray(value),
  date: (value: any): value is Date => value instanceof Date,
  regexp: (value: any): value is RegExp => value instanceof RegExp,
  error: (value: any): value is Error => value instanceof Error,
  promise: (value: any): value is Promise<any> => value instanceof Promise,
  empty: (value: any): boolean => {
    if (is.null(value) || is.undefined(value)) return true
    if (is.string(value) || is.array(value)) return value.length === 0
    if (is.object(value)) return Object.keys(value).length === 0
    return false
  },
  equal: (a: any, b: any): boolean => {
    if (a === b) return true
    if (a == null || b == null) return false
    if (typeof a !== typeof b) return false
    
    if (is.array(a) && is.array(b)) {
      if (a.length !== b.length) return false
      return a.every((item, index) => is.equal(item, b[index]))
    }
    
    if (is.object(a) && is.object(b)) {
      const keysA = Object.keys(a)
      const keysB = Object.keys(b)
      if (keysA.length !== keysB.length) return false
      return keysA.every(key => is.equal(a[key], b[key]))
    }
    
    return false
  }
}

/**
 * 通用工具对象
 */
export const utils = {
  // 对象操作
  deepClone,
  deepMerge,
  get,
  set,
  unset,
  has,
  paths,
  flatten,
  unflatten,
  invert,
  
  // 数组操作
  unique,
  uniqueBy,
  groupBy,
  chunk,
  shuffle,
  sum,
  average,
  max,
  min,
  
  // 函数操作
  debounce,
  throttle,
  memoize,
  compose,
  pipe,
  curry,
  partial,
  
  // 异步操作
  delay,
  retry,
  timeout,
  
  // 生成器
  generateId,
  generateUUID,
  randomString,
  randomNumber,
  
  // 类型检查
  is
}