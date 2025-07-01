// API Configuration
export const API_CONFIG = {
    BASE_URL: "https://mariah-universe-backend.vercel.app/",
    ENDPOINTS: {
        // Authentication
        LOGIN: "api/auth/login",
        REFRESH_TOKEN: "api/auth/refresh-token",
        
        // Content Management
        SERVICES: "api/services",
        SUB_SERVICES: "api/sub-services", 
        TESTIMONIALS: "api/testimonials",
        GALLERY: "api/gallery",
        
        // Media
        UPLOAD: "api/upload"
    }
};

// Response format expected from the backend
export const RESPONSE_FORMAT = {
    SUCCESS: {
        status: 200,
        data: null,
        message: ""
    },
    ERROR: {
        status: 400,
        error: "",
        message: ""
    }
};