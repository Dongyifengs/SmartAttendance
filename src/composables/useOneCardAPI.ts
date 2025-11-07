import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import router from '@/router';
import dayjs from 'dayjs';
import {
  OC_BillRetrieval,
  OC_GetBalance,
  OC_GetPayQRCode,
  OC_GetUserInfo,
  OC_Login,
} from '@/api/ocAPI';
import type { OC_BillRetrievalList, OCLoginResponse } from '@/api/ocAPI/type/response';
import { MOYI_UploadInfo } from '@/api/moyi';
import { useApiRequest } from './useApiRequest';

/**
 * 一卡通相关功能的Composable
 */
export function useOneCardAPI() {
  const { request } = useApiRequest();

  // 状态
  const OC_QBYS = ref('加载中...'); // 钱包余额显示
  const OC_BR = ref('7日内没有消费'); // 最近消费显示
  const billList = ref<OC_BillRetrievalList[]>([]);
  const currentDays = ref<number>(7);
  const userName = ref('用户名');
  const userClass = ref('班级');
  const userId = ref('学校');
  const payQCBase = ref('');

  /**
   * 从本地存储读取一卡通用户信息
   */
  function getUserInfo_OC(): OCLoginResponse | null {
    const userInfoStr = localStorage.getItem('SA-OC-USERINFO');
    if (!userInfoStr) return null;
    try {
      return JSON.parse(userInfoStr);
    } catch (e) {
      console.error('[getUserInfo_OC] JSON.parse 失败', e);
      return null;
    }
  }

  /**
   * 自动登录一卡通
   */
  async function autoLoginOC(): Promise<boolean> {
    const ocAccountStr = localStorage.getItem('SA-OC-ACCOUNT');
    if (!ocAccountStr) {
      console.log('[一卡通自动登录] 未找到保存的账户信息');
      return false;
    }

    let ocAccount;
    try {
      ocAccount = JSON.parse(ocAccountStr);
    } catch (parseError) {
      console.error('[一卡通自动登录] 账户信息解析失败：', parseError);
      return false;
    }

    if (!ocAccount.username || !ocAccount.password) {
      console.log('[一卡通自动登录] 账户信息不完整');
      return false;
    }

    console.log('[一卡通自动登录] 开始自动登录...');
    const res = await request(
      () => OC_Login(ocAccount.username, ocAccount.password),
      '一卡通自动登录失败'
    );

    if (res && res.code === 200) {
      console.log('[一卡通自动登录] 自动登录成功');
      const userInfoToSave = structuredClone(res);
      if (userInfoToSave.data) {
        userInfoToSave.data.backUrl = '';
        userInfoToSave.data.logoUrl = '';
      }
      localStorage.setItem('SA-OC-USERINFO', JSON.stringify(userInfoToSave));
      localStorage.setItem('SA-OC-TIMESTAMP', new Date().getTime().toString());
      return true;
    }

    console.warn('[一卡通自动登录] 登录失败：', res?.msg || res);
    return false;
  }

  /**
   * 处理Token失效并重新登录
   */
  async function handleTokenExpired(): Promise<void> {
    ElMessage.error('您的身份信息已失效,请重新登录');
    localStorage.removeItem('SA-OC-USERINFO');
    localStorage.removeItem('SA-OC-TIMESTAMP');
    await router.push('/');
  }

  /**
   * 获取钱包余额
   */
  async function getWalletBalance(): Promise<void> {
    const userInfo = getUserInfo_OC();
    if (!userInfo?.data?.token) {
      OC_QBYS.value = '未登录';
      return;
    }

    const userKey = userInfo.data.token;
    const res = await request(() => OC_GetBalance(userKey), '获取钱包余额失败');

    if (!res) {
      OC_QBYS.value = '获取失败';
      return;
    }

    console.log('钱包余额API返回：', res);

    // 处理token失效
    if (res?.msg === '您的身份信息已失效,请重新从卡包进入') {
      const loginSuccess = await autoLoginOC();
      if (loginSuccess) {
        const newUserInfo = getUserInfo_OC();
        if (newUserInfo?.data?.token) {
          const newRes = await request(
            () => OC_GetBalance(newUserInfo.data.token),
            '重新获取余额失败'
          );
          if (newRes) {
            OC_QBYS.value = (newRes?.data?.wallet0_amount ?? 0) / 100 + ' 元';
            return;
          }
        }
      }
      await handleTokenExpired();
      return;
    }

    await MOYI_UploadInfo(
      userInfo.data.user_name,
      dayjs().format('YYYY-MM-DD HH:mm:ss'),
      'oc_Get_WalletBalance',
      userKey,
      'String(newRes)',
      'DATA'
    );
    OC_QBYS.value = (res?.data?.wallet0_amount ?? 0) / 100 + ' 元';
  }

  /**
   * 根据消费描述获取对应的emoji图标
   */
  function getConsumptionEmoji(desc: string): string {
    if (desc.includes('用水')) return '🥤';
    if (desc.includes('餐')) return '🍽️';
    if (desc.includes('淋浴')) return '🚿';
    if (desc.includes('微信充值')) return '💳';
    if (desc.includes('商场')) return '🛍️';
    if (desc.includes('洗衣')) return '🧼';
    return '';
  }

  /**
   * 获取最近消费记录
   */
  async function getBillRetrieval(days = 7): Promise<void> {
    const userInfo = getUserInfo_OC();
    if (!userInfo?.data?.token) {
      OC_BR.value = '未登录';
      return;
    }

    const userKey = userInfo.data.token;
    const res = await request(() => OC_BillRetrieval(1, 1, days, userKey), '查询消费记录失败');

    console.log('最近消费记录API返回：', res);

    if (!res) {
      OC_BR.value = '查询失败';
      return;
    }

    if (res.code === 400) {
      OC_BR.value = res.msg || '无权限';
      return;
    }

    if (res.data?.all_count > 0 && Array.isArray(res.data.list)) {
      const latest = res.data.list[0];
      const amountText = (latest.trade_amount ?? 0) / 100;
      const emoji = getConsumptionEmoji(latest.desc || '');
      OC_BR.value = `${amountText}元${emoji}`;
    } else {
      OC_BR.value = `近${days}天未消费`;
    }
  }

  /**
   * 拉取指定天数的账单明细
   */
  async function fetchBill(days: number): Promise<void> {
    currentDays.value = days;
    const userInfo = getUserInfo_OC();
    if (!userInfo?.data?.token) {
      ElMessage.warning('请先登录一卡通以查看账单');
      return;
    }

    const userKey = userInfo.data.token;
    const res = await request(() => OC_BillRetrieval(1, 100, days, userKey), '获取账单信息失败');

    console.log(`账单${days}天数据切换API返回：`, res);
    billList.value = res?.data?.list && res.data.list.length ? res.data.list : [];
  }

  /**
   * 获取用户信息
   */
  async function getUserInfoOC(): Promise<void> {
    const userInfo = getUserInfo_OC();
    if (!userInfo?.data?.token) {
      ElMessage.warning('请先登录一卡通以获取用户信息');
      return;
    }

    const userKey = userInfo.data.token;
    const res = await request(() => OC_GetUserInfo(userKey), '获取用户信息失败');

    console.log('获取用户信息返回：', res);
    if (res && res.code === 200) {
      userName.value = res.data.name || '用户名';
      userClass.value = res.data.dept_name || '班级';
      userId.value = res.data.school_name || '学校';
    }
  }

  /**
   * 获取支付二维码
   */
  async function getPayQC(): Promise<void> {
    const userInfo = getUserInfo_OC();
    if (!userInfo?.data?.token) {
      ElMessage.warning('请先登录一卡通以获取用户信息');
      return;
    }

    const userKey = userInfo.data.token;
    const response = await request(() => OC_GetPayQRCode(userKey), '获取支付二维码失败');

    console.log('获取支付二维码返回：', response);
    if (response) {
      payQCBase.value = response.data.code_info;
    }
  }

  return {
    // 状态
    OC_QBYS,
    OC_BR,
    billList,
    currentDays,
    userName,
    userClass,
    userId,
    payQCBase,
    // 方法
    getUserInfo_OC,
    autoLoginOC,
    getWalletBalance,
    getBillRetrieval,
    fetchBill,
    getUserInfoOC,
    getPayQC,
  };
}
