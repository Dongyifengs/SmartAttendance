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
import { MOYI_UploadInfo } from '@/api/moyi';
import { useApiCall } from './useApiCall';

/**
 * 用于一卡通操作的组合式函数
 * 处理钱包余额、账单检索和用户信息
 */
export function useOneCard() {
  const { execute } = useApiCall();
  
  // 状态
  const walletBalance = ref('加载中...');
  const recentConsumption = ref('7日内没有消费');
  const billList = ref<OC_BillRetrievalList[]>([]);
  const currentDays = ref(7);
  const userName = ref('用户名');
  const userClass = ref('班级');
  const userId = ref('学校');

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
   * 当令牌无效时自动登录一卡通
   */
  async function autoLogin(): Promise<boolean> {
    const accountStr = localStorage.getItem('SA-OC-ACCOUNT');
    if (!accountStr) {
      console.log('[autoLogin] 未找到保存的账户信息');
      return false;
    }

    try {
      const account = JSON.parse(accountStr);
      if (!account.username || !account.password) {
        console.log('[autoLogin] 账户信息不完整');
        return false;
      }

      console.log('[autoLogin] 开始自动登录...');
      const res = await OC_Login(account.username, account.password);
      
      if (res?.code === 200) {
        console.log('[autoLogin] 自动登录成功');
        const userInfoToSave = structuredClone(res);
        if (userInfoToSave.data) {
          userInfoToSave.data.backUrl = '';
          userInfoToSave.data.logoUrl = '';
        }
        localStorage.setItem('SA-OC-USERINFO', JSON.stringify(userInfoToSave));
        localStorage.setItem('SA-OC-TIMESTAMP', Date.now().toString());
        return true;
      }
      
      console.warn('[autoLogin] 登录失败:', res?.msg);
      return false;
    } catch (error) {
      console.error('[autoLogin] 错误:', error);
      return false;
    }
  }

  /**
   * 获取钱包余额，支持自动登录重试
   */
  async function fetchWalletBalance(gitHash?: string): Promise<void> {
    const result = await execute(
      async () => {
        const userInfo = getOCUserInfo();
        if (!userInfo?.data?.token) {
          walletBalance.value = '未登录';
          return null;
        }

        const res = await OC_GetBalance(userInfo.data.token);
        
        // 处理令牌过期
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
      const balanceAmount = (result.data.wallet0_amount / 100).toFixed(2);
      walletBalance.value = `${balanceAmount} 元`;
      
      // 如果提供了 gitHash，则记录到 MOYI API
      if (gitHash) {
        const userInfo = getOCUserInfo();
        try {
          await MOYI_UploadInfo(
            '获取钱包余额',
            'oc_Get_WalletBalance',
            String(userInfo?.data?.token),
            JSON.stringify(result),
            gitHash,
            `${balanceAmount} 元`
          );
        } catch (error) {
          console.error('[fetchWalletBalance] MOYI_UploadInfo 错误:', error);
        }
      }
    } else {
      walletBalance.value = '获取失败';
    }
  }

  /**
   * 获取最近消费记录
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
      
      // 将描述映射到表情符号
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
   * 获取详细账单列表
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
   * 获取用户信息
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
    // 状态
    walletBalance,
    recentConsumption,
    billList,
    currentDays,
    userName,
    userClass,
    userId,
    
    // 方法
    getOCUserInfo,
    autoLogin,
    fetchWalletBalance,
    fetchRecentConsumption,
    fetchBillList,
    fetchUserInfo,
  };
}
