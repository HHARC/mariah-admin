import { api } from '../utils/api';
import { API_CONFIG } from '../config/api';

export const subServicesService = {
    // Get all sub-services
    getAll: async () => {
        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.SUB_SERVICES);
            return {
                success: true,
                data: response.data?.data || [],
                message: response.data?.message
            };
        } catch (error) {
            console.error('Failed to fetch sub-services:', error);
            return {
                success: false,
                data: [],
                error: error.response?.data?.message || 'Failed to fetch sub-services'
            };
        }
    },

    // Create new sub-service
    create: async (subServiceData) => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.SUB_SERVICES, subServiceData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message || 'Sub-service created successfully'
            };
        } catch (error) {
            console.error('Failed to create sub-service:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create sub-service'
            };
        }
    },

    // Update existing sub-service
    update: async (id, subServiceData) => {
        try {
            const response = await api.put(`${API_CONFIG.ENDPOINTS.SUB_SERVICES}/${id}`, subServiceData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message || 'Sub-service updated successfully'
            };
        } catch (error) {
            console.error('Failed to update sub-service:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update sub-service'
            };
        }
    },

    // Delete sub-service
    delete: async (id) => {
        try {
            const response = await api.delete(`${API_CONFIG.ENDPOINTS.SUB_SERVICES}/${id}`);
            return {
                success: true,
                message: response.data?.message || 'Sub-service deleted successfully'
            };
        } catch (error) {
            console.error('Failed to delete sub-service:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to delete sub-service'
            };
        }
    },

    // Get sub-service by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.SUB_SERVICES}/${id}`);
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message
            };
        } catch (error) {
            console.error('Failed to fetch sub-service:', error);
            return {
                success: false,
                data: null,
                error: error.response?.data?.message || 'Failed to fetch sub-service'
            };
        }
    },

    // Get sub-services by service ID
    getByServiceId: async (serviceId) => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.SUB_SERVICES}?serviceId=${serviceId}`);
            return {
                success: true,
                data: response.data?.data || [],
                message: response.data?.message
            };
        } catch (error) {
            console.error('Failed to fetch sub-services for service:', error);
            return {
                success: false,
                data: [],
                error: error.response?.data?.message || 'Failed to fetch sub-services for service'
            };
        }
    }
};