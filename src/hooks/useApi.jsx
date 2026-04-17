import axios from 'axios';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const useApi = () => {
    const token = useSelector((state) => state.auth.token);
    const BASE_URL = import.meta.env.VITE_BACKEND_BASEURL;

    const apiClient = useMemo(() => {
        const client = axios.create({
            baseURL: BASE_URL,
        });

        client.interceptors.request.use((config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => Promise.reject(error));

        client.interceptors.response.use(
            (response) => {
                // Return just the data object for easier component consumption
                return response.data;
            },
            (error) => Promise.reject(error)
        );

        return client;
    }, [BASE_URL, token]);

    // Expose standard axios methods wrapped to use our instance
    const apiGet = (url, config = {}) => apiClient.get(url, config);
    const apiPost = (url, data = {}, config = {}) => apiClient.post(url, data, config);
    const apiPut = (url, data = {}, config = {}) => apiClient.put(url, data, config);
    const apiDelete = (url, config = {}) => apiClient.delete(url, config);

    return { apiGet, apiPost, apiPut, apiDelete, apiClient };
};

export default useApi;
