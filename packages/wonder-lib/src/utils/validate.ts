/**
 * 验证工具库
 */

/**
 * 验证结果接口
 */
export interface ValidationResult {
  valid: boolean
  message?: string
}

/**
 * 基础验证类
 */
export class Validator {
  /**
   * 检查是否为空
   */
  static isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true
    if (typeof value === 'string') return value.trim().length === 0
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
  }
  
  /**
   * 检查是否不为空
   */
  static isNotEmpty(value: any): boolean {
    return !Validator.isEmpty(value)
  }
  
  /**
   * 检查是否为数字
   */
  static isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value)
  }
  
  /**
   * 检查是否为整数
   */
  static isInteger(value: any): boolean {
    return Validator.isNumber(value) && Number.isInteger(value)
  }
  
  /**
   * 检查是否为正数
   */
  static isPositive(value: any): boolean {
    return Validator.isNumber(value) && value > 0
  }
  
  /**
   * 检查是否为负数
   */
  static isNegative(value: any): boolean {
    return Validator.isNumber(value) && value < 0
  }
  
  /**
   * 检查是否在范围内
   */
  static isInRange(value: number, min: number, max: number): boolean {
    return Validator.isNumber(value) && value >= min && value <= max
  }
  
  /**
   * 检查字符串长度
   */
  static isLengthInRange(value: string, min: number, max: number): boolean {
    if (typeof value !== 'string') return false
    const length = value.length
    return length >= min && length <= max
  }
  
  /**
   * 检查是否为布尔值
   */
  static isBoolean(value: any): boolean {
    return typeof value === 'boolean'
  }
  
  /**
   * 检查是否为字符串
   */
  static isString(value: any): boolean {
    return typeof value === 'string'
  }
  
  /**
   * 检查是否为数组
   */
  static isArray(value: any): boolean {
    return Array.isArray(value)
  }
  
  /**
   * 检查是否为对象
   */
  static isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }
  
  /**
   * 检查是否为函数
   */
  static isFunction(value: any): boolean {
    return typeof value === 'function'
  }
  
  /**
   * 检查是否为日期
   */
  static isDate(value: any): boolean {
    return value instanceof Date && !isNaN(value.getTime())
  }
  
  /**
   * 检查是否为正则表达式
   */
  static isRegExp(value: any): boolean {
    return value instanceof RegExp
  }
}

/**
 * 字符串验证类
 */
export class StringValidator {
  /**
   * 邮箱验证
   */
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  /**
   * 手机号验证（中国大陆）
   */
  static isPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }
  
  /**
   * 固定电话验证
   */
  static isTel(tel: string): boolean {
    const telRegex = /^(\d{3,4}-)?\d{7,8}$/
    return telRegex.test(tel)
  }
  
  /**
   * 身份证号验证（中国大陆）
   */
  static isIdCard(idCard: string): boolean {
    const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    if (!idCardRegex.test(idCard)) {
      return false
    }
    
    // 验证校验码
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += parseInt(idCard[i]) * weights[i]
    }
    
    const checkCode = checkCodes[sum % 11]
    return checkCode === idCard[17].toUpperCase()
  }
  
  /**
   * URL验证
   */
  static isUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
  
  /**
   * IP地址验证
   */
  static isIP(ip: string): boolean {
    const ipv4Regex = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }
  
  /**
   * MAC地址验证
   */
  static isMac(mac: string): boolean {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
    return macRegex.test(mac)
  }
  
  /**
   * 中文验证
   */
  static isChinese(text: string): boolean {
    const chineseRegex = /^[\u4e00-\u9fa5]+$/
    return chineseRegex.test(text)
  }
  
  /**
   * 英文验证
   */
  static isEnglish(text: string): boolean {
    const englishRegex = /^[a-zA-Z]+$/
    return englishRegex.test(text)
  }
  
  /**
   * 数字字符串验证
   */
  static isNumeric(text: string): boolean {
    const numericRegex = /^\d+$/
    return numericRegex.test(text)
  }
  
  /**
   * 字母数字验证
   */
  static isAlphanumeric(text: string): boolean {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/
    return alphanumericRegex.test(text)
  }
  
  /**
   * 密码强度验证
   */
  static isStrongPassword(password: string): boolean {
    // 至少8位，包含大小写字母、数字和特殊字符
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  }
  
  /**
   * 银行卡号验证
   */
  static isBankCard(cardNumber: string): boolean {
    // 移除空格和连字符
    const cleaned = cardNumber.replace(/[\s-]/g, '')
    
    // 检查是否全为数字且长度在13-19位之间
    if (!/^\d{13,19}$/.test(cleaned)) {
      return false
    }
    
    // Luhn算法验证
    let sum = 0
    let isEven = false
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i])
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  }
  
  /**
   * 邮政编码验证（中国）
   */
  static isPostalCode(code: string): boolean {
    const postalCodeRegex = /^[1-9]\d{5}$/
    return postalCodeRegex.test(code)
  }
  
  /**
   * QQ号验证
   */
  static isQQ(qq: string): boolean {
    const qqRegex = /^[1-9]\d{4,10}$/
    return qqRegex.test(qq)
  }
  
  /**
   * 微信号验证
   */
  static isWechat(wechat: string): boolean {
    const wechatRegex = /^[a-zA-Z]([a-zA-Z0-9_-]{5,19})+$/
    return wechatRegex.test(wechat)
  }
}

