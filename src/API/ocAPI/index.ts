const OC_API_LOGIN = "https://api.etslink.net/api/user/login";

import axios from "axios";
import type { OCLoginRequestBody } from "./class.ts";

// OC登录函数，需要传递用户名和密码，返回结果为API返回的JSON对象
export async function OC_LOGIN(username: string, password: string) {
    // 构建请求体
    const body: OCLoginRequestBody = {
        appid: "VlRCRlBRPT0=",
        from: 4,
        data: {
            school_no: "220817114672",
            work_no: username,
            password: password
        },
        token: "",
    };
    // 使用axios发送POST请求
    const response = await axios.post(OC_API_LOGIN, body, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    // 返回API响应内容
    return response.data;
}