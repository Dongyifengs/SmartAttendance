import { OCAPI } from '@/api/ocAPI/edpoint';
import type {
  OCLoginResponse,
  OC_GetBalanceData,
  OC_BillRetrievalResponse,
  OC_GetUserInfoResponse,
} from '@/api/ocAPI/type/response';
import type {
  OC_BillRetrievalRequestBody,
  OC_GetBalanceRequestBody,
  OC_GetUserInfoRequestBody,
  OC_LoginRequestsBody,
} from '@/api/ocAPI/type/requests';

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

/**
 * 一卡通获取账单信息
 * @param pageNum 几个
 * @param pageSize 页面数
 * @param day_num 几天
 * @param token token
 * @constructor
 */
export async function OC_BillRetrieval(
  pageNum: number,
  pageSize: number,
  day_num: number,
  token: string
): Promise<OC_BillRetrievalResponse> {
  const body: OC_BillRetrievalRequestBody = {
    appid: OCDEVICE_ID,
    data: {
      day_num: day_num,
      pageNum: pageNum,
      pageSize: pageSize,
    },
    from: 4,
    token: token,
  };
  const response = await OCAPI.post<OC_BillRetrievalResponse>('user/tradeinfolist', body);
  return response.data;
}

/**
 * 获取用户信息
 * @param token - 用户登录后获取的 token
 * @return 用户信息响应数据
 */
export async function OC_GetUserInfo(token: string): Promise<OC_GetUserInfoResponse> {
  const body: OC_GetUserInfoRequestBody = {
    appid: OCDEVICE_ID,
    from: 4,
    token: token,
  };
  const response = await OCAPI.post<OC_GetUserInfoResponse>('user/getUserInfo', body);
  return response.data;
}
