import { api } from '../utils/api';
import { API_CONFIG } from '../config/api';

export const authService = {
    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, credentials, { 
                withCredentials: true 
            });
            return {
                success: true,
                data: response.data,
                status: response.data.status,
                message: response.data.message
            };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed',
                status: error.response?.status || 500
            };
        }
    },

    // Refresh authentication token
    refreshToken: async () => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.REFRESH_TOKEN);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Token refresh failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Token refresh failed'
            };
        }
    },

    // Logout user (clear local storage)
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authUser');
        window.location.href = '/login';
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('accessToken');
        const user = localStorage.getItem('authUser');
        return !!(token && user);
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('authUser');
        return user ? JSON.parse(user) : null;
    }
};