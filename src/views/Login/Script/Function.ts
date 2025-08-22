import {LoginForm} from "./Defined";
import {UserLogin} from "../API/Login.ts";
import {ElMessage} from "element-plus";

// 用户登录按钮
export const UserLoginSubmit = async () => {
    const response = await UserLogin(
        LoginForm.Username,
        LoginForm.Password,
        LoginForm.DeviceId,
    )
    if (response.state != '1') {
        ElMessage({
            type: "error",
            message: response.info,
        })
    } else {
        ElMessage({
            type: "success",
            message: "登录成功！",
        })
        console.log(response)
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