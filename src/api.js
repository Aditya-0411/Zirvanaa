import axios from 'axios';

// 🚀 CRITICAL CHANGE: Use the environment variable
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    // The BASE_URL will automatically be 'http://localhost:8000/api' in development
    // and 'https://api.zirvanaa.com/api' during the production build.
    baseURL: BASE_URL, 
});

// Interceptor to dynamically add the JWT Access token if available
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            // Ensure no Authorization header is sent if there's no token
            delete config.headers.Authorization; 
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;