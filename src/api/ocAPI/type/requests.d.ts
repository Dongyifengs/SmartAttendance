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