import { OCAPI } from '@/api/ocAPI/edpoint';
import type { OC_GetBalanceData, OC_GetBalanceRequestBody, OCLoginRequestBody, } from '@/api/ocAPI/type.ts';

const OCDEVICE_ID = import.meta.env.VITE_OC_DEVICE_ID;

/**
 * 一卡通登录函数
 * @param username - 用户名
 * @param password - 密码
 * @returns response data
 * @constructor
 */
export async function OC_Login(username: string, password: string) {
  const body: OCLoginRequestBody = {
    appid: OCDEVICE_ID,
    from: 4,
    data: {
      school_no: import.meta.env.VITE_OC_SCHOOL_NO,
      work_no: username,
      password: password,
    },
    token: '',
  };
  const response = await OCAPI.post('user/login', body);
  return response.data;
}

/**
 * 一卡通获取钱包余额
 * @param token - 用户登录后获取的 token
 */
export async function OC_GetBalance(token: string): Promise<OC_GetBalanceData> {
  const body: OC_GetBalanceRequestBody = {
    appid: OCDEVICE_ID,
    from: 4,
    token: token,
  };

  return await OCAPI.post('user/querycardinfo', body); // 返回完整响应
}
