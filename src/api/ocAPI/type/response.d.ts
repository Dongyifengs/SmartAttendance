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

// =============== [一卡通获取账单返回类型] =============== //
export interface OC_BillRetrievalResponse {
  code: number,
  data: OC_BillRetrievalInfo,
  msg: string
}

export interface OC_BillRetrievalInfo {
  all_count: number,
  list: OC_BillRetrievalList[]
}

export interface OC_BillRetrievalList {
  acc_code:     number;
  createTime:   Date;
  desc:         string;
  is_recharge:  number;
  pay_way:      number;
  trade_amount: number;
  trade_no:     string;
  trade_time:   Date;
}
// =============== [一卡通获取账单返回类型] =============== //

// =============== [一卡通获取用户信息返回类型] =============== //
/**
 * 一卡通获取用户信息返回体类型
 * @interface OC_GetUserInfoResponse
 * @property {number} code - 响应状态码
 * @property {null} count - 计数（通常为 null）
 * @property {OC_GetUserInfoResponseInfo} data - 用户信息数据
 * @property {string} mag - 响应消息
 */
export interface OC_GetUserInfoResponse {
  code: number,
  count: null,
  data: OC_GetUserInfoResponseInfo,
  mag: string,
}

/**
 * 一卡通获取用户信息返回体类型
 * @interface OC_GetUserInfoResponseInfo
 * @property {null} cardEndData - 卡结束数据（通常为 null）
 * @property {string} dept_name - 部门名称
 * @property {null} mobile - 手机号码（通常为 null）
 * @property {string} name - 用户姓名
 * @property {null} photo - 照片（通常为 null）
 * @property {null} schoolNo - 学校编号（通常为 null）
 * @property {null} school_name - 学校编号（通常为 null）
 * @property {string} shenfen - 身份
 * @property {number} status - 状态
 * @property {null} studentId - 学生ID（通常为 null）
 * @property {string} work_no - 学号ID
 */
export interface OC_GetUserInfoResponseInfo {
  cardEndData: null,
  dept_name: string
  mobile: null,
  name: string,
  photo: null,
  schoolNo: null,
  school_name: null,
  shenfen: string,
  status: number,
  studentId: null,
  work_no: string

}
// =============== [一卡通获取用户信息返回类型] =============== //

// =============== [一卡通获取支付二维码返回类型] =============== //
/**
 * 一卡通获取支付二维码返回体类型
 * @interface OC_GetPayQrcodeResponse
 * @property {number} code - 响应状态码
 * @property {OC_GetPayQrcodeData} data - 支付二维码数据
 * @property {string} msg - 响应消息
 */
export interface OC_GetPayQrcodeResponse {
  code: number,
  data: OC_GetPayQrcodeData,
  msg: string
}

/**
 * 一卡通获取支付二维码数据类型
 * @interface OC_GetPayQrcodeData
 * @property {string} code_info - 二维码信息
 */
export interface OC_GetPayQrcodeData {
  code_info: string
}
// =============== [一卡通获取支付二维码返回类型] =============== //

// =============== [一卡通获取缴费单位返回类型] =============== //
/**
 * 一卡通获取缴费单位返回体类型
 * @interface OC_GetPaymentUnitsRequestBody
 * @property {number} code - 响应状态码
 * @property {string} msg - 响应消息
 * @property {OC_GetPaymentUnitsData} data - 缴费单位数据
 * @property {null} count - 计数（通常为 null）
 */
export interface OC_GetPaymentUnitsRequestBody {
  code: number,
  msg: string,
  data: OC_GetPaymentUnitsData,
  count: null
}

/**
 * 一卡通获取缴费单位数据类型
 * @interface OC_GetPaymentUnitsData
 * @property {OC_GetPaymentUnitsList[]} list - 缴费单位列表
 */
export interface OC_GetPaymentUnitsData {
  list: OC_GetPaymentUnitsList[]
}

/**
 * 一卡通获取缴费单位列表类型
 * @interface OC_GetPaymentUnitsList
 * @property {string} area_id - 区域ID
 * @property {string} area_name - 区域名称
 * @property {null} source - 来源（通常为 null）
 */
export interface OC_GetPaymentUnitsList {
  area_id: string,
  area_name: string,
  source: null
}
// =============== [一卡通获取缴费单位返回类型] =============== //

// =============== [一卡通获取楼栋号返回类型] =============== //
/**
 * 一卡通获取楼栋号返回体类型
 * @interface OC_GetBuildingNoResponse
 * @property {number} code - 响应状态码
 * @property {null} count - 计数（通常为 null）
 * @property {OC_GetBuildingNoData} data - 楼栋号数据
 * @property {string} msg - 响应消息
 */
export interface OC_GetBuildingNoResponse {
  code: number,
  count: null,
  data: OC_GetBuildingNoData,
  msg: string
}

/**
 * 一卡通获取楼栋号数据类型
 * @interface OC_GetBuildingNoData
 * @property {OC_GetBuildingNoList[]} list - 楼栋号列表
 */
export interface OC_GetBuildingNoData {
  list: OC_GetBuildingNoList[]
}

/**
 * 一卡通获取楼栋号列表类型
 * @interface OC_GetBuildingNoList
 * @property {string} build_id - 楼栋ID
 * @property {string} build_name - 楼栋名称
 * @property {null} source - 来源（通常为 null）
 */
export interface OC_GetBuildingNoList {
  build_id: string,
  build_name: string,
  source: null
}
// =============== [一卡通获取楼栋号返回类型] =============== //

// =============== [一卡通获取房间号返回类型] =============== //
/**
 * 一卡通获取房间号返回体类型
 * @interface OC_GetRoomNoResponse
 * @property {number} code - 响应状态码
 * @property {string} msg - 响应消息
 * @property {OC_GetRoomNoResponseData} data - 房间号数据
 * @property {null} count - 计数（通常为 null）
 */
export interface OC_GetRoomNoResponse {
  code: number,
  msg: string,
  data: OC_GetRoomNoResponseData,
  count: null
}

/**
 * 一卡通获取房间号响应数据类型
 * @interface OC_GetRoomNoResponseData
 * @property {OC_GetRoomNoData[]} list - 房间号列表
 */
export interface OC_GetRoomNoResponseData {
  list: OC_GetRoomNoData[]
}

/**
 * 一卡通获取房间号数据类型
 * @interface OC_GetRoomNoData
 * @property {string} room_id - 房间ID
 * @property {string} room_name - 房间名称
 * @property {null} source - 来源（通常为 null）
 */
export interface OC_GetRoomNoData {
  room_id: string,
  room_name: string,
  source: null
}
// =============== [一卡通获取房间号返回类型] =============== //

// =============== [一卡通获取空调余额返回类型] =============== //
/**
 * 一卡通获取空调余额返回体类型
 * @interface OC_GetAirConditionerBalanceResponse
 * @property {number} code - 响应状态码
 * @property {string} msg - 响应消息
 * @property {OC_GetAirConditionerBalanceData} data - 空调余额数据
 * @property {null} count - 计数（通常为 null）
 */
export interface OC_GetAirConditionerBalanceResponse {
  code: number,
  msg: string,
  data: OC_GetAirConditionerBalanceData,
  count: null
}

/**
 * 一卡通获取空调余额数据类型
 * @interface OC_GetAirConditionerBalanceData
 * @property {string} balance - 余额
 * @property {string} displayMargin - 显示类型文本
 */
export interface OC_GetAirConditionerBalanceData {
  balance: string,
  displayMargin: string
}
// =============== [一卡通获取空调余额返回类型] =============== //
