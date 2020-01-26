import axios from 'axios';

// Add adminKey to request
axios.interceptors.request.use((config) => {
    const adminKey = localStorage.getItem('adminKey');
    if (adminKey) {
        const headers = Object.assign(
            config.headers,
            {
                'x-admin-key': adminKey
            }
        );

        return Object.assign(config, {
            headers,
        });
    }
    return config;
});
