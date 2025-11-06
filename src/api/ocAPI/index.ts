import { OCAPI } from '@/api/ocAPI/edpoint';
import type {
  OCLoginResponse,
  OC_GetBalanceData,
  OC_BillRetrievalResponse,
  OC_GetUserInfoResponse,
  OC_GetPayQrcodeResponse,
  OC_GetPaymentUnitsRequestBody,
  OC_GetBuildingNoResponse,
  OC_GetRoomNoResponse,
  OC_GetAirConditionerBalanceResponse,
} from '@/api/ocAPI/type/response';
import type {
  OC_BillRetrievalRequestBody,
  OC_GetAirConditionerBalanceRequestBody,
  OC_GetBalanceRequestBody,
  OC_GetBuildingNoRequestBody,
  OC_GetPayQrcodeRequestBody,
  OC_GetPayUnitRequestBody,
  OC_GetRoomNoRequestBody,
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

/**
 * 获取支付二维码
 * @param token - 用户登录后获取的 token
 * @return 支付二维码响应数据
 */
export async function OC_GetPayQRCode(token: string): Promise<OC_GetPayQrcodeResponse> {
  const body: OC_GetPayQrcodeRequestBody = {
    appid: OCDEVICE_ID,
    from: 4,
    token: token,
  };
  const response = await OCAPI.post<OC_GetPayQrcodeResponse>('user/schoolcode', body);
  return response.data;
}

/**
 * 获取缴费单位
 * @param token - 用户登录后获取的 token
 * @return 缴费单位响应数据
 */
export async function OC_GetPaymentUnits(token: string): Promise<OC_GetPaymentUnitsRequestBody> {
  const body: OC_GetPayUnitRequestBody = {
    appid: OCDEVICE_ID,
    data: {
      configId: 1,
      payment_type: '2',
    },
    from: 4,
    token: token,
  };
  const response = await OCAPI.post<OC_GetPaymentUnitsRequestBody>('elecWater/getAreaList', body);
  return response.data;
}

/**
 * 获取楼栋号
 * @param token - 用户登录后获取的 token
 * @return 楼栋号响应数据
 */
export async function OC_GetBuildingNumbers(token: string): Promise<OC_GetBuildingNoResponse> {
  const body: OC_GetBuildingNoRequestBody = {
    appid: OCDEVICE_ID,
    data: {
      area_id: '1',
      configId: 1,
      payment_type: '2',
    },
    from: '4',
    token: token,
  };
  const response = await OCAPI.post<OC_GetBuildingNoResponse>('elecWater/getBuildList', body);
  return response.data;
}

/**
 * 获取房间号
 * @param build_id - 楼栋ID
 * @param token - 用户登录后获取的 token
 * @return 房间号响应数据
 */
export async function OC_GetRoomNumbers(
  build_id: string,
  token: string
): Promise<OC_GetRoomNoResponse> {
  const body: OC_GetRoomNoRequestBody = {
    appid: OCDEVICE_ID,
    data: {
      area_id: '1',
      build_id: build_id,
      configId: 1,
      payment_type: '2',
      source: null,
    },
    from: '4',
    token: token,
  };
  const response = await OCAPI.post<OC_GetRoomNoResponse>('elecWater/getRoomList', body);
  return response.data;
}

/**
 * 获取空调余额
 * @param build_id - 楼栋ID
 * @param room_id - 房间ID
 * @param token - 用户登录后获取的 token
 */
export async function OC_GetACBalance(
  build_id: string,
  room_id: string,
  token: string
): Promise<OC_GetAirConditionerBalanceResponse> {
  const body: OC_GetAirConditionerBalanceRequestBody = {
    appid: OCDEVICE_ID,
    data: {
      area_id: '1',
      build_id: build_id,
      configId: 1,
      item_id: '1',
      payment_type: '2',
      room_id: room_id,
      source: null,
    },
    from: 4,
    token: token,
  };
  const response = await OCAPI.post<OC_GetAirConditionerBalanceResponse>(
    'api/elecWater/getBalance',
    body
  );
  return response.data;
}
