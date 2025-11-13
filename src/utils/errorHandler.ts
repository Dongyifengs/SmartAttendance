/**
 * 错误处理工具
 * Error Handling Utilities
 */

import { ElMessage, ElNotification } from 'element-plus';

/**
 * 错误类型
 */
export const ErrorType = {
  NETWORK: 'network',
  AUTH: 'auth',
  VALIDATION: 'validation',
  BUSINESS: 'business',
  UNKNOWN: 'unknown',
} as const;

export type ErrorTypeKey = (typeof ErrorType)[keyof typeof ErrorType];

/**
 * 错误消息配置
 */
const ERROR_MESSAGES: Record<ErrorTypeKey, string> = {
  [ErrorType.NETWORK]: '网络连接失败，请检查网络设置',
  [ErrorType.AUTH]: '认证失败，请重新登录',
  [ErrorType.VALIDATION]: '数据验证失败',
  [ErrorType.BUSINESS]: '操作失败',
  [ErrorType.UNKNOWN]: '未知错误',
};

/**
 * 显示错误消息
 */
export function showError(
  message: string,
  type: ErrorTypeKey = ErrorType.UNKNOWN,
  duration: number = 3000
): void {
  ElMessage.error({
    message: message || ERROR_MESSAGES[type],
    duration,
    showClose: true,
  });
}

/**
 * 显示成功消息
 */
export function showSuccess(message: string, duration: number = 3000): void {
  ElMessage.success({
    message,
    duration,
    showClose: true,
  });
}

/**
 * 显示警告消息
 */
export function showWarning(message: string, duration: number = 3000): void {
  ElMessage.warning({
    message,
    duration,
    showClose: true,
  });
}

/**
 * 显示信息消息
 */
export function showInfo(message: string, duration: number = 3000): void {
  ElMessage.info({
    message,
    duration,
    showClose: true,
  });
}

/**
 * 显示通知
 */
export function showNotification(
  title: string,
  message: string,
  type: 'success' | 'warning' | 'info' | 'error' = 'info',
  duration: number = 4500
): void {
  ElNotification({
    title,
    message,
    type,
    duration,
  });
}

/**
 * 处理API错误
 */
export function handleApiError(error: any, customMessage?: string): void {
  console.error('[API Error]', error);

  let message = customMessage || '';
  let errorType: ErrorTypeKey = ErrorType.UNKNOWN;

  if (error.response) {
    // 服务器返回错误状态码
    const status = error.response.status;
    if (status === 401 || status === 403) {
      errorType = ErrorType.AUTH;
      message = message || '登录已过期，请重新登录';
    } else if (status >= 500) {
      errorType = ErrorType.NETWORK;
      message = message || '服务器错误，请稍后重试';
    } else if (status >= 400) {
      errorType = ErrorType.VALIDATION;
      message = message || error.response.data?.message || '请求参数错误';
    }
  } else if (error.request) {
    // 请求已发出但没有收到响应
    errorType = ErrorType.NETWORK;
    message = message || '网络请求超时，请检查网络连接';
  } else {
    // 其他错误
    errorType = ErrorType.UNKNOWN;
    message = message || error.message || '操作失败，请重试';
  }

  showError(message, errorType);
}

/**
 * 异步函数错误包装器
 */
export function asyncErrorWrapper<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error, errorMessage);
      throw error;
    }
  }) as T;
}

/**
 * 验证表单字段
 */
export function validateField(
  value: string,
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => boolean;
  }
): { valid: boolean; message?: string } {
  if (rules.required && !value) {
    return { valid: false, message: '此字段为必填项' };
  }

  if (rules.minLength && value.length < rules.minLength) {
    return { valid: false, message: `最少需要${rules.minLength}个字符` };
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return { valid: false, message: `最多只能${rules.maxLength}个字符` };
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return { valid: false, message: '格式不正确' };
  }

  if (rules.customValidator && !rules.customValidator(value)) {
    return { valid: false, message: '验证失败' };
  }

  return { valid: true };
}
