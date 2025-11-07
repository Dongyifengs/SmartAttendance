import axios from 'axios';
import dayjs from 'dayjs';

export const MOYIAPI = axios.create({
  baseURL: '/MoYiAPI',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface Metadata {
  UserId: string;
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
  ID: string;
  time: string;
  userName: string;
  data: Data<TRequest, TResponse, TReturn>;
}

/**
 * 上传信息
 */
export async function MOYI_UploadInfo<TRequest, TResponse, TReturn>(
  name: string,
  id: string,
  userName: string,
  FuncName: string,
  requestBody: TRequest,
  responseBody: TResponse,
  UserID: string,
  UserIP: string,
  Hash: string,
  out: TReturn
) {
  const body: UploadInfoBody<TRequest, TResponse, TReturn> = {
    name: name,
    ID: id,
    time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    userName: userName,
    data: {
      FuncName: FuncName,
      Params: {
        RequestBody: requestBody,
        ResponseBody: responseBody,
        Metadata: {
          UserId: UserID,
          UserIP: UserIP,
          Hash: Hash,
        },
        return: out,
      },
    },
  };

  const res = await MOYIAPI.post('', body);
  return res.data;
}