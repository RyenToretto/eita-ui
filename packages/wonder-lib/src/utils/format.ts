/**
 * 格式化工具库
 */

/**
 * 日期格式化选项
 */
export interface DateFormatOptions {
  format?: string
  locale?: string
  timezone?: string
}

/**
 * 数字格式化选项
 */
export interface NumberFormatOptions {
  decimals?: number
  thousandsSeparator?: string
  decimalSeparator?: string
  prefix?: string
  suffix?: string
}

/**
 * 文件大小单位
 */
type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB'

/**
 * 日期格式化
 */
export class DateFormatter {
  /**
   * 格式化日期
   */
  static format(
    date: Date | string | number,
    format = 'YYYY-MM-DD HH:mm:ss',
    options: DateFormatOptions = {}
  ): string {
    const d = new Date(date)
    
    if (isNaN(d.getTime())) {
      return ''
    }
    
    const { locale = 'zh-CN', timezone } = options
    
    // 如果指定了时区，使用 Intl.DateTimeFormat
    if (timezone) {
      return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(d)
    }
    
    // 简单的格式化实现
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  }
  
  /**
   * 相对时间格式化
   */
  static relative(date: Date | string | number, locale = 'zh-CN'): string {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)
    
    if (locale === 'zh-CN') {
      if (seconds < 60) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 30) return `${days}天前`
      if (months < 12) return `${months}个月前`
      return `${years}年前`
    } else {
      if (seconds < 60) return 'just now'
      if (minutes < 60) return `${minutes} minutes ago`
      if (hours < 24) return `${hours} hours ago`
      if (days < 30) return `${days} days ago`
      if (months < 12) return `${months} months ago`
      return `${years} years ago`
    }
  }
  
  /**
   * 格式化为友好的日期显示
   */
  static friendly(date: Date | string | number, locale = 'zh-CN'): string {
    const d = new Date(date)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    
    if (dateOnly.getTime() === today.getTime()) {
      return locale === 'zh-CN' ? '今天' : 'Today'
    }
    
    if (dateOnly.getTime() === yesterday.getTime()) {
      return locale === 'zh-CN' ? '昨天' : 'Yesterday'
    }
    
    const diffDays = Math.floor((today.getTime() - dateOnly.getTime()) / (24 * 60 * 60 * 1000))
    
    if (diffDays > 0 && diffDays <= 7) {
      return locale === 'zh-CN' ? `${diffDays}天前` : `${diffDays} days ago`
    }
    
    return DateFormatter.format(d, 'YYYY-MM-DD')
  }
}

/**
 * 数字格式化
 */
export class NumberFormatter {
  /**
   * 格式化数字
   */
  static format(num: number, options: NumberFormatOptions = {}): string {
    const {
      decimals = 2,
      thousandsSeparator = ',',
      decimalSeparator = '.',
      prefix = '',
      suffix = ''
    } = options
    
    if (isNaN(num)) {
      return ''
    }
    
    // 处理小数位
    const fixed = num.toFixed(decimals)
    const [integer, decimal] = fixed.split('.')
    
    // 添加千位分隔符
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)
    
    // 组合结果
    let result = formattedInteger
    if (decimals > 0 && decimal) {
      result += decimalSeparator + decimal
    }
    
    return prefix + result + suffix
  }
  
  /**
   * 格式化货币
   */
  static currency(num: number, currency = 'CNY', locale = 'zh-CN'): string {
    if (isNaN(num)) {
      return ''
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(num)
  }
  
  /**
   * 格式化百分比
   */
  static percentage(num: number, decimals = 2): string {
    if (isNaN(num)) {
      return ''
    }
    
    return (num * 100).toFixed(decimals) + '%'
  }
  
  /**
   * 格式化文件大小
   */
  static fileSize(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes: FileSizeUnit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  }
  
  /**
   * 格式化大数字（如：1.2K, 3.4M）
   */
  static compact(num: number, decimals = 1): string {
    if (isNaN(num)) {
      return ''
    }
    
    const abs = Math.abs(num)
    
    if (abs >= 1e9) {
      return (num / 1e9).toFixed(decimals) + 'B'
    }
    if (abs >= 1e6) {
      return (num / 1e6).toFixed(decimals) + 'M'
    }
    if (abs >= 1e3) {
      return (num / 1e3).toFixed(decimals) + 'K'
    }
    
    return num.toString()
  }
}

