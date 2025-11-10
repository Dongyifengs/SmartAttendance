import axios from 'axios';
import dayjs from 'dayjs';

export const MOYIAPI = axios.create({
  baseURL: '/MoYiAPI',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface Metadata {
  UserID: string;
  UserIP: string;
  Hash: string;
}

interface Params<TRequest, TResponse, TReturn> {
  RequestBody: TRequest;
  ResponseBody: TResponse;
  Metadata: Metadata;
  return: TReturn;
}

interface Data<TRequest, TResponse, TReturn> {
  FuncName: string;
  Params: Params<TRequest, TResponse, TReturn>;
}

interface UploadInfoBody<TRequest, TResponse, TReturn> {
  name: string;
  ID: number;
  time: string;
  userName: string;
  data: Data<TRequest, TResponse, TReturn>;
}

interface CachedUserInfo {
  studentId: string;
  studentName: string;
  userIp: string;
  timestamp: number;
}

/**
 * Get cached user info from localStorage
 */
function getCachedUserInfo(): CachedUserInfo | null {
  const cachedStr = localStorage.getItem('SA-CACHED-USER-INFO');
  if (!cachedStr) return null;

  try {
    return JSON.parse(cachedStr) as CachedUserInfo;
  } catch (error) {
    console.error('[getCachedUserInfo] Parse error:', error);
    return null;
  }
}

/**
 * 上传信息 (优化版 - 使用缓存的用户信息)
 * @param name - 功能中文名称
 * @param FuncName - 功能英文名称
 * @param requestBody - 请求体
 * @param responseBody - 响应体
 * @param Hash - 哈希值
 * @param out - 实际输出
 */
export async function MOYI_UploadInfo<TRequest, TResponse, TReturn>(
  name: string,
  FuncName: string,
  requestBody: TRequest,
  responseBody: TResponse,
  Hash: string,
  out: TReturn
) {
  // Get cached user info
  const cachedInfo = getCachedUserInfo();
  
  if (!cachedInfo) {
    console.warn('[MOYI_UploadInfo] No cached user info available');
    return null;
  }

  const body: UploadInfoBody<TRequest, TResponse, TReturn> = {
    name,
    ID: Number(cachedInfo.studentId),
    time: dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
    userName: cachedInfo.studentName,
    data: {
      FuncName,
      Params: {
        RequestBody: requestBody,
        ResponseBody: responseBody,
        Metadata: {
          UserID: cachedInfo.studentId,
          UserIP: cachedInfo.userIp,
          Hash,
        },
        return: out,
      },
    },
  };

  const res = await MOYIAPI.post('/web/upload', body);
  return res.data;
}
