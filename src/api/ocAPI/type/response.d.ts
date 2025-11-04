// 返回体

// 登录响应数据类型
export interface OCLoginResponseData {
  token: string;
  user_name: string;
  work_no: string;
  school_no: string;
  school_name: string;
  cust_code: string;
  dept_name: string;
  phone: string | null;
  photoUrl: string | null;
  isShow: string | null;
  identityType: string;
  backUrl: string;
  logoUrl: string;
  showInfo: string | null;
  isManage: string | null;
  status: string | null;
  faceCollectStatus: string | null;
  faceScanStatus: string | null;
  faceScanUid: string | null;
  aliUserUid: string | null;
  aliUserAccount: string | null;
  schoolCode: string | null;
  bindType: string | null;
  custId: string | null;
  passwordChange: number;
  cardType: number;
  address: string | null;
  cardStatus: number;
  siteId: string | null;
  siteName: string | null;
  backLocalUrl: string;
  logoLocalUrl: string;
  yzqxBindFlag: string | null;
}

// 完整的登录响应类型
export interface OCLoginResponse {
  code: number;
  msg: string;
  data: OCLoginResponseData;
  count: string | null;
}


// =============== [一卡通一卡通余额返回类型] =============== //
export interface OC_GetBalanceData {
  msg: string;
  code: number;
  data: OC_GetBalanceInfo;
}
// =============== [一卡通一卡通余额返回类型] =============== //