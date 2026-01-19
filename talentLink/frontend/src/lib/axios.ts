import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2020/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling 401 errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        // If refresh successful, retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Silent failure for refresh - don't log technical details
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
