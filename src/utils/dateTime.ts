/**
 * 日期时间工具
 * Date Time Utilities
 */

import dayjs, { Dayjs } from 'dayjs';

/**
 * 格式化日期
 */
export function formatDate(date: Date | Dayjs | string, format: string = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format);
}

/**
 * 格式化时间
 */
export function formatTime(date: Date | Dayjs | string, format: string = 'HH:mm:ss'): string {
  return dayjs(date).format(format);
}

/**
 * 格式化日期时间
 */
export function formatDateTime(
  date: Date | Dayjs | string,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  return dayjs(date).format(format);
}

/**
 * 获取当前日期字符串
 */
export function getCurrentDate(format: string = 'YYYY-MM-DD'): string {
  return dayjs().format(format);
}

/**
 * 获取当前时间字符串
 */
export function getCurrentTime(format: string = 'HH:mm:ss'): string {
  return dayjs().format(format);
}

/**
 * 获取当前日期时间字符串
 */
export function getCurrentDateTime(format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs().format(format);
}

/**
 * 计算两个日期之间的差异（天数）
 */
export function getDaysDiff(date1: Date | Dayjs | string, date2: Date | Dayjs | string): number {
  return dayjs(date1).diff(dayjs(date2), 'day');
}

/**
 * 计算两个时间之间的差异（分钟）
 */
export function getMinutesDiff(
  time1: Date | Dayjs | string,
  time2: Date | Dayjs | string
): number {
  return dayjs(time1).diff(dayjs(time2), 'minute');
}

/**
 * 判断日期是否是今天
 */
export function isToday(date: Date | Dayjs | string): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}

/**
 * 判断日期是否是昨天
 */
export function isYesterday(date: Date | Dayjs | string): boolean {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');
}

/**
 * 判断时间是否在范围内
 */
export function isTimeBetween(
  time: Date | Dayjs | string,
  start: Date | Dayjs | string,
  end: Date | Dayjs | string
): boolean {
  const t = dayjs(time);
  return t.isAfter(dayjs(start)) && t.isBefore(dayjs(end));
}

/**
 * 添加天数
 */
export function addDays(date: Date | Dayjs | string, days: number): Dayjs {
  return dayjs(date).add(days, 'day');
}

/**
 * 减少天数
 */
export function subtractDays(date: Date | Dayjs | string, days: number): Dayjs {
  return dayjs(date).subtract(days, 'day');
}

/**
 * 添加小时
 */
export function addHours(date: Date | Dayjs | string, hours: number): Dayjs {
  return dayjs(date).add(hours, 'hour');
}

/**
 * 减少小时
 */
export function subtractHours(date: Date | Dayjs | string, hours: number): Dayjs {
  return dayjs(date).subtract(hours, 'hour');
}

/**
 * 添加分钟
 */
export function addMinutes(date: Date | Dayjs | string, minutes: number): Dayjs {
  return dayjs(date).add(minutes, 'minute');
}

/**
 * 减少分钟
 */
export function subtractMinutes(date: Date | Dayjs | string, minutes: number): Dayjs {
  return dayjs(date).subtract(minutes, 'minute');
}

/**
 * 友好的时间显示（例如：刚刚、1分钟前、2小时前）
 */
export function getRelativeTime(date: Date | Dayjs | string): string {
  const now = dayjs();
  const target = dayjs(date);
  const diff = now.diff(target, 'second');

  if (diff < 60) {
    return '刚刚';
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}小时前`;
  } else if (diff < 604800) {
    return `${Math.floor(diff / 86400)}天前`;
  } else {
    return target.format('YYYY-MM-DD');
  }
}
