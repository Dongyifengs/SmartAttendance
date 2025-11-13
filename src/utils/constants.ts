/**
 * 应用常量定义
 * Application Constants
 */

/**
 * 时间常量 (毫秒)
 * Time Constants (milliseconds)
 */
export const TIME_CONSTANTS = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  FOUR_HOURS: 4 * 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
} as const;

/**
 * UI 常量
 * UI Constants
 */
export const UI_CONSTANTS = {
  LONG_PRESS_DELAY: 800,
  LONG_PRESS_DEBOUNCE: 100,
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 3000,
} as const;

/**
 * API 常量
 * API Constants
 */
export const API_CONSTANTS = {
  TIMEOUT: 10000,
  RETRY_TIMES: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * 路由路径常量
 * Route Path Constants
 */
export const ROUTE_PATHS = {
  LOGIN: '/',
  HOME: '/home',
  DEV_HOME: '/dev/home',
  CLASS_LIST_DEV: '/classListDev',
  ATTENDANCE_DEV: '/AttendanceDev',
  LEAVE_DEV: '/LeaveDev',
} as const;

/**
 * 表单验证规则
 * Form Validation Rules
 */
export const VALIDATION_RULES = {
  REQUIRED: '此字段为必填项',
  MIN_LENGTH: (length: number) => `最少需要${length}个字符`,
  MAX_LENGTH: (length: number) => `最多只能${length}个字符`,
  EMAIL: '请输入有效的邮箱地址',
  PHONE: '请输入有效的手机号码',
} as const;

/**
 * 环境变量键名
 * Environment Variable Keys
 */
export const ENV_KEYS = {
  // 智慧考勤
  ZHKQ_USERNAME: 'VITE_ZHKQAPI_USERNAME',
  ZHKQ_PASSWORD: 'VITE_ZHKQAPI_PASSWORD',
  ZHKQ_DEVICE_ID: 'VITE_ZHKQAPI_DEVICEID',

  // 一卡通
  OC_USERNAME: 'VITE_OC_USERNAME',
  OC_PASSWORD: 'VITE_OC_PASSWORD',

  // 构建信息
  BUILD_DATE: 'VITE_BUILD_DATE',
  BUILD_TIMESTAMP: 'VITE_BUILD_TIMESTAMP',
  GIT_HASH: 'VITE_GIT_HASH',
  GIT_FULL_HASH: 'VITE_GIT_FULL_HASH',
  COMMIT_MESSAGE: 'VITE_COMMIT_MESSAGE',
  GITHUB_REPO: 'VITE_GITHUB_REPO',

  // 其他
  TEXT: 'VITE_TEXT',
  STAT_SCRIPT: 'VITE_STAT_SCRIPT',
  STAT_WEBSITE_ID: 'VITE_STAT_WEBSITE_ID',
} as const;
