import axios from 'axios';

// OCAPI Endpoint
export const OC_API = axios.create({
  baseURL: 'https://api.etslink.net/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});
