/**
 * 日期处理工具库
 */

/**
 * 时间单位
 */
export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

/**
 * 日期范围
 */
export interface DateRange {
  start: Date
  end: Date
}

/**
 * 日期差异结果
 */
export interface DateDiff {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  milliseconds: number
}

/**
 * 日期工具类
 */
export class DateUtils {
  /**
   * 获取当前时间戳
   */
  static now(): number {
    return Date.now()
  }
  
  /**
   * 获取今天的开始时间
   */
  static startOfDay(date: Date = new Date()): Date {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
  }
  
  /**
   * 获取今天的结束时间
   */
  static endOfDay(date: Date = new Date()): Date {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
  }
  
  /**
   * 获取本周的开始时间（周一）
   */
  static startOfWeek(date: Date = new Date()): Date {
    const result = new Date(date)
    const day = result.getDay()
    const diff = result.getDate() - day + (day === 0 ? -6 : 1)
    result.setDate(diff)
    return DateUtils.startOfDay(result)
  }
  
  /**
   * 获取本周的结束时间（周日）
   */
  static endOfWeek(date: Date = new Date()): Date {
    const result = new Date(date)
    const day = result.getDay()
    const diff = result.getDate() - day + (day === 0 ? 0 : 7)
    result.setDate(diff)
    return DateUtils.endOfDay(result)
  }
  
  /**
   * 获取本月的开始时间
   */
  static startOfMonth(date: Date = new Date()): Date {
    const result = new Date(date)
    result.setDate(1)
    return DateUtils.startOfDay(result)
  }
  
  /**
   * 获取本月的结束时间
   */
  static endOfMonth(date: Date = new Date()): Date {
    const result = new Date(date)
    result.setMonth(result.getMonth() + 1, 0)
    return DateUtils.endOfDay(result)
  }
  
  /**
   * 获取本年的开始时间
   */
  static startOfYear(date: Date = new Date()): Date {
    const result = new Date(date)
    result.setMonth(0, 1)
    return DateUtils.startOfDay(result)
  }
  
  /**
   * 获取本年的结束时间
   */
  static endOfYear(date: Date = new Date()): Date {
    const result = new Date(date)
    result.setMonth(11, 31)
    return DateUtils.endOfDay(result)
  }
  
  /**
   * 添加时间
   */
  static add(date: Date, amount: number, unit: TimeUnit): Date {
    const result = new Date(date)
    
    switch (unit) {
      case 'millisecond':
        result.setMilliseconds(result.getMilliseconds() + amount)
        break
      case 'second':
        result.setSeconds(result.getSeconds() + amount)
        break
      case 'minute':
        result.setMinutes(result.getMinutes() + amount)
        break
      case 'hour':
        result.setHours(result.getHours() + amount)
        break
      case 'day':
        result.setDate(result.getDate() + amount)
        break
      case 'week':
        result.setDate(result.getDate() + amount * 7)
        break
      case 'month':
        result.setMonth(result.getMonth() + amount)
        break
      case 'year':
        result.setFullYear(result.getFullYear() + amount)
        break
    }
    
    return result
  }
  
  /**
   * 减少时间
   */
  static subtract(date: Date, amount: number, unit: TimeUnit): Date {
    return DateUtils.add(date, -amount, unit)
  }
  
