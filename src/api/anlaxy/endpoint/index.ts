import axios from 'axios';

// RollCallAPI Endpoint
export const RollCallAPI = axios.create({
  baseURL: '/CallAPI',
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
