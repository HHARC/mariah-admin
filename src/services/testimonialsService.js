import { api } from '../utils/api';
import { API_CONFIG } from '../config/api';

export const testimonialsService = {
    // Get all testimonials
    getAll: async () => {
        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.TESTIMONIALS);
            return {
                success: true,
                data: response.data?.data || [],
                message: response.data?.message
            };
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            return {
                success: false,
                data: [],
                error: error.response?.data?.message || 'Failed to fetch testimonials'
            };
        }
    },

    // Create new testimonial
    create: async (testimonialData) => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.TESTIMONIALS, testimonialData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message || 'Testimonial created successfully'
            };
        } catch (error) {
            console.error('Failed to create testimonial:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create testimonial'
            };
        }
    },

    // Update existing testimonial
    update: async (id, testimonialData) => {
        try {
            const response = await api.put(`${API_CONFIG.ENDPOINTS.TESTIMONIALS}/${id}`, testimonialData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message || 'Testimonial updated successfully'
            };
        } catch (error) {
            console.error('Failed to update testimonial:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update testimonial'
            };
        }
    },

    // Delete testimonial
    delete: async (id) => {
        try {
            const response = await api.delete(`${API_CONFIG.ENDPOINTS.TESTIMONIALS}/${id}`);
            return {
                success: true,
                message: response.data?.message || 'Testimonial deleted successfully'
            };
        } catch (error) {
            console.error('Failed to delete testimonial:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to delete testimonial'
            };
        }
    },

    // Get testimonial by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.TESTIMONIALS}/${id}`);
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message
            };
        } catch (error) {
            console.error('Failed to fetch testimonial:', error);
            return {
                success: false,
                data: null,
                error: error.response?.data?.message || 'Failed to fetch testimonial'
            };
        }
    }
};