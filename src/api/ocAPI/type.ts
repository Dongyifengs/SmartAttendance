export interface OC_UserInfo {
  code:  number;
  msg:   string;
  data:  Data;
  count: null;
}

export interface Data {
  token:             string;
  user_name:         string;
  work_no:           string;
  school_no:         string;
  school_name:       string;
  cust_code:         string;
  dept_name:         string;
  phone:             null;
  photoUrl:          null;
  isShow:            null;
  identityType:      string;
  backUrl:           string;
  logoUrl:           string;
  showInfo:          null;
  isManage:          null;
  status:            null;
  faceCollectStatus: null;
  faceScanStatus:    null;
  faceScanUid:       null;
  aliUserUid:        null;
  aliUserAccount:    null;
  schoolCode:        null;
  bindType:          null;
  custId:            null;
  passwordChange:    number;
  cardType:          number;
  address:           null;
  cardStatus:        number;
  siteId:            null;
  siteName:          null;
  backLocalUrl:      string;
  logoLocalUrl:      string;
  yzqxBindFlag:      null;
}


// =============== [一卡通登录请求类型] =============== //
export interface OCLoginRequestBody {
  appid: string;
  from: number;
  data: OCLoginData;
  token: string;
}

export interface OCLoginData {
  school_no: string;
  work_no: string;
  password: string;
}
// =============== [一卡通登录请求类型] =============== //

// =============== [一卡通获取钱包请求类型] =============== //
export interface OC_GetBalanceRequestBody {
  appid: string;
  from: number;
  token: string;
}

export interface OC_GetBalanceData {
  msg: string;
  code: number;
  data: OC_GetBalanceInfo;
}
// 秉持着能用先别动的原则，看着难受也给我忍者
export interface OC_GetBalanceInfo {
  data: OC_GetBalanceInfo;
  card_status: number;
  wallet2_amount:number
  amount: number;
  wallet1_amount: number;
  wallet0_amount: number;
  card_type: number;
}
// =============== [一卡通获取钱包请求类型] =============== //

