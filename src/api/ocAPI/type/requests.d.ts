// 请求体

/**
 * 登录请求体类型
 */
export interface OC_LoginRequestsBody {
  appid: string;
  from: number;
  data: {
    school_no: string;
    work_no: string;
    password: string;
  };
  token: string;
}

// =============== [一卡通一卡通请求类型] =============== //
export interface OC_GetBalanceRequestBody {
  appid: string;
  from: number;
  token: string;
}
// =============== [一卡通一卡通请求类型] =============== //