import { ElMessage } from 'element-plus';
import { ref } from 'vue';

/**
 * Unified API call hook with error handling
 * Simplifies try-catch blocks and provides consistent error handling
 */
export function useApiCall() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * Execute an API call with unified error handling
   * @param apiFunction - The async function to execute
   * @param errorMessage - Custom error message to display
   * @param showSuccessMessage - Whether to show success message
   * @param successMessage - Custom success message
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
      console.error('[useApiCall] Error:', err);
      
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