/**
 * 日期验证类
 */
export class DateValidator {
  /**
   * 检查是否为有效日期
   */
  static isValidDate(date: any): boolean {
    if (date instanceof Date) {
      return !isNaN(date.getTime())
    }
    
    if (typeof date === 'string' || typeof date === 'number') {
      const d = new Date(date)
      return !isNaN(d.getTime())
    }
    
    return false
  }
  
  /**
   * 检查日期是否在范围内
   */
  static isInRange(date: Date, start: Date, end: Date): boolean {
    if (!DateValidator.isValidDate(date) || !DateValidator.isValidDate(start) || !DateValidator.isValidDate(end)) {
      return false
    }
    
    const time = date.getTime()
    return time >= start.getTime() && time <= end.getTime()
  }
  
  /**
   * 检查是否为今天
   */
  static isToday(date: Date): boolean {
    if (!DateValidator.isValidDate(date)) {
      return false
    }
    
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  /**
   * 检查是否为过去的日期
   */
  static isPast(date: Date): boolean {
    if (!DateValidator.isValidDate(date)) {
      return false
    }
    
    return date.getTime() < Date.now()
  }
  
  /**
   * 检查是否为未来的日期
   */
  static isFuture(date: Date): boolean {
    if (!DateValidator.isValidDate(date)) {
      return false
    }
    
    return date.getTime() > Date.now()
  }
  
  /**
   * 检查是否为工作日
   */
  static isWeekday(date: Date): boolean {
    if (!DateValidator.isValidDate(date)) {
      return false
    }
    
    const day = date.getDay()
    return day >= 1 && day <= 5
  }
  
  /**
   * 检查是否为周末
   */
  static isWeekend(date: Date): boolean {
    if (!DateValidator.isValidDate(date)) {
      return false
    }
    
    const day = date.getDay()
    return day === 0 || day === 6
  }
  
  /**
   * 检查年龄是否在范围内
   */
  static isAgeInRange(birthDate: Date, minAge: number, maxAge: number): boolean {
    if (!DateValidator.isValidDate(birthDate)) {
      return false
    }
    
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    let actualAge = age
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      actualAge--
    }
    
    return actualAge >= minAge && actualAge <= maxAge
  }
}

/**
 * 文件验证类
 */
export class FileValidator {
  /**
   * 检查文件类型
   */
  static isType(file: File, types: string[]): boolean {
    return types.includes(file.type)
  }
  
  /**
   * 检查文件扩展名
   */
  static hasExtension(filename: string, extensions: string[]): boolean {
    const ext = filename.split('.').pop()?.toLowerCase()
    return ext ? extensions.includes(ext) : false
  }
  
