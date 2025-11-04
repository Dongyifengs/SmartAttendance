// 返回体

// =============== [一卡通登录返回类型] =============== //
/**
 * 一卡通登录响应数据类型
 * @interface OCLoginResponseData
 * @property {string} token - 登录令牌
 * @property {string} user_name - 用户名
 * @property {string} work_no - 工号
 * @property {string} school_no - 学号
 * @property {string} school_name - 学校名称
 * @property {string} cust_code - 客户代码
 * @property {string} dept_name - 部门名称
 * @property {string | null} phone - 电话号码
 * @property {string | null} photoUrl - 照片URL
 * @property {string | null} isShow - 是否显示
 * @property {string} identityType - 身份类型
 * @property {string} backUrl - 返回URL
 * @property {string} logoUrl - Logo URL
 * @property {string | null} showInfo - 显示信息
 * @property {string | null} isManage - 是否管理
 * @property {string | null} status - 状态
 * @property {string | null} faceCollectStatus - 人脸采集状态
 * @property {string | null} faceScanStatus - 人脸扫描状态
 * @property {string | null} faceScanUid - 人脸扫描UID
 * @property {string | null} aliUserUid - 支付宝用户UID
 * @property {string* |null} aliUserAccount - 支付宝用户账号
 * @property {string | null} schoolCode - 学校代码
 * @property {string | null} bindType - 绑定类型
 * @property {string | null} custId - 客户ID
 * @property {number} passwordChange - 密码更改标志
 * @property {number} cardType - 卡片类型
 * @property {string | null} address - 地址
 * @property {number} cardStatus - 卡片状态
 * @property {string | null} siteId - 站点ID
 * @property {string | null} siteName - 站点名称
 * @property {string} backLocalUrl - 本地返回URL
 * @property {string} logoLocalUrl - 本地Logo URL
 * @property {string | null} yzqxBindFlag - 绑定标志
 */
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

/**
 * 完整的登录响应类型
 * @interface OCLoginResponse
 * @property {number} code - 响应状态码
 * @property {string} msg - 响应消息
 * @property {OCLoginResponseData} data - 登录数据对象
 * @property {string | null} count - 计数（通常为 null）
 */
export interface OCLoginResponse {
  code: number;
  msg: string;
  data: OCLoginResponseData;
  count: string | null;
}
// =============== [一卡通登录返回类型] =============== //


// =============== [一卡通余额返回类型] =============== //
/**
 * 获取一卡通余额响应体类型
 * @interface OC_GetBalanceData
 * @property {string} msg - 响应消息
 * @property {number} code - 响应状态码
 * @property {OC_GetBalanceInfo} data - 余额信息数据
 */
export interface OC_GetBalanceData {
  msg: string;
  code: number;
  data: OC_GetBalanceInfo;
}

/**
 * 一卡通余额信息类型
 * @interface OC_GetBalanceInfo
 * @property {number} card_status - 卡片状态
 * @property {number} wallet2_amount - 钱包2
 * @property {number} amount - 总余额
 * @property {number} wallet1_amount - 钱包1
 * @property {number} wallet0_amount - 钱包0
 * @property {number} card_type - 卡片类型
 */
export interface OC_GetBalanceInfo {
  card_status: number;
  wallet2_amount: number
  amount: number
  wallet1_amount: number
  wallet0_amount: number
  card_type: number
}
// =============== [一卡通余额返回类型] =============== //