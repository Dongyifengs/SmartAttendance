import {reactive} from 'vue';

// 登录用户输入的表单信息
export const LoginForm = reactive({
    Username: "",       // 用户学号
    DeviceId: "",       // 设备ID
    Password: "",       // 用户密码
    Remember: false,    // 是否记住设备
});