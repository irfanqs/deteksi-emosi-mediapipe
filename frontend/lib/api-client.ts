import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = typeof window !== 'undefined' ? '/api/backend' : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001');

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  async (config) => {
    // Get NextAuth session and add user ID to headers
    const session = await getSession();
    if (session?.user?.id) {
      config.headers['x-user-id'] = session.user.id;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Redirect to login or show auth modal
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin';
        }
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
