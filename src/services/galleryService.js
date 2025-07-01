import { api } from '../utils/api';
import { API_CONFIG } from '../config/api';

export const galleryService = {
    // Get all gallery items
    getAll: async () => {
        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.GALLERY);
            return {
                success: true,
                data: response.data?.data || [],
                message: response.data?.message
            };
        } catch (error) {
            console.error('Failed to fetch gallery items:', error);
            return {
                success: false,
                data: [],
                error: error.response?.data?.message || 'Failed to fetch gallery items'
            };
        }
    },

    // Create new gallery item
    create: async (galleryData) => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.GALLERY, galleryData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message || 'Gallery item created successfully'
            };
        } catch (error) {
            console.error('Failed to create gallery item:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create gallery item'
            };
        }
    },

    // Update existing gallery item
    update: async (id, galleryData) => {
        try {
            const response = await api.put(`${API_CONFIG.ENDPOINTS.GALLERY}/${id}`, galleryData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message || 'Gallery item updated successfully'
            };
        } catch (error) {
            console.error('Failed to update gallery item:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update gallery item'
            };
        }
    },

    // Delete gallery item
    delete: async (id) => {
        try {
            const response = await api.delete(`${API_CONFIG.ENDPOINTS.GALLERY}/${id}`);
            return {
                success: true,
                message: response.data?.message || 'Gallery item deleted successfully'
            };
        } catch (error) {
            console.error('Failed to delete gallery item:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to delete gallery item'
            };
        }
    },

    // Get gallery item by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.GALLERY}/${id}`);
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message
            };
        } catch (error) {
            console.error('Failed to fetch gallery item:', error);
            return {
                success: false,
                data: null,
                error: error.response?.data?.message || 'Failed to fetch gallery item'
            };
        }
    }
};