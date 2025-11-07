import { ref, nextTick } from 'vue';
import { watch } from 'vue';

const TOUR_COMPLETED_KEY = 'SA-TOUR-COMPLETED2';

/**
 * 导览功能的Composable
 */
export function useTour() {
  const tourOpen = ref(false);
  const tourCompleted = ref(localStorage.getItem(TOUR_COMPLETED_KEY) === 'true');

  // 各个导览目标的ref
  const walletBalanceRef = ref<HTMLElement | null>(null);
  const airConditioningBalanceRef = ref<HTMLElement | null>(null);
  const recentConsumptionRef = ref<HTMLElement | null>(null);
  const qrCodePaymentFunction = ref<HTMLElement | null>(null);

  /**
   * 检查导览是否已完成
   */
  function checkTourCompleted(): boolean {
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    const isCompleted = completed === 'true';
    tourCompleted.value = isCompleted;
    return isCompleted;
  }

  /**
   * 标记导览为已完成
   */
  function markTourCompleted(): void {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    tourCompleted.value = true;
  }

  /**
   * 监听导览关闭并保存状态
   */
  watch(tourOpen, (newVal) => {
    if (!newVal) {
      markTourCompleted();
    }
  });

  /**
   * 初始化导览（在组件挂载后调用）
   */
  async function initTour(): Promise<void> {
    await nextTick();
    if (!checkTourCompleted()) {
      tourOpen.value = true;
    }
  }

  return {
    tourOpen,
    tourCompleted,
    walletBalanceRef,
    airConditioningBalanceRef,
    recentConsumptionRef,
    qrCodePaymentFunction,
    checkTourCompleted,
    markTourCompleted,
    initTour,
  };
}
