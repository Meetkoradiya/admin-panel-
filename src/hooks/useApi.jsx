import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from "@/redux/slice/AuthSlice";
import { useMemo } from 'react';
import { store } from '../redux/Store';

const useApi = () => {
    const dispatch = useDispatch();
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const apiClient = useMemo(() => {
        const client = axios.create({
            baseURL: BASE_URL,
        });

        client.interceptors.request.use((config) => {
            const state = store.getState();
            const currentToken = state.auth?.token;

            if (currentToken) {
                config.headers.Authorization = `Bearer ${currentToken}`;
            } else {
                console.warn("API Request made without token (from store):", config.url);
            }
            return config;
        }, (error) => Promise.reject(error));

        client.interceptors.response.use(
            (response) => {
                // For blob responses (images/files), return the blob data directly
                if (response.config?.responseType === 'blob') {
                    return response.data;
                }
                // For JSON responses, return just the data object for easier consumption
                return response.data;
            },
            (error) => {
                const isSilent = error.config?.silent === true;
                const status = error.response?.status;
                const hasToken = !!error.config?.headers?.Authorization;

                if (status === 401) {
                    if (!isSilent) {
                        console.warn(`401 Unauthorized: ${error.config.url}`);
                        // dispatch(logout()); // Commented out to prevent login loop during debugging
                    }
                } else if (status === 403) {
                    if (!isSilent) {
                        console.error(`Status 403 (Forbidden): ${error.config.url}`);
                        console.warn("User role has insufficient permissions for this resource.");
                    }
                }
                return Promise.reject(error);
            }
        );

        return client;
    }, [BASE_URL]);

    // Expose standard axios methods wrapped to use our instance
    return useMemo(() => ({
        apiGet: (url, config = {}) => apiClient.get(url, config),
        apiPost: (url, data = {}, config = {}) => apiClient.post(url, data, config),
        apiPut: (url, data = {}, config = {}) => apiClient.put(url, data, config),
        apiDelete: (url, config = {}) => apiClient.delete(url, config),
        apiClient
    }), [apiClient]);
};

export default useApi;


