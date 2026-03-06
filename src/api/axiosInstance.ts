import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://api.yourdomain.com', // your API
  timeout: 10000,
});

// Attach token automatically
axiosInstance.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log('API ERROR', error.response.data);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
