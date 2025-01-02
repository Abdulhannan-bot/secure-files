import axios from 'axios';
import { API_URL } from '../utils/config';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const csrfToken = Cookies.get('csrftoken');

        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.post(
                    `${API_URL}/token/refresh/`,
                    {},
                    { withCredentials: true }
                );
                return api(originalRequest);
            } catch (err) {
                console.error('Failed to refresh token:', err);

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
