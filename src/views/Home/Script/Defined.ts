import { reactive } from 'vue';

export const UserInfoData = reactive(JSON.parse(localStorage.getItem('SA-UserInfo') || '{}'));
export const LoginFromData = reactive(JSON.parse(localStorage.getItem('SA-LoginFrom') || '{}'));
