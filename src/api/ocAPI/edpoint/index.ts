import axios from "axios"


// OCAPI Endpoint
export const OCAPI = axios.create({
  baseURL: 'https://api.etslink.net/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})
