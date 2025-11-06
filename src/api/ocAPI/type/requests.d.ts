// 请求体

// =============== [一卡通登录请求类型] =============== //
/**
 * 登录请求体类型
 * @interface OC_LoginRequestsBody
 * @property {string} appid - 应用ID
 * @property {number} from - 来源标识
 * @property {object} data - 登录数据对象
 * @property {string} data.school_no - 学校编号
 * @property {string} data.work_no - 工号
 * @property {string} data.password - 密码
 * @property {string} token - 令牌
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
// =============== [一卡通登录请求类型] =============== //


// =============== [一卡通获取钱包余额请求类型] =============== //
/**
 * 获取一卡通余额请求体类型
 * @interface OC_GetBalanceRequestBody
 * @property {string} appid - 应用ID
 * @property {number} from - 来源标识
 * @property {string} token - 令牌
 */
export interface OC_GetBalanceRequestBody {
  appid: string;
  from: number;
  token: string;
}
// =============== [一卡通获取钱包余额请求类型] =============== //

// =============== [一卡通获取账单请求类型] =============== //
/**
 * 一卡通获取账单请求体
 * @interface OC_BillRetrievalRequestBody
 * @property { string } appid 平台ID
 * @property { any } data 数据
 * @property { number } data.day_num 天数
 * @property { number } data.pageNum 一页数量
 * @property { number } data.pageSize 页数
 * @property { number } from 来源
 * @property { string } token 用户token
 */
export interface OC_BillRetrievalRequestBody {
  appid: string,
  data: {
    day_num: number,
    pageNum: number,
    pageSize: number
  },
  from: number,
  token: string
}
// =============== [一卡通获取账单请求类型] =============== //

// =============== [一卡通获取用户信息请求类型] =============== //
/**
 * 获取一卡通用户信息请求体类型
 * @interface OC_GetUserInfoRequestBody
 * @property {string} appid - 应用ID
 * @property {number} from - 来源标识
 * @property {string} token - 令牌
 */
export interface OC_GetUserInfoRequestBody {
  appid: string;
  from: number;
  token: string;
}
// =============== [一卡通获取用户信息请求类型] =============== //

// =============== [一卡通获取支付二维码请求类型] =============== //
/**
 * 获取一卡通支付二维码请求体类型
 * @interface OC_GetPayQrcodeRequestBody
 * @property {string} appid - 应用ID
 * @property {number} from - 来源标识
 * @property {string} token - 令牌
 */
export interface OC_GetPayQrcodeRequestBody {
  appid: string;
  from: number;
  token: string;
}
// =============== [一卡通获取支付二维码请求类型] =============== //

// =============== [一卡通获取缴费单位请求类型] =============== //
/**
 * 获取一卡通缴费单位请求体类型
 * @interface OC_GetPayUnitRequestBody
 * @property {string} appid - 应用ID
 * @property {object} data - 数据对象
 * @property {number} data.configId - 配置ID
 * @property {string} data.payment_type - 支付类型
 * @property {number} from - 来源标识
 * @property {string} token - 令牌
 */
export interface OC_GetPayUnitRequestBody {
  appid: string;
  data: {
    configId: number;
    payment_type: string;
  },
  from: number;
  token: string;
}
// =============== [一卡通获取缴费单位请求类型] =============== //
