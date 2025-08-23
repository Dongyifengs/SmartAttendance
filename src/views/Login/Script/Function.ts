import {LoginForm} from "./Defined";
import {UserLogin} from "../API/Login.ts";
import {ElMessage} from "element-plus";
import router from "../../../router/index.ts"

// 用户登录按钮
export const UserLoginSubmit = async () => {
    try {
        // 构建请求体，并且发送请求
        const response = await UserLogin(
            LoginForm.Username,             // 学生学号
            LoginForm.Password,             // 学生密码
            LoginForm.DeviceId,             // 设备ID
        )
        // 非1的情况为异常情况，输出错误信息
        if (response.state != '1') {
            ElMessage.error(response.message);  // 显示错误信息
        } else {
            // 登录成功
            localStorage.setItem('SA-UserInfo', JSON.stringify(response))  // 保存服务器数据返回的用户信息
            if (LoginForm.Remember) {
                const now = new Date();
                const LoginTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} `
                    + `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
                localStorage.setItem('SA-LoginFrom', JSON.stringify({
                    username: LoginForm.Username,
                    password: LoginForm.Password,
                    deviceId: LoginForm.DeviceId,
                    Remember: LoginForm.Remember,
                    LoginTime: LoginTime
                }))
            } else {
                localStorage.removeItem('SA-LoginFrom');
            }
            await router.push('/home');
            ElMessage.success("登录成功！")
        }
    } catch (error) {
        console.error(error)
    }
};

// 读取本地存储
export const UserSaveForm = () => {
    const savedUser = localStorage.getItem("SA-LoginFrom");  // ⚡这里改成一致的
    if (savedUser) {
        const UserInfo = JSON.parse(savedUser);
        LoginForm.Username = UserInfo.username;
        LoginForm.DeviceId = UserInfo.deviceId;
        LoginForm.Password = UserInfo.password;
        LoginForm.Remember = UserInfo.Remember;
    }
}