import axios from 'axios';

const canUse = () => {
    return !!localStorage.getItem('adminKey');
};

export const getItem = async keyName => {
    if (canUse()) {
        try {
            const res = await axios.get(`/api/foreign-storage/${encodeURIComponent(keyName)}`);
            return res?.data?.value || localStorage.getItem(keyName);
        } catch (e) {
            console.error('Problem when using foreign storage', e);
        }
    }
    return localStorage.getItem(keyName);
};

export const setItem = async (keyName, dataString) => {
    if (canUse()) {
        try {
            axios.put(`/api/foreign-storage/${encodeURIComponent(keyName)}`, {
                value: dataString,
            });
        } catch (e) {
            console.error('Problem when using foreign storage', e);
        }
    }
    localStorage.setItem(keyName, dataString);
};

export const removeItem = async keyName => {
    if (canUse()) {
        try {
            axios.delete(`/api/foreign-storage/${encodeURIComponent(keyName)}`);
        } catch (e) {
            console.error('Problem when using foreign storage', e);
        }
    }
    localStorage.removeItem(keyName);
};

export const listItems = async () => {
    if (canUse()) {
        try {
            const res = await axios.get('/api/foreign-storage');
            return res?.data?.map(item => item.key);
        } catch (e) {
            console.error('Problem when using foreign storage', e);
        }
    }
    return Object.keys(localStorage);
};
