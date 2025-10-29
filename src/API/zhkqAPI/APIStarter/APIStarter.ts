import axios from "axios";

// RollCallAPI Starter
export const RollCallAPI = axios.create({
    baseURL: "https://rollcall.anlaxy.com.cn/SerApi/v02",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
});

// PairAPI Starter
export const PairAPI = axios.create({
    baseURL: "/PairAPI",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
});