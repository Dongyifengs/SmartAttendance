import router from "../../../router";
import {ElMessage} from "element-plus";

export const detectAccountData = async () => {
    const userInfo = localStorage.getItem("SA-UserInfo");
    const userFrom = localStorage.getItem("SA-LoginFrom");

    if (!userInfo) {
        await router.push("/");
        return;
    }

    // 判断是否在维护期 (0:00–6:00)
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 0 && hour < 6) {
        console.log("维护期内，不做登录检测");
        return; // 直接退出，不判断过期
    }

    try {
        if (userFrom) {
            const userData = JSON.parse(userFrom);
            const loginTime = new Date(userData.LoginTime).getTime();
            const nowTime = now.getTime();
            const expireLimit = 8 * 60 * 60 * 1000; // 8小时

            if (nowTime - loginTime > expireLimit) {
                localStorage.removeItem("SA-UserInfo");
                localStorage.removeItem("SA-LoginFrom");
                ElMessage.warning("登录已过期，请重新登录");
                await router.push("/");
                return;
            }

            ElMessage.success("检测到本地已有登录记录");
            console.log("本地登录表单", userData);
        } else {
            ElMessage.success("检测到本地已有登录信息");
        }

    } catch (e) {
        console.error("解析 SA-LoginFrom 出错:", e);
        await router.push("/");
    }
};

export const outLogin = async () => {
    localStorage.removeItem("SA-LoginFrom");
    localStorage.removeItem("SA-UserInfo");
    await router.push("/");
    ElMessage.success("已退出登录");
}
