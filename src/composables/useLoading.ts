/**
 * 加载状态管理 Composable
 * Loading State Management
 */

import { ref, type Ref } from 'vue';

export interface UseLoadingReturn {
  loading: Ref<boolean>;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

/**
 * 用于管理加载状态的组合式函数
 */
export function useLoading(initialState: boolean = false): UseLoadingReturn {
  const loading = ref<boolean>(initialState);

  const startLoading = (): void => {
    loading.value = true;
  };

  const stopLoading = (): void => {
    loading.value = false;
  };

  /**
   * 包装异步函数，自动管理加载状态
   */
  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    startLoading();
    try {
      return await fn();
    } finally {
      stopLoading();
    }
  };

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  };
}

/**
 * 多个加载状态管理
 */
export function useMultipleLoading(
  initialStates: Record<string, boolean> = {}
): Record<string, UseLoadingReturn> {
  const loadings: Record<string, UseLoadingReturn> = {};

  Object.keys(initialStates).forEach((key) => {
    loadings[key] = useLoading(initialStates[key]);
  });

  return loadings;
}
