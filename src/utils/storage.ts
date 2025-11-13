/**
 * 统一的本地存储工具
 * Unified Local Storage Utility
 */

// Storage keys constants
export const STORAGE_KEYS = {
  // 智慧考勤相关
  ZHKQ_USERINFO: 'SA-ZHKQ-USERINFO',
  ZHKQ_TIMESTAMP: 'SA-ZHKQ-TIMESTAMP',
  ZHKQ_ACCOUNT: 'SA-ZHKQ-ACCOUNT',

  // 一卡通相关
  OC_USERINFO: 'SA-OC-USERINFO',
  OC_TIMESTAMP: 'SA-OC-TIMESTAMP',
  OC_ACCOUNT: 'SA-OC-ACCOUNT',

  // 空调相关
  AIR_CONDITIONING: 'SA-AIR-CONDITIONING',

  // UI相关
  TOUR_COMPLETED: 'SA-TOUR-COMPLETED2',
} as const;

/**
 * 获取存储的数据
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to get storage item: ${key}`, error);
    return null;
  }
}

/**
 * 设置存储的数据
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set storage item: ${key}`, error);
  }
}

/**
 * 移除存储的数据
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove storage item: ${key}`, error);
  }
}

/**
 * 清除所有存储的数据
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear storage', error);
  }
}

/**
 * 获取时间戳
 */
export function getTimestamp(): number {
  return new Date().getTime();
}

/**
 * 检查时间戳是否过期（默认4小时）
 */
export function isTimestampExpired(timestamp: number, hours: number = 4): boolean {
  const expiryTime = hours * 60 * 60 * 1000;
  return getTimestamp() - timestamp > expiryTime;
}
