import { OCAPI } from '@/api/ocAPI/edpoint';
import type { OCLoginResponse, OC_GetBalanceData } from '@/api/ocAPI/type/response';
import type { OC_GetBalanceRequestBody, OC_LoginRequestsBody } from '@/api/ocAPI/type/requests';

// 获取平台ID
const OCDEVICE_ID = import.meta.env.VITE_OC_DEVICE_ID;

/**
 * 一卡通登录函数
 * @param username - 用户名（工号）
 * @param password - 密码
 * @return 登录响应数据
 */
export async function OC_Login(username: string, password: string): Promise<OCLoginResponse> {
  const body: OC_LoginRequestsBody = {
    appid: OCDEVICE_ID,
    from: 4,
    data: {
      school_no: import.meta.env.VITE_OC_SCHOOL_NO,
      work_no: username,
      password: password,
    },
    token: '',
  };
  const response = await OCAPI.post<OCLoginResponse>('user/login', body);
  return response.data;
}

/**
 * 一卡通获取钱包余额
 * @param token - 用户登录后获取的 token
 * @return 钱包余额响应数据
 */
export async function OC_GetBalance(token: string): Promise<OC_GetBalanceData> {
  const body: OC_GetBalanceRequestBody = {
    appid: OCDEVICE_ID,
    from: 4,
    token: token,
  };
  const response = await OCAPI.post<OC_GetBalanceData>('user/querycardinfo', body);
  return response.data;
}
