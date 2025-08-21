import {ElMessage} from "element-plus";
import {LoginForm} from "./Defined";

// 用户登录按钮
export const UserLoginSubmit = () => {
    if (!LoginForm.Username || !LoginForm.Password) {
        ElMessage.warning("请输入账号和密码");
        return;
    }
    if (LoginForm.Remember) {
        localStorage.setItem("SA-LoginForm", JSON.stringify(LoginForm));
    } else {
        localStorage.removeItem("SA-LoginForm");
    }
    ElMessage.success("登录成功");
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