/**
 * 文本格式化
 */
export class TextFormatter {
  /**
   * 截断文本
   */
  static truncate(text: string, length: number, suffix = '...'): string {
    if (!text || text.length <= length) {
      return text
    }
    
    return text.substring(0, length) + suffix
  }
  
  /**
   * 首字母大写
   */
  static capitalize(text: string): string {
    if (!text) return text
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }
  
  /**
   * 标题格式化（每个单词首字母大写）
   */
  static title(text: string): string {
    if (!text) return text
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  }
  
  /**
   * 驼峰命名转换
   */
  static camelCase(text: string): string {
    if (!text) return text
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '')
  }
  
  /**
   * 短横线命名转换
   */
  static kebabCase(text: string): string {
    if (!text) return text
    return text
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  }
  
  /**
   * 下划线命名转换
   */
  static snakeCase(text: string): string {
    if (!text) return text
    return text
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase()
  }
  
  /**
   * 移除HTML标签
   */
  static stripHtml(html: string): string {
    if (!html) return html
    return html.replace(/<[^>]*>/g, '')
  }
  
  /**
   * 转义HTML字符
   */
  static escapeHtml(text: string): string {
    if (!text) return text
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }
  
  /**
   * 反转义HTML字符
   */
  static unescapeHtml(html: string): string {
    if (!html) return html
    const map: Record<string, string> = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'"
    }
    return html.replace(/&(amp|lt|gt|quot|#39);/g, (m) => map[m])
  }
  
  /**
   * 高亮关键词
   */
  static highlight(text: string, keyword: string, className = 'highlight'): string {
    if (!text || !keyword) return text
    
    const regex = new RegExp(`(${keyword})`, 'gi')
    return text.replace(regex, `<span class="${className}">$1</span>`)
  }
  
  /**
   * 生成随机字符串
   */
  static random(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
  
  /**
   * 生成UUID
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }
  
  /**
   * 手机号脱敏
   */
  static maskPhone(phone: string): string {
    if (!phone || phone.length < 7) return phone
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  
  /**
   * 邮箱脱敏
   */
  static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email
    const [username, domain] = email.split('@')
    if (username.length <= 2) return email
    const masked = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
    return masked + '@' + domain
  }
  
  /**
   * 身份证脱敏
   */
  static maskIdCard(idCard: string): string {
    if (!idCard || idCard.length < 8) return idCard
    return idCard.replace(/(\d{4})\d+(\d{4})/, '$1******$2')
  }
}

/**
 * 便捷的格式化函数
 */
// 导出常用的格式化函数
export const formatCurrency = NumberFormatter.currency
export const formatDate = DateFormatter.format
export const formatNumber = NumberFormatter.format
export const formatPercentage = NumberFormatter.percentage
export const formatFileSize = NumberFormatter.fileSize

export const format = {
  // 日期格式化
  date: DateFormatter.format,
  dateRelative: DateFormatter.relative,
  dateFriendly: DateFormatter.friendly,
  
  // 数字格式化
  number: NumberFormatter.format,
  currency: NumberFormatter.currency,
  percentage: NumberFormatter.percentage,
  fileSize: NumberFormatter.fileSize,
  compact: NumberFormatter.compact,
  
  // 文本格式化
  truncate: TextFormatter.truncate,
  capitalize: TextFormatter.capitalize,
  title: TextFormatter.title,
  camelCase: TextFormatter.camelCase,
  kebabCase: TextFormatter.kebabCase,
  snakeCase: TextFormatter.snakeCase,
  stripHtml: TextFormatter.stripHtml,
  escapeHtml: TextFormatter.escapeHtml,
  unescapeHtml: TextFormatter.unescapeHtml,
  highlight: TextFormatter.highlight,
  random: TextFormatter.random,
  uuid: TextFormatter.uuid,
  maskPhone: TextFormatter.maskPhone,
  maskEmail: TextFormatter.maskEmail,
  maskIdCard: TextFormatter.maskIdCard
}