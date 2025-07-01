import { api } from '../utils/api';
import { API_CONFIG } from '../config/api';

export const servicesService = {
    // Get all services
    getAll: async () => {
        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.SERVICES);
            return {
                success: true,
                data: response.data?.data || [],
                message: response.data?.message
            };
        } catch (error) {
            console.error('Failed to fetch services:', error);
            return {
                success: false,
                data: [],
                error: error.response?.data?.message || 'Failed to fetch services'
            };
        }
    },

    // Create new service
    create: async (serviceData) => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.SERVICES, serviceData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message || 'Service created successfully'
            };
        } catch (error) {
            console.error('Failed to create service:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create service'
            };
        }
    },

    // Update existing service
    update: async (id, serviceData) => {
        try {
            const response = await api.put(`${API_CONFIG.ENDPOINTS.SERVICES}/${id}`, serviceData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message || 'Service updated successfully'
            };
        } catch (error) {
            console.error('Failed to update service:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update service'
            };
        }
    },

    // Delete service
    delete: async (id) => {
        try {
            const response = await api.delete(`${API_CONFIG.ENDPOINTS.SERVICES}/${id}`);
            return {
                success: true,
                message: response.data?.message || 'Service deleted successfully'
            };
        } catch (error) {
            console.error('Failed to delete service:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to delete service'
            };
        }
    },

    // Get service by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.SERVICES}/${id}`);
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message
            };
        } catch (error) {
            console.error('Failed to fetch service:', error);
            return {
                success: false,
                data: null,
                error: error.response?.data?.message || 'Failed to fetch service'
            };
        }
    }
};