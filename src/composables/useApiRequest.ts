import { ElMessage } from 'element-plus';

/**
 * 统一的API请求处理Hook
 * 简化try-catch逻辑，提供统一的错误处理
 */
export function useApiRequest() {
  /**
   * 执行API请求并处理错误
   * @param apiCall - API调用函数
   * @param errorMessage - 错误时显示的消息
   * @param showSuccessMessage - 成功时是否显示消息
   * @param successMessage - 成功时显示的消息
   * @returns API调用结果或null
   */
  async function request<T>(
    apiCall: () => Promise<T>,
    errorMessage = '操作失败',
    showSuccessMessage = false,
    successMessage = '操作成功'
  ): Promise<T | null> {
    try {
      const result = await apiCall();
      if (showSuccessMessage) {
        ElMessage.success(successMessage);
      }
      return result;
    } catch (error) {
      console.error(`[API Request Error]: ${errorMessage}`, error);
      ElMessage.error(errorMessage);
      return null;
    }
  }

  return {
    request,
  };
}
