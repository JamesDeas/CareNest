import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api'
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request config:', {
            url: config.url,
            headers: config.headers,
            method: config.method
        });
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message,
            error: error.response?.data?.error,
            stack: error.response?.data?.stack
        });
        return Promise.reject(error);
    }
);

export default api; 