  /**
   * 计算两个日期的差异
   */
  static diff(date1: Date, date2: Date, unit?: TimeUnit): number | DateDiff {
    const diff = date1.getTime() - date2.getTime()
    
    if (!unit) {
      // 返回详细的差异对象
      const absDiff = Math.abs(diff)
      const years = Math.floor(absDiff / (365.25 * 24 * 60 * 60 * 1000))
      const months = Math.floor((absDiff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000))
      const days = Math.floor((absDiff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000))
      const hours = Math.floor((absDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
      const minutes = Math.floor((absDiff % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((absDiff % (60 * 1000)) / 1000)
      const milliseconds = absDiff % 1000
      
      return {
        years: diff < 0 ? -years : years,
        months: diff < 0 ? -months : months,
        days: diff < 0 ? -days : days,
        hours: diff < 0 ? -hours : hours,
        minutes: diff < 0 ? -minutes : minutes,
        seconds: diff < 0 ? -seconds : seconds,
        milliseconds: diff < 0 ? -milliseconds : milliseconds
      }
    }
    
    // 返回指定单位的差异
    switch (unit) {
      case 'millisecond':
        return diff
      case 'second':
        return Math.floor(diff / 1000)
      case 'minute':
        return Math.floor(diff / (60 * 1000))
      case 'hour':
        return Math.floor(diff / (60 * 60 * 1000))
      case 'day':
        return Math.floor(diff / (24 * 60 * 60 * 1000))
      case 'week':
        return Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
      case 'month':
        return Math.floor(diff / (30.44 * 24 * 60 * 60 * 1000))
      case 'year':
        return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
      default:
        return diff
    }
  }
  
  /**
   * 检查是否为同一天
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString()
  }
  
  /**
   * 检查是否为同一周
   */
  static isSameWeek(date1: Date, date2: Date): boolean {
    const start1 = DateUtils.startOfWeek(date1)
    const start2 = DateUtils.startOfWeek(date2)
    return DateUtils.isSameDay(start1, start2)
  }
  
  /**
   * 检查是否为同一月
   */
  static isSameMonth(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth()
  }
  
  /**
   * 检查是否为同一年
   */
  static isSameYear(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear()
  }
  
  /**
   * 检查日期是否在范围内
   */
  static isInRange(date: Date, start: Date, end: Date): boolean {
    const time = date.getTime()
    return time >= start.getTime() && time <= end.getTime()
  }
  
  /**
   * 检查是否为今天
   */
  static isToday(date: Date): boolean {
    return DateUtils.isSameDay(date, new Date())
  }
  
  /**
   * 检查是否为昨天
   */
  static isYesterday(date: Date): boolean {
    const yesterday = DateUtils.subtract(new Date(), 1, 'day')
    return DateUtils.isSameDay(date, yesterday)
  }
  
  /**
   * 检查是否为明天
   */
  static isTomorrow(date: Date): boolean {
    const tomorrow = DateUtils.add(new Date(), 1, 'day')
    return DateUtils.isSameDay(date, tomorrow)
  }
  
  /**
   * 检查是否为本周
   */
  static isThisWeek(date: Date): boolean {
    return DateUtils.isSameWeek(date, new Date())
  }
  
  /**
   * 检查是否为本月
   */
  static isThisMonth(date: Date): boolean {
    return DateUtils.isSameMonth(date, new Date())
  }
  
  /**
   * 检查是否为本年
   */
  static isThisYear(date: Date): boolean {
    return DateUtils.isSameYear(date, new Date())
  }
  
  /**
   * 检查是否为工作日
   */
  static isWeekday(date: Date): boolean {
    const day = date.getDay()
    return day >= 1 && day <= 5
  }
  
  /**
   * 检查是否为周末
   */
  static isWeekend(date: Date): boolean {
    const day = date.getDay()
    return day === 0 || day === 6
  }
  
  /**
   * 检查是否为闰年
   */
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }
  
  /**
   * 获取月份的天数
   */
  static getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate()
  }
  
  /**
   * 获取年份的天数
   */
  static getDaysInYear(year: number): number {
    return DateUtils.isLeapYear(year) ? 366 : 365
  }
  
  /**
   * 获取年龄
   */
  static getAge(birthDate: Date, referenceDate: Date = new Date()): number {
    let age = referenceDate.getFullYear() - birthDate.getFullYear()
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }
  
  /**
   * 获取星座
   */
  static getZodiac(date: Date): string {
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const zodiacSigns = [
      { name: '水瓶座', start: [1, 20], end: [2, 18] },
      { name: '双鱼座', start: [2, 19], end: [3, 20] },
      { name: '白羊座', start: [3, 21], end: [4, 19] },
      { name: '金牛座', start: [4, 20], end: [5, 20] },
      { name: '双子座', start: [5, 21], end: [6, 21] },
      { name: '巨蟹座', start: [6, 22], end: [7, 22] },
      { name: '狮子座', start: [7, 23], end: [8, 22] },
      { name: '处女座', start: [8, 23], end: [9, 22] },
      { name: '天秤座', start: [9, 23], end: [10, 23] },
      { name: '天蝎座', start: [10, 24], end: [11, 22] },
      { name: '射手座', start: [11, 23], end: [12, 21] },
      { name: '摩羯座', start: [12, 22], end: [1, 19] }
    ]
    
    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start
      const [endMonth, endDay] = sign.end
      
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (startMonth > endMonth && (month === startMonth || month === endMonth))
      ) {
        return sign.name
      }
    }
    
    return ''
  }
  
