import axios from 'axios';
import { Format, SocialMedia, VisionButton } from '../types';

const API_BASE_URL = 'https://mariah-universe-backend.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Formats API
export const formatsAPI = {
  getAll: () => api.get<Format[]>('/formats'),
  getById: (id: string) => api.get<Format>(`/formats/${id}`),
  create: (data: Omit<Format, 'id'>) => api.post<Format>('/formats', data),
  update: (id: string, data: Partial<Format>) => api.put<Format>(`/formats/${id}`, data),
  delete: (id: string) => api.delete(`/formats/${id}`),
};

// Social Media API
export const socialAPI = {
  getAll: () => api.get<SocialMedia[]>('/social'),
  getById: (id: string) => api.get<SocialMedia>(`/social/${id}`),
  create: (data: Omit<SocialMedia, '_id'>) => api.post<SocialMedia>('/social', data),
  update: (id: string, data: Partial<SocialMedia>) => api.put<SocialMedia>(`/social/${id}`, data),
  delete: (id: string) => api.delete(`/social/${id}`),
};

// Vision Buttons API
export const visionAPI = {
  getAll: () => api.get<VisionButton[]>('/vision'),
  getById: (id: string) => api.get<VisionButton>(`/vision/${id}`),
  create: (data: Omit<VisionButton, '_id'>) => api.post<VisionButton>('/vision', data),
  update: (id: string, data: Partial<VisionButton>) => api.put<VisionButton>(`/vision/${id}`, data),
  delete: (id: string) => api.delete(`/vision/${id}`),
};

// Image Upload API
export const uploadAPI = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

export default api;