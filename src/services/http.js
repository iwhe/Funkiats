import axios from "axios";
import { getAuthHeader, logout } from './authToken';

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});

// Add token to requests
http.interceptors.request.use(
  (config) => {
    // if (isTokenExpired()) {
    //   // logout();
    //   return Promise.reject(new Error('Token expired'));
    // }

    const authHeader = getAuthHeader();
    if (authHeader.Authorization) {
      config.headers.Authorization = authHeader.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
// http.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       logout();
//     }
//     return Promise.reject(error);
//   }
// );

// export default http;
