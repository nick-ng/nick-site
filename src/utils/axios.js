import axios from 'axios';

// Add adminKey to request
axios.interceptors.request.use(config => {
    const adminKey = localStorage.getItem('adminKey');
    if (adminKey) {
        const headers = {
            ...config.headers,
            'x-admin-key': adminKey,
        };

        return {
            ...config,
            headers,
        };
    }
    return config;
});