  /**
   * 获取生肖
   */
  static getChineseZodiac(year: number): string {
    const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
    return animals[(year - 4) % 12]
  }
  
  /**
   * 格式化日期
   */
  static format(date: Date, format: string): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const milliseconds = date.getMilliseconds()
    
    const replacements: Record<string, string> = {
      'YYYY': String(year),
      'YY': String(year).slice(-2),
      'MM': String(month).padStart(2, '0'),
      'M': String(month),
      'DD': String(day).padStart(2, '0'),
      'D': String(day),
      'HH': String(hours).padStart(2, '0'),
      'H': String(hours),
      'mm': String(minutes).padStart(2, '0'),
      'm': String(minutes),
      'ss': String(seconds).padStart(2, '0'),
      's': String(seconds),
      'SSS': String(milliseconds).padStart(3, '0')
    }
    
    let result = format
    for (const [pattern, replacement] of Object.entries(replacements)) {
      result = result.replace(new RegExp(pattern, 'g'), replacement)
    }
    
    return result
  }
  
  /**
   * 解析日期字符串
   */
  static parse(dateString: string, format?: string): Date | null {
    try {
      if (format) {
        // 简单的格式解析实现
        // 这里可以根据需要实现更复杂的解析逻辑
        return new Date(dateString)
      }
      
      const date = new Date(dateString)
      return isNaN(date.getTime()) ? null : date
    } catch {
      return null
    }
  }
  
  /**
   * 获取日期范围
   */
  static getRange(start: Date, end: Date, unit: TimeUnit = 'day'): Date[] {
    const result: Date[] = []
    let current = new Date(start)
    
    while (current <= end) {
      result.push(new Date(current))
      current = DateUtils.add(current, 1, unit)
    }
    
    return result
  }
  
  /**
   * 获取最近的日期范围
   */
  static getRecentRange(amount: number, unit: TimeUnit, endDate: Date = new Date()): DateRange {
    const end = new Date(endDate)
    const start = DateUtils.subtract(end, amount - 1, unit)
    
    return { start, end }
  }
  
  /**
   * 获取时区偏移
   */
  static getTimezoneOffset(date: Date = new Date()): number {
    return date.getTimezoneOffset()
  }
  
  /**
   * 转换为UTC时间
   */
  static toUTC(date: Date): Date {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
  }
  
  /**
   * 从UTC时间转换
   */
  static fromUTC(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  }
}

/**
 * 便捷的日期函数
 */
export const date = {
  // 基础操作
  now: DateUtils.now,
  add: DateUtils.add,
  subtract: DateUtils.subtract,
  diff: DateUtils.diff,
  format: DateUtils.format,
  parse: DateUtils.parse,
  
  // 时间范围
  startOfDay: DateUtils.startOfDay,
  endOfDay: DateUtils.endOfDay,
  startOfWeek: DateUtils.startOfWeek,
  endOfWeek: DateUtils.endOfWeek,
  startOfMonth: DateUtils.startOfMonth,
  endOfMonth: DateUtils.endOfMonth,
  startOfYear: DateUtils.startOfYear,
  endOfYear: DateUtils.endOfYear,
  
  // 比较
  isSameDay: DateUtils.isSameDay,
  isSameWeek: DateUtils.isSameWeek,
  isSameMonth: DateUtils.isSameMonth,
  isSameYear: DateUtils.isSameYear,
  isInRange: DateUtils.isInRange,
  
  // 判断
  isToday: DateUtils.isToday,
  isYesterday: DateUtils.isYesterday,
  isTomorrow: DateUtils.isTomorrow,
  isThisWeek: DateUtils.isThisWeek,
  isThisMonth: DateUtils.isThisMonth,
  isThisYear: DateUtils.isThisYear,
  isWeekday: DateUtils.isWeekday,
  isWeekend: DateUtils.isWeekend,
  isLeapYear: DateUtils.isLeapYear,
  
  // 计算
  getDaysInMonth: DateUtils.getDaysInMonth,
  getDaysInYear: DateUtils.getDaysInYear,
  getAge: DateUtils.getAge,
  getZodiac: DateUtils.getZodiac,
  getChineseZodiac: DateUtils.getChineseZodiac,
  
  // 范围
  getRange: DateUtils.getRange,
  getRecentRange: DateUtils.getRecentRange,
  
  // 时区
  getTimezoneOffset: DateUtils.getTimezoneOffset,
  toUTC: DateUtils.toUTC,
  fromUTC: DateUtils.fromUTC
}