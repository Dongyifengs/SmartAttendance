import axios from "axios";

// 创建Axios实例，配置基础Url和请求头
const api = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

// 生成接口参数（双重Base64编码）
function generateInterfaceParams(data: object) {
    const jsonStr = JSON.stringify(data)
    const firstEncode = window.Buffer.from(jsonStr).toString('base64')
    return `interface=${window.Buffer.from(firstEncode).toString('base64')}`
}

// 主要API调用函数
export async function apiCall(func: string, param: any, userKey?: string): Promise<any> {
    // 狗仔请求负载对象，这是API要求的固定格式
    const payload = {
        CommType: "function",                   // 通信类型固定为"function"
        Comm: func,                             // 具体的功能函数名称，由调用者传入具体的功能函数
        Param: {                                // 参数对象，保函业务参数和系统参数
            ...param,                           // 展开调用者传入的业务参数
            Source_PlatForm: 2                  // 固定值为2，标志请求来自软件端
        }
    }

    // 如果调用时传入了userKey参数，将其添加到参数对象中
    // userKey通常用于用户身份验证和权限控制
    if (userKey) {
        payload.Param.userKey = userKey;
    }

    // 将完整的负载对象进行双重Base64编码，生成最终的表单数据
    const formData = generateInterfaceParams(payload);

    // 尝试发送API请求
    try {
        // 使Axios发送POST请求，第一个参数为空字符串因为BaseUrl已经配置
        // 第二个参数是编码后的表单数据
        const response = await api.post('', formData)
        // 返回API相应的数据部分
        return response.data;
    } catch (error) {
        // 如果请求失败，在控制台输出错误的信息以便于调试
        console.log("[DEBUG] - API调用失败", error)
        // 重新抛出错误，让调用者能够处理这个错误
        throw error
    }
}
