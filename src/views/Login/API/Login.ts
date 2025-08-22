/**/
import {encrypt} from "../../../API/ZHKQ/Ctypto.ts";
import {apiCall} from "../../../API/ZHKQ/RollcallApiClient.ts";

export async function UserLogin(username: string, password: string, deviceId: string) {
    try {
        // 密码加密处理
        const encryptedPwd = encrypt(password)
        console.log(encryptedPwd);
        // 返回API结果
        return apiCall("Member_Login", {
            // 用户学号
            userid: username,
            // 用户密码（加密处理）
            userpwd: encryptedPwd,
            // 设备ID，开发者设备ID为：863293062988115
            client_local_id: deviceId,
        })
    } catch (error) {
        throw error
    }
}
