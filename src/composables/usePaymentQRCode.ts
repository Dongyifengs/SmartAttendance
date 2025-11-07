import { ref, nextTick, watch, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useOneCardAPI } from './useOneCardAPI';

/**
 * 支付二维码刷新功能的Composable
 */
export function usePaymentQRCode() {
  const { getPayQC } = useOneCardAPI();

  const showPayDialog = ref(false);
  const refreshTimer = ref<number | null>(null);
  const refreshCountdown = ref(10); // 倒计时显示
  const refreshingQR = ref(false); // 刷新状态

  /**
   * 手动刷新二维码
   */
  async function refreshQRCode(): Promise<void> {
    if (refreshingQR.value) return;

    refreshingQR.value = true;
    try {
      await getPayQC();
      resetRefreshTimer();
      ElMessage.success('二维码已刷新');
    } catch (error) {
      console.error('[refreshQRCode] 刷新二维码失败:', error);
      ElMessage.error('刷新二维码失败');
    } finally {
      refreshingQR.value = false;
    }
  }

  /**
   * 重置自动刷新计时器
   */
  function resetRefreshTimer(): void {
    // 清除现有计时器
    if (refreshTimer.value !== null) {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    }

    // 重置倒计时
    refreshCountdown.value = 10;

    // 启动新的计时器
    refreshTimer.value = window.setInterval(() => {
      refreshCountdown.value--;

      if (refreshCountdown.value <= 0) {
        // 自动刷新二维码
        getPayQC()
          .then(() => {
            console.log('二维码自动刷新完成');
          })
          .catch((error) => {
            console.error('二维码自动刷新失败:', error);
          });
        // 重置倒计时
        refreshCountdown.value = 10;
      }
    }, 1000);
  }

  /**
   * 启动二维码自动刷新
   */
  function startQRRefresh(): void {
    resetRefreshTimer();
  }

  /**
   * 停止二维码自动刷新
   */
  function stopQRRefresh(): void {
    if (refreshTimer.value !== null) {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    }
    refreshCountdown.value = 10;
  }

  // 监听支付弹窗显示/隐藏
  watch(showPayDialog, (newVal) => {
    if (newVal) {
      nextTick(() => {
        startQRRefresh();
      });
    } else {
      stopQRRefresh();
    }
  });

  // 清理定时器
  onUnmounted(() => {
    stopQRRefresh();
  });

  return {
    showPayDialog,
    refreshTimer,
    refreshCountdown,
    refreshingQR,
    refreshQRCode,
    startQRRefresh,
    stopQRRefresh,
  };
}
