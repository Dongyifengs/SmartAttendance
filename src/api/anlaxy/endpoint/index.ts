import axios from 'axios';

// RollCallAPI Endpoint
export const RollCallAPI = axios.create({
  baseURL: 'https://rollcall.anlaxy.com.cn/SerApi/v02',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// PairAPI Endpoint
export const PairAPI = axios.create({
  baseURL: '/PairAPI',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
