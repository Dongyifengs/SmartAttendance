import { ref, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { OC_GetPayQRCode } from '@/api/ocAPI';
import type { OCLoginResponse } from '@/api/ocAPI/type/response';
import { MOYI_UploadInfo } from '@/api/moyi';
import { useApiCall } from './useApiCall';

/**
 * 用于支付二维码管理的组合式函数
 * 处理二维码生成、自动刷新和手动刷新
 */
export function usePaymentQR() {
  const { execute } = useApiCall();
  
  // 状态
  const showDialog = ref(false);
  const qrCodeBase64 = ref('');
  const refreshCountdown = ref(10);
  const refreshing = ref(false);
  const refreshTimer = ref<number | null>(null);

  /**
   * 从 localStorage 获取一卡通用户信息
   */
  function getOCUserInfo(): OCLoginResponse | null {
    const userInfoStr = localStorage.getItem('SA-OC-USERINFO');
    if (!userInfoStr) return null;
    
    try {
      return JSON.parse(userInfoStr);
    } catch (error) {
      console.error('[getOCUserInfo] 解析错误:', error);
      return null;
    }
  }

  /**
   * 获取支付二维码
   */
  async function fetchQRCode(gitHash?: string): Promise<void> {
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

      // 如果提供了 gitHash，则记录到 MOYI API
      if (gitHash) {
        const userInfo = getOCUserInfo();
        try {
          await MOYI_UploadInfo(
            '获取支付二维码',
            'oc_Get_PayQRCode',
            String(userInfo?.data?.token),
            JSON.stringify(result),
            gitHash,
            '二维码已生成'
          );
        } catch (error) {
          console.error('[fetchQRCode] MOYI_UploadInfo 错误:', error);
        }
      }
    }
  }

  /**
   * 重置并启动自动刷新计时器
   */
  function resetRefreshTimer(): void {
    // 清除现有计时器
    if (refreshTimer.value !== null) {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    }

    // 重置倒计时
    refreshCountdown.value = 10;

    // 启动新计时器
    refreshTimer.value = window.setInterval(() => {
      refreshCountdown.value--;

      if (refreshCountdown.value <= 0) {
        // 自动刷新二维码
        fetchQRCode()
          .then(() => {
            console.log('[usePaymentQR] 自动刷新完成');
          })
          .catch((error) => {
            console.error('[usePaymentQR] 自动刷新失败:', error);
          });
        
        // 重置倒计时
        refreshCountdown.value = 10;
      }
    }, 1000);
  }

  /**
   * 启动自动刷新
   */
  function startAutoRefresh(): void {
    resetRefreshTimer();
  }

  /**
   * 停止自动刷新
   */
  function stopAutoRefresh(): void {
    if (refreshTimer.value !== null) {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    }
    refreshCountdown.value = 10;
  }

  /**
   * 手动刷新二维码
   */
  async function manualRefresh(): Promise<void> {
    if (refreshing.value) return;

    refreshing.value = true;
    try {
      await fetchQRCode();
      resetRefreshTimer();
      ElMessage.success('二维码已刷新');
    } catch (error) {
      console.error('[manualRefresh] 错误:', error);
      ElMessage.error('刷新二维码失败');
    } finally {
      refreshing.value = false;
    }
  }

  /**
   * 初始化二维码（获取并启动自动刷新）
   */
  async function initialize(gitHash?: string): Promise<void> {
    await fetchQRCode(gitHash);
  }

  /**
   * 监听对话框可见性以控制自动刷新
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
    // 状态
    showDialog,
    qrCodeBase64,
    refreshCountdown,
    refreshing,
    
    // 方法
    fetchQRCode,
    manualRefresh,
    initialize,
    startAutoRefresh,
    stopAutoRefresh,
  };
}
