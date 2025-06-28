import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token) {
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token.trim()}`);
        }
        else if (config.headers && typeof config.headers === 'object') {
          (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token.trim()}`;
        }
        else {
          config.headers = {
            Authorization: `Bearer ${token.trim()}`,
          } as any;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
