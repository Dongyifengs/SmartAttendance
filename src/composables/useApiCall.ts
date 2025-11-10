import { ElMessage } from 'element-plus';
import { ref } from 'vue';

/**
 * 统一的 API 调用钩子，具有错误处理功能
 * 简化 try-catch 块并提供一致的错误处理
 */
export function useApiCall() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * 执行带有统一错误处理的 API 调用
   * @param apiFunction - 要执行的异步函数
   * @param errorMessage - 自定义错误消息
   * @param showSuccessMessage - 是否显示成功消息
   * @param successMessage - 自定义成功消息
   */
  async function execute<T>(
    apiFunction: () => Promise<T>,
    options?: {
      errorMessage?: string;
      showSuccessMessage?: boolean;
      successMessage?: string;
      silent?: boolean;
    }
  ): Promise<T | null> {
    loading.value = true;
    error.value = null;

    try {
      const result = await apiFunction();
      
      if (options?.showSuccessMessage && options?.successMessage) {
        ElMessage.success(options.successMessage);
      }
      
      return result;
    } catch (err) {
      error.value = err as Error;
      console.error('[useApiCall] 错误:', err);
      
      if (!options?.silent) {
        ElMessage.error(options?.errorMessage || '操作失败，请稍后重试');
      }
      
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    execute,
  };
}
