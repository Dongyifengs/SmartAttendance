import { ref, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { OC_GetPayQRCode } from '@/api/ocAPI';
import type { OCLoginResponse } from '@/api/ocAPI/type/response';
import { useApiCall } from './useApiCall';

/**
 * Composable for payment QR code management
 * Handles QR code generation, auto-refresh, and manual refresh
 */
export function usePaymentQR() {
  const { execute } = useApiCall();
  
  // State
  const showDialog = ref(false);
  const qrCodeBase64 = ref('');
  const refreshCountdown = ref(10);
  const refreshing = ref(false);
  const refreshTimer = ref<number | null>(null);

  /**
   * Get One Card user info from localStorage
   */
  function getOCUserInfo(): OCLoginResponse | null {
    const userInfoStr = localStorage.getItem('SA-OC-USERINFO');
    if (!userInfoStr) return null;
    
    try {
      return JSON.parse(userInfoStr);
    } catch (error) {
      console.error('[getOCUserInfo] Parse error:', error);
      return null;
    }
  }

  /**
   * Fetch payment QR code
   */
  async function fetchQRCode(): Promise<void> {
    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          ElMessage.warning('请先登录一卡通以获取支付二维码');
          return null;
        }

        return await OC_GetPayQRCode(userInfo.data.token);
      },
      { errorMessage: '获取支付二维码失败' }
    );

    if (result?.data?.code_info) {
      qrCodeBase64.value = result.data.code_info;
    }
  }

  /**
   * Reset and start auto-refresh timer
   */
  function resetRefreshTimer(): void {
    // Clear existing timer
    if (refreshTimer.value !== null) {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    }

    // Reset countdown
    refreshCountdown.value = 10;

    // Start new timer
    refreshTimer.value = window.setInterval(() => {
      refreshCountdown.value--;

      if (refreshCountdown.value <= 0) {
        // Auto refresh QR code
        fetchQRCode()
          .then(() => {
            console.log('[usePaymentQR] Auto refresh completed');
          })
          .catch((error) => {
            console.error('[usePaymentQR] Auto refresh failed:', error);
          });
        
        // Reset countdown
        refreshCountdown.value = 10;
      }
    }, 1000);
  }

  /**
   * Start auto-refresh
   */
  function startAutoRefresh(): void {
    resetRefreshTimer();
  }

  /**
   * Stop auto-refresh
   */
  function stopAutoRefresh(): void {
    if (refreshTimer.value !== null) {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    }
    refreshCountdown.value = 10;
  }

  /**
   * Manual refresh QR code
   */
  async function manualRefresh(): Promise<void> {
    if (refreshing.value) return;

    refreshing.value = true;
    try {
      await fetchQRCode();
      resetRefreshTimer();
      ElMessage.success('二维码已刷新');
    } catch (error) {
      console.error('[manualRefresh] Error:', error);
      ElMessage.error('刷新二维码失败');
    } finally {
      refreshing.value = false;
    }
  }

  /**
   * Initialize QR code (fetch and start auto-refresh)
   */
  async function initialize(): Promise<void> {
    await fetchQRCode();
  }

  /**
   * Watch dialog visibility to control auto-refresh
   */
  watch(showDialog, (newVal) => {
    if (newVal) {
      nextTick(() => {
        startAutoRefresh();
      });
    } else {
      stopAutoRefresh();
    }
  });

  return {
    // State
    showDialog,
    qrCodeBase64,
    refreshCountdown,
    refreshing,
    
    // Methods
    fetchQRCode,
    manualRefresh,
    initialize,
    startAutoRefresh,
    stopAutoRefresh,
  };
}
