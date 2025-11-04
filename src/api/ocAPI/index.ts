import { OCAPI } from '@/api/ocAPI/edpoint';
import type {
  OC_GetBalanceData,
  OC_GetBalanceRequestBody,
} from '@/api/ocAPI/type.ts';
import type { OCLoginResponse } from '@/api/ocAPI/type/response';
import type { OC_LoginRequestsBody } from '@/api/ocAPI/type/requests';

// 获取平台ID
const OCDEVICE_ID = import.meta.env.VITE_OC_DEVICE_ID;

/**
 * 一卡通登录函数
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
 */
export async function OC_GetBalance(token: string): Promise<OC_GetBalanceData> {
  const body: OC_GetBalanceRequestBody = {
    appid: OCDEVICE_ID,
    from: 4,
    token: token,
  };

  return await OCAPI.post('user/querycardinfo', body); // 返回完整响应
}
