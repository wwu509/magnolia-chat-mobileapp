import axios from 'axios';
import * as Crypto from 'expo-crypto';
import { getAccessToken, setAccessToken } from '../utils/access-token-data';
import { AUTH_API } from '../constants/api-routes';
import { generateHmac } from './request-signature';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const CLIENT_ID = process.env.EXPO_PUBLIC_SIGNATURE_CLIENT_ID;

const axiosConfig = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'en',
    'Content-Type': 'application/json',
    origin: 'http://testing-tenant-his.pikessoft.com',
    // origin: "http://ps-his.pikessoft.com",
  },
});

axiosConfig.interceptors.request.use(
  async config => {
    const token = await getAccessToken();
    if (token?.access_token) {
      config.headers.Authorization = `Bearer ${token?.access_token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosConfig.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const _token = await getAccessToken();
        const response = await axios.post(
          `${API_URL}${AUTH_API.REFRESH_TOKEN}`,
          {
            refreshToken: _token?.refreshToken,
          },
        );
        const myToken = {
          token: response.data?.access_token,
          refreshToken: response?.data?.refresh_token,
          userId: _token?.userId,
        };
        await setAccessToken(myToken);
        originalRequest.headers.Authorization = `Bearer ${response.data?.access_token}`;
        return axios(originalRequest);
      } catch (error) {
        //logout logic
      }
    }

    return Promise.reject(error);
  },
);

axiosConfig.interceptors.request.use(config => {
  const body = config.data || {};
  const url = config?.url;
  const nonce = Crypto.randomUUID();
  const timestamp = new Date().getTime();
  const messageParams = { url, body, nonce, timestamp };
  const message = JSON.stringify(messageParams);

  config.headers['x-signature'] = generateHmac(message);
  config.headers['x-request-nonce'] = nonce;
  config.headers['x-timestamp'] = timestamp;
  config.headers['x-client-id'] = CLIENT_ID;

  return config;
});

export default axiosConfig;
