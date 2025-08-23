import {LoginForm} from "./Defined";
import {UserLogin} from "../API/Login.ts";
import {ElMessage} from "element-plus";

// 用户登录按钮
export const UserLoginSubmit = async () => {
    try {
        // 构建请求体，并且发送请求
        const response = await UserLogin(
            LoginForm.Username,
            LoginForm.Password,
            LoginForm.DeviceId,
        )
        // 非1的情况为异常情况，输出错误信息
        if (response.state != '1') {
            ElMessage.error(response.message);
        } else {
            // 登录成功
            localStorage.setItem('UserInfo', JSON.stringify(response))
            ElMessage.success("登录成功！")
            console.log(response)
        }
    } catch (error) {
        console.error(error)
    }
};

// 读取本地存储
export const UserSaveForm = () => {
    const savedUser = localStorage.getItem("SA-LoginForm");
    if (savedUser) {
        const UserInfo = JSON.parse(savedUser);
        LoginForm.Username = UserInfo.Username;
        LoginForm.DeviceId = UserInfo.DeviceId;
        LoginForm.Password = UserInfo.Password;
        LoginForm.Remember = true;
    }
}