import axios from 'axios';

const authToken = localStorage.getItem('authToken');

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:4000/user', // Your backend base URL
    headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
});

// Interceptor for handling unauthorized responses
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
