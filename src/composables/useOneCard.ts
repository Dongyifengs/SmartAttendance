import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import router from '@/router';
import {
  OC_GetBalance,
  OC_BillRetrieval,
  OC_GetUserInfo,
  OC_Login,
} from '@/api/ocAPI';
import type {
  OCLoginResponse,
  OC_BillRetrievalList,
} from '@/api/ocAPI/type/response';
import { useApiCall } from './useApiCall';

/**
 * Composable for One Card (一卡通) operations
 * Handles wallet balance, bill retrieval, and user info
 */
export function useOneCard() {
  const { execute } = useApiCall();
  
  // State
  const walletBalance = ref('加载中...');
  const recentConsumption = ref('7日内没有消费');
  const billList = ref<OC_BillRetrievalList[]>([]);
  const currentDays = ref(7);
  const userName = ref('用户名');
  const userClass = ref('班级');
  const userId = ref('学校');

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
   * Auto login to One Card when token is invalid
   */
  async function autoLogin(): Promise<boolean> {
    const accountStr = localStorage.getItem('SA-OC-ACCOUNT');
    if (!accountStr) {
      console.log('[autoLogin] No saved account info');
      return false;
    }

    try {
      const account = JSON.parse(accountStr);
      if (!account.username || !account.password) {
        console.log('[autoLogin] Incomplete account info');
        return false;
      }

      console.log('[autoLogin] Starting auto login...');
      const res = await OC_Login(account.username, account.password);
      
      if (res?.code === 200) {
        console.log('[autoLogin] Auto login successful');
        const userInfoToSave = structuredClone(res);
        if (userInfoToSave.data) {
          userInfoToSave.data.backUrl = '';
          userInfoToSave.data.logoUrl = '';
        }
        localStorage.setItem('SA-OC-USERINFO', JSON.stringify(userInfoToSave));
        localStorage.setItem('SA-OC-TIMESTAMP', Date.now().toString());
        return true;
      }
      
      console.warn('[autoLogin] Login failed:', res?.msg);
      return false;
    } catch (error) {
      console.error('[autoLogin] Error:', error);
      return false;
    }
  }

  /**
   * Get wallet balance with auto-login retry
   */
  async function fetchWalletBalance(): Promise<void> {
    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          walletBalance.value = '未登录';
          return null;
        }

        const res = await OC_GetBalance(userInfo.data.token);
        
        // Handle token expiration
        if (res.msg === '您的身份信息已失效,请重新从卡包进入') {
          const loginSuccess = await autoLogin();
          if (loginSuccess) {
            const newUserInfo = getOCUserInfo();
            if (newUserInfo?.data?.token) {
              const newRes = await OC_GetBalance(newUserInfo.data.token);
              return newRes;
            }
          }
          
          ElMessage.error('您的身份信息已失效,请重新登录');
          localStorage.removeItem('SA-OC-USERINFO');
          localStorage.removeItem('SA-OC-TIMESTAMP');
          await router.push('/');
          return null;
        }

        return res;
      },
      { errorMessage: '获取钱包余额失败', silent: true }
    );

    if (result?.data?.wallet0_amount !== undefined) {
      walletBalance.value = `${(result.data.wallet0_amount / 100).toFixed(2)} 元`;
    } else {
      walletBalance.value = '获取失败';
    }
  }

  /**
   * Get recent consumption records
   */
  async function fetchRecentConsumption(days = 7): Promise<void> {
    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          recentConsumption.value = '未登录';
          return null;
        }

        return await OC_BillRetrieval(1, 1, days, userInfo.data.token);
      },
      { errorMessage: '获取消费记录失败', silent: true }
    );

    if (!result) {
      recentConsumption.value = '查询失败';
      return;
    }

    if (result.code === 400) {
      recentConsumption.value = result.msg || '无权限';
      return;
    }

    if (result.data?.all_count > 0 && Array.isArray(result.data.list)) {
      const latest = result.data.list[0];
      const amount = (latest.trade_amount ?? 0) / 100;
      const desc = latest.desc || '';
      
      // Map description to emoji
      const emojiMap: Record<string, string> = {
        '用水': '🥤',
        '餐': '🍽️',
        '淋浴': '🚿',
        '微信充值': '💳',
        '商场': '🛍️',
        '洗衣': '🧼',
      };
      
      const emoji = Object.entries(emojiMap).find(([key]) => desc.includes(key))?.[1] || '';
      recentConsumption.value = `${amount.toFixed(2)}元${emoji}`;
    } else {
      recentConsumption.value = `近${days}天未消费`;
    }
  }

  /**
   * Fetch detailed bill list
   */
  async function fetchBillList(days: number): Promise<void> {
    currentDays.value = days;
    
    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          ElMessage.warning('请先登录一卡通以查看账单');
          return null;
        }

        return await OC_BillRetrieval(1, 100, days, userInfo.data.token);
      },
      { errorMessage: '获取账单信息失败' }
    );

    billList.value = result?.data?.list || [];
  }

  /**
   * Fetch user information
   */
  async function fetchUserInfo(): Promise<void> {
    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          ElMessage.warning('请先登录一卡通以获取用户信息');
          return null;
        }

        return await OC_GetUserInfo(userInfo.data.token);
      },
      { errorMessage: '获取用户信息失败' }
    );

    if (result?.code === 200) {
      userName.value = result.data.name || '用户名';
      userClass.value = result.data.dept_name || '班级';
      userId.value = result.data.school_name || '学校';
    }
  }

  return {
    // State
    walletBalance,
    recentConsumption,
    billList,
    currentDays,
    userName,
    userClass,
    userId,
    
    // Methods
    getOCUserInfo,
    autoLogin,
    fetchWalletBalance,
    fetchRecentConsumption,
    fetchBillList,
    fetchUserInfo,
  };
}
