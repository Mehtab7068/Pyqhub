import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add admin API key if needed
api.interceptors.request.use(
    (config) => {
        // For admin routes, add the API key (UI-entered key takes priority over env)
        if (config.url.includes('/admin/')) {
            const key = localStorage.getItem('admin_api_key') || import.meta.env.VITE_ADMIN_API_KEY;
            config.headers['x-api-key'] = key;
        }
        // Let the browser set Content-Type (with boundary) for multipart uploads
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default api;