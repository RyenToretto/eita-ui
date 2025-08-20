import { ref, watch, nextTick, type Ref } from 'vue'

/**
 * 存储类型
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'memory'

/**
 * 存储配置
 */
export interface StorageConfig {
  type?: StorageType
  prefix?: string
  serializer?: {
    read: (value: string) => any
    write: (value: any) => string
  }
  syncAcrossTabs?: boolean
  onError?: (error: Error) => void
}

/**
 * 默认序列化器
 */
const defaultSerializer = {
  read: (value: string) => {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  },
  write: (value: any) => {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
}

/**
 * 内存存储实现
 */
class MemoryStorage {
  private data = new Map<string, string>()
  
  getItem(key: string): string | null {
    return this.data.get(key) || null
  }
  
  setItem(key: string, value: string): void {
    this.data.set(key, value)
  }
  
  removeItem(key: string): void {
    this.data.delete(key)
  }
  
  clear(): void {
    this.data.clear()
  }
  
  key(index: number): string | null {
    const keys = Array.from(this.data.keys())
    return keys[index] || null
  }
  
  get length(): number {
    return this.data.size
  }
}

// 全局内存存储实例
const internalMemoryStorage = new MemoryStorage()

/**
 * 获取存储实例
 */
function getStorage(type: StorageType): Storage {
  if (typeof window === 'undefined') {
    return internalMemoryStorage as any
  }
  
  switch (type) {
    case 'localStorage':
      return window.localStorage
    case 'sessionStorage':
      return window.sessionStorage
    case 'memory':
      return internalMemoryStorage as any
    default:
      return window.localStorage
  }
}

/**
 * 存储管理 Hook
 */
export function useStorage<T>(
  key: string,
  defaultValue: T,
  config: StorageConfig = {}
): [Ref<T>, (value: T) => void, () => void] {
  const {
    type = 'localStorage',
    prefix = '',
    serializer = defaultSerializer,
    syncAcrossTabs = true,
    onError
  } = config
  
  const storage = getStorage(type)
  const prefixedKey = prefix ? `${prefix}:${key}` : key
  
  // 读取初始值
  const read = (): T => {
    try {
      const item = storage.getItem(prefixedKey)
      if (item === null) {
        return defaultValue
      }
      return serializer.read(item)
    } catch (error) {
      if (onError) {
        onError(error as Error)
      }
      return defaultValue
    }
  }
  
  // 写入值
  const write = (value: T): void => {
    try {
      if (value === null || value === undefined) {
        storage.removeItem(prefixedKey)
      } else {
        storage.setItem(prefixedKey, serializer.write(value))
      }
    } catch (error) {
      if (onError) {
        onError(error as Error)
      }
    }
  }
  
  // 删除值
  const remove = (): void => {
    try {
      storage.removeItem(prefixedKey)
      storedValue.value = defaultValue
    } catch (error) {
      if (onError) {
        onError(error as Error)
      }
    }
  }
  
  const storedValue = ref<T>(read())
  
  // 监听值变化并写入存储
  watch(
    storedValue,
    (newValue) => {
      write(newValue)
    },
    { deep: true }
  )
  
  // 跨标签页同步
  if (syncAcrossTabs && typeof window !== 'undefined' && type !== 'memory') {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === prefixedKey && e.newValue !== null) {
        try {
          storedValue.value = serializer.read(e.newValue)
        } catch (error) {
          if (onError) {
            onError(error as Error)
          }
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // 清理监听器
    if (typeof window !== 'undefined') {
      const cleanup = () => {
        window.removeEventListener('storage', handleStorageChange)
      }
      
      // 在组件卸载时清理
      if (typeof process !== 'undefined' && process.client) {
        window.addEventListener('beforeunload', cleanup)
      }
    }
  }
  
  return [storedValue, (value: T) => { storedValue.value = value }, remove]
}

/**
 * 简化的本地存储 Hook
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  config: Omit<StorageConfig, 'type'> = {}
) {
  return useStorage(key, defaultValue, { ...config, type: 'localStorage' })
}

/**
 * 简化的会话存储 Hook
 */
export function useSessionStorage<T>(
  key: string,
  defaultValue: T,
  config: Omit<StorageConfig, 'type'> = {}
) {
  return useStorage(key, defaultValue, { ...config, type: 'sessionStorage' })
}

/**
 * 简化的内存存储 Hook
 */
export function useMemoryStorage<T>(
  key: string,
  defaultValue: T,
  config: Omit<StorageConfig, 'type'> = {}
) {
  return useStorage(key, defaultValue, { ...config, type: 'memory' })
}

/**
 * 存储管理器
 */
export class StorageManager {
  private config: StorageConfig
  private storage: Storage
  
  constructor(config: StorageConfig = {}) {
    this.config = { ...config, type: config.type || 'localStorage' }
    this.storage = getStorage(this.config.type!)
  }
  
  /**
   * 获取值
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      const item = this.storage.getItem(prefixedKey)
      
      if (item === null) {
        return defaultValue || null
      }
      
      const serializer = this.config.serializer || defaultSerializer
      return serializer.read(item)
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error)
      }
      return defaultValue || null
    }
  }
  
  /**
   * 设置值
   */
  set<T>(key: string, value: T): void {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      const serializer = this.config.serializer || defaultSerializer
      
      if (value === null || value === undefined) {
        this.storage.removeItem(prefixedKey)
      } else {
        this.storage.setItem(prefixedKey, serializer.write(value))
      }
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error)
      }
    }
  }
  
  /**
   * 删除值
   */
  remove(key: string): void {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      this.storage.removeItem(prefixedKey)
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error)
      }
    }
  }
  
  /**
   * 清空存储
   */
  clear(): void {
    try {
      if (this.config.prefix) {
        // 只清除带前缀的项
        const keysToRemove: string[] = []
        for (let i = 0; i < this.storage.length; i++) {
          const key = this.storage.key(i)
          if (key && key.startsWith(`${this.config.prefix}:`)) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => this.storage.removeItem(key))
      } else {
        this.storage.clear()
      }
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error)
      }
    }
  }
  
  /**
   * 获取所有键
   */
  keys(): string[] {
    try {
      const keys: string[] = []
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i)
        if (key) {
          if (this.config.prefix) {
            if (key.startsWith(`${this.config.prefix}:`)) {
              keys.push(key.substring(this.config.prefix.length + 1))
            }
          } else {
            keys.push(key)
          }
        }
      }
      return keys
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error)
      }
      return []
    }
  }
  
  /**
   * 检查键是否存在
   */
  has(key: string): boolean {
    try {
      const prefixedKey = this.getPrefixedKey(key)
      return this.storage.getItem(prefixedKey) !== null
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error)
      }
      return false
    }
  }
  
  /**
   * 获取存储大小
   */
  size(): number {
    try {
      if (this.config.prefix) {
        return this.keys().length
      }
      return this.storage.length
    } catch (error) {
      if (this.config.onError) {
        this.config.onError(error as Error)
      }
      return 0
    }
  }
  
  /**
   * 获取带前缀的键
   */
  private getPrefixedKey(key: string): string {
    return this.config.prefix ? `${this.config.prefix}:${key}` : key
  }
}

/**
 * 创建存储管理器实例
 */
export function createStorageManager(config: StorageConfig = {}) {
  return new StorageManager(config)
}

/**
 * 默认存储管理器实例
 */
export const storage = new StorageManager()
export const localStorage = new StorageManager({ type: 'localStorage' })
export const sessionStorage = new StorageManager({ type: 'sessionStorage' })
export const memoryStorage = new StorageManager({ type: 'memory' })