  /**
   * 检查文件大小
   */
  static isSizeInRange(file: File, minSize: number, maxSize: number): boolean {
    return file.size >= minSize && file.size <= maxSize
  }
  
  /**
   * 检查是否为图片文件
   */
  static isImage(file: File): boolean {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    return FileValidator.isType(file, imageTypes)
  }
  
  /**
   * 检查是否为视频文件
   */
  static isVideo(file: File): boolean {
    const videoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm']
    return FileValidator.isType(file, videoTypes)
  }
  
  /**
   * 检查是否为音频文件
   */
  static isAudio(file: File): boolean {
    const audioTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac']
    return FileValidator.isType(file, audioTypes)
  }
  
  /**
   * 检查是否为文档文件
   */
  static isDocument(file: File): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ]
    return FileValidator.isType(file, documentTypes)
  }
}

/**
 * 综合验证函数
 */
// 导出常用的验证函数
export const validateEmail = StringValidator.isEmail
export const validatePhone = StringValidator.isPhone
export const validateUrl = StringValidator.isUrl
export const validateIdCard = StringValidator.isIdCard

export const validate = {
  // 基础验证
  isEmpty: Validator.isEmpty,
  isNotEmpty: Validator.isNotEmpty,
  isNumber: Validator.isNumber,
  isInteger: Validator.isInteger,
  isPositive: Validator.isPositive,
  isNegative: Validator.isNegative,
  isInRange: Validator.isInRange,
  isLengthInRange: Validator.isLengthInRange,
  isBoolean: Validator.isBoolean,
  isString: Validator.isString,
  isArray: Validator.isArray,
  isObject: Validator.isObject,
  isFunction: Validator.isFunction,
  isDate: Validator.isDate,
  isRegExp: Validator.isRegExp,
  
  // 字符串验证
  isEmail: StringValidator.isEmail,
  isPhone: StringValidator.isPhone,
  isTel: StringValidator.isTel,
  isIdCard: StringValidator.isIdCard,
  isUrl: StringValidator.isUrl,
  isIP: StringValidator.isIP,
  isMac: StringValidator.isMac,
  isChinese: StringValidator.isChinese,
  isEnglish: StringValidator.isEnglish,
  isNumeric: StringValidator.isNumeric,
  isAlphanumeric: StringValidator.isAlphanumeric,
  isStrongPassword: StringValidator.isStrongPassword,
  isBankCard: StringValidator.isBankCard,
  isPostalCode: StringValidator.isPostalCode,
  isQQ: StringValidator.isQQ,
  isWechat: StringValidator.isWechat,
  
  // 日期验证
  isValidDate: DateValidator.isValidDate,
  isDateInRange: DateValidator.isInRange,
  isToday: DateValidator.isToday,
  isPast: DateValidator.isPast,
  isFuture: DateValidator.isFuture,
  isWeekday: DateValidator.isWeekday,
  isWeekend: DateValidator.isWeekend,
  isAgeInRange: DateValidator.isAgeInRange,
  
  // 文件验证
  isFileType: FileValidator.isType,
  hasFileExtension: FileValidator.hasExtension,
  isFileSizeInRange: FileValidator.isSizeInRange,
  isImage: FileValidator.isImage,
  isVideo: FileValidator.isVideo,
  isAudio: FileValidator.isAudio,
  isDocument: FileValidator.isDocument
}

/**
 * 创建验证器
 */
export function createValidator(rules: Record<string, (value: any) => ValidationResult>) {
  return {
    validate(data: Record<string, any>): Record<string, ValidationResult> {
      const results: Record<string, ValidationResult> = {}
      
      for (const [field, rule] of Object.entries(rules)) {
        results[field] = rule(data[field])
      }
      
      return results
    },
    
    isValid(data: Record<string, any>): boolean {
      const results = this.validate(data)
      return Object.values(results).every(result => result.valid)
    },
    
    getErrors(data: Record<string, any>): string[] {
      const results = this.validate(data)
      return Object.values(results)
        .filter(result => !result.valid)
        .map(result => result.message!)
    }
  }
}