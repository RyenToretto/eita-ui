/**
 * URL 和路由处理工具库
 */

/**
 * URL 参数类型
 */
export type URLParams = Record<string, string | number | boolean | null | undefined>

/**
 * 路由参数类型
 */
export interface RouteParams {
  path: string
  query?: URLParams
  hash?: string
}

/**
 * URL 解析结果
 */
export interface ParsedURL {
  protocol: string
  host: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  query: URLParams
}

/**
 * URL 工具类
 */
export class URLUtils {
  /**
   * 解析 URL
   */
  static parse(url: string): ParsedURL {
    try {
      const urlObj = new URL(url)
      const query: URLParams = {}
      
      // 解析查询参数
      urlObj.searchParams.forEach((value, key) => {
        query[key] = value
      })
      
      return {
        protocol: urlObj.protocol,
        host: urlObj.host,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        query
      }
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`)
    }
  }
  
  /**
   * 构建 URL
   */
  static build(base: string, params?: RouteParams): string {
    try {
      const url = new URL(base)
      
      if (params?.path) {
        url.pathname = params.path
      }
      
      if (params?.query) {
        // 清空现有查询参数
        url.search = ''
        
        // 添加新的查询参数
        Object.entries(params.query).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            url.searchParams.set(key, String(value))
          }
        })
      }
      
      if (params?.hash) {
        url.hash = params.hash
      }
      
      return url.toString()
    } catch (error) {
      throw new Error(`Invalid base URL: ${base}`)
    }
  }
  
  /**
   * 添加查询参数
   */
  static addQuery(url: string, params: URLParams): string {
    const parsed = URLUtils.parse(url)
    const mergedQuery = { ...parsed.query, ...params }
    
    return URLUtils.build(url, { query: mergedQuery })
  }
  
  /**
   * 移除查询参数
   */
  static removeQuery(url: string, keys: string[]): string {
    const parsed = URLUtils.parse(url)
    const filteredQuery: URLParams = {}
    
    Object.entries(parsed.query).forEach(([key, value]) => {
      if (!keys.includes(key)) {
        filteredQuery[key] = value
      }
    })
    
    return URLUtils.build(url, { query: filteredQuery })
  }
  
  /**
   * 获取查询参数
   */
  static getQuery(url: string, key?: string): URLParams | string | undefined {
    const parsed = URLUtils.parse(url)
    
    if (key) {
      return parsed.query[key] as string | undefined
    }
    
    return parsed.query
  }
  
  /**
   * 检查是否为绝对 URL
   */
  static isAbsolute(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * 检查是否为相对 URL
   */
  static isRelative(url: string): boolean {
    return !URLUtils.isAbsolute(url)
  }
  
  /**
   * 连接 URL 路径
   */
  static join(...paths: string[]): string {
    return paths
      .map((path, index) => {
        // 移除开头的斜杠（除了第一个）
        if (index > 0 && path.startsWith('/')) {
          path = path.slice(1)
        }
        
        // 移除结尾的斜杠（除了最后一个）
        if (index < paths.length - 1 && path.endsWith('/')) {
          path = path.slice(0, -1)
        }
        
        return path
      })
      .filter(Boolean)
      .join('/')
  }
  
  /**
   * 规范化 URL 路径
   */
  static normalize(path: string): string {
    // 移除多余的斜杠
    path = path.replace(/\/+/g, '/')
    
    // 处理 . 和 ..
    const segments = path.split('/')
    const normalized: string[] = []
    
    for (const segment of segments) {
      if (segment === '.' || segment === '') {
        continue
      } else if (segment === '..') {
        normalized.pop()
      } else {
        normalized.push(segment)
      }
    }
    
    let result = normalized.join('/')
    
    // 保持开头的斜杠
    if (path.startsWith('/')) {
      result = '/' + result
    }
    
    // 保持结尾的斜杠
    if (path.endsWith('/') && !result.endsWith('/')) {
      result += '/'
    }
    
    return result || '/'
  }
  
  /**
   * 获取文件扩展名
   */
  static getExtension(url: string): string {
    const parsed = URLUtils.parse(url)
    const pathname = parsed.pathname
    const lastDot = pathname.lastIndexOf('.')
    
    if (lastDot === -1 || lastDot === pathname.length - 1) {
      return ''
    }
    
    return pathname.slice(lastDot + 1).toLowerCase()
  }
  
  /**
   * 获取文件名
   */
  static getFilename(url: string, withExtension = true): string {
    const parsed = URLUtils.parse(url)
    const pathname = parsed.pathname
    const segments = pathname.split('/')
    const filename = segments[segments.length - 1] || ''
    
    if (!withExtension) {
      const lastDot = filename.lastIndexOf('.')
      if (lastDot !== -1) {
        return filename.slice(0, lastDot)
      }
    }
    
    return filename
  }
  
  /**
   * 获取目录路径
   */
  static getDirname(url: string): string {
    const parsed = URLUtils.parse(url)
    const pathname = parsed.pathname
    const segments = pathname.split('/')
    
    // 移除最后一个段（文件名）
    segments.pop()
    
    return segments.join('/') || '/'
  }
  
  /**
   * 检查 URL 是否匹配模式
   */
  static match(url: string, pattern: string): boolean {
    // 简单的通配符匹配
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    )
    
    return regex.test(url)
  }
  
  /**
   * 编码 URL 组件
   */
  static encode(str: string): string {
    return encodeURIComponent(str)
  }
  
  /**
   * 解码 URL 组件
   */
  static decode(str: string): string {
    try {
      return decodeURIComponent(str)
    } catch {
      return str
    }
  }
  
  /**
   * 序列化查询参数
   */
  static stringify(params: URLParams): string {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.set(key, String(value))
      }
    })
    
    return searchParams.toString()
  }
  
  /**
   * 解析查询字符串
   */
  static parseQuery(query: string): URLParams {
    const params: URLParams = {}
    const searchParams = new URLSearchParams(query)
    
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    
    return params
  }
  
  /**
   * 获取域名
   */
  static getDomain(url: string): string {
    try {
      const parsed = new URL(url)
      return parsed.hostname
    } catch {
      return ''
    }
  }
  
  /**
   * 获取子域名
   */
  static getSubdomain(url: string): string {
    const domain = URLUtils.getDomain(url)
    const parts = domain.split('.')
    
    if (parts.length > 2) {
      return parts.slice(0, -2).join('.')
    }
    
    return ''
  }
  
  /**
   * 检查是否为同源 URL
   */
  static isSameOrigin(url1: string, url2: string): boolean {
    try {
      const parsed1 = new URL(url1)
      const parsed2 = new URL(url2)
      
      return (
        parsed1.protocol === parsed2.protocol &&
        parsed1.hostname === parsed2.hostname &&
        parsed1.port === parsed2.port
      )
    } catch {
      return false
    }
  }
  
  /**
   * 转换为绝对 URL
   */
  static toAbsolute(url: string, base?: string): string {
    try {
      if (URLUtils.isAbsolute(url)) {
        return url
      }
      
      const baseUrl = base || (typeof window !== 'undefined' ? window.location.href : '')
      return new URL(url, baseUrl).toString()
    } catch {
      return url
    }
  }
  
  /**
   * 转换为相对 URL
   */
  static toRelative(url: string, base?: string): string {
    try {
      const baseUrl = base || (typeof window !== 'undefined' ? window.location.href : '')
      const parsed = new URL(url)
      const baseParsed = new URL(baseUrl)
      
      if (parsed.origin !== baseParsed.origin) {
        return url
      }
      
      return parsed.pathname + parsed.search + parsed.hash
    } catch {
      return url
    }
  }
}

/**
 * 路由工具类
 */
export class RouteUtils {
  /**
   * 解析路由模式
   */
  static parsePattern(pattern: string): {
    regex: RegExp
    keys: string[]
  } {
    const keys: string[] = []
    
    // 转换路由模式为正则表达式
    const regex = new RegExp(
      '^' +
      pattern
        .replace(/\//g, '\\/')
        .replace(/:([^/]+)/g, (match, key) => {
          keys.push(key)
          return '([^/]+)'
        })
        .replace(/\*/g, '(.*)')
      + '$'
    )
    
    return { regex, keys }
  }
  
  /**
   * 匹配路由
   */
  static match(path: string, pattern: string): {
    matched: boolean
    params: Record<string, string>
  } {
    const { regex, keys } = RouteUtils.parsePattern(pattern)
    const match = path.match(regex)
    
    if (!match) {
      return { matched: false, params: {} }
    }
    
    const params: Record<string, string> = {}
    
    keys.forEach((key, index) => {
      params[key] = match[index + 1] || ''
    })
    
    return { matched: true, params }
  }
  
  /**
   * 生成路由路径
   */
  static generate(pattern: string, params: Record<string, string | number> = {}): string {
    let path = pattern
    
    // 替换参数
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(new RegExp(`:${key}`, 'g'), String(value))
    })
    
    return path
  }
  
  /**
   * 检查路由是否激活
   */
  static isActive(currentPath: string, targetPath: string, exact = false): boolean {
    if (exact) {
      return currentPath === targetPath
    }
    
    return currentPath.startsWith(targetPath)
  }
}

/**
 * 便捷的 URL 函数
 */
export const url = {
  // 基础操作
  parse: URLUtils.parse,
  build: URLUtils.build,
  join: URLUtils.join,
  normalize: URLUtils.normalize,
  
  // 查询参数
  addQuery: URLUtils.addQuery,
  removeQuery: URLUtils.removeQuery,
  getQuery: URLUtils.getQuery,
  stringify: URLUtils.stringify,
  parseQuery: URLUtils.parseQuery,
  
  // 路径操作
  getExtension: URLUtils.getExtension,
  getFilename: URLUtils.getFilename,
  getDirname: URLUtils.getDirname,
  getDomain: URLUtils.getDomain,
  getSubdomain: URLUtils.getSubdomain,
  
  // 判断
  isAbsolute: URLUtils.isAbsolute,
  isRelative: URLUtils.isRelative,
  isSameOrigin: URLUtils.isSameOrigin,
  match: URLUtils.match,
  
  // 转换
  toAbsolute: URLUtils.toAbsolute,
  toRelative: URLUtils.toRelative,
  encode: URLUtils.encode,
  decode: URLUtils.decode
}

/**
 * 便捷的路由函数
 */
export const route = {
  parsePattern: RouteUtils.parsePattern,
  match: RouteUtils.match,
  generate: RouteUtils.generate,
  isActive: RouteUtils.isActive
}