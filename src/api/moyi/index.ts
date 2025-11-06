import axios from 'axios'

export const MOYIAPI = axios.create({
  baseURL: '/MoYiAPI',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 上传信息
 */
export async function MOYI_UploadInfo(
  name: string,
  time: string,
  func: string,
  request: string,
  response: string,
  data: string
) {
  const body = {
    name,
    time,
    function: func,
    request,
    response,
    data
  }

  const res = await MOYIAPI.post('/web/upload', body)
  return res.data
}