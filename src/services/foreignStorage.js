import axios from 'axios';
import chunk from 'lodash/chunk';
import uniqBy from 'lodash/uniqBy';

export const HTTP_LIMIT = 90000;

const canUse = () => {
    return !!localStorage.getItem('adminKey');
};

export const listAllItems = async () => {
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

export const getArray = async (keyName, idKey = 'id') => {
    if (canUse()) {
        const [firstChunkString, itemList] = await Promise.all([getItem(keyName), listAllItems()]);

        const firstChunk = JSON.parse(firstChunkString || '[]');

        const otherChunks = await Promise.all(
            itemList.filter(key => key.startsWith(`${keyName}***`)).map(key => getItem(key))
        );

        const fullArray = otherChunks.reduce((prev, curr) => {
            return prev.concat(JSON.parse(curr || '[]'));
        }, firstChunk);

        if (fullArray.length > 0 && fullArray[0][idKey]) {
            return uniqBy(fullArray, idKey);
        }

        return fullArray;
    }
    return JSON.parse(localStorage.getItem(keyName));
};

export const setItem = async (keyName, dataString) => {
    if (canUse()) {
        try {
            await axios.put(`/api/foreign-storage/${encodeURIComponent(keyName)}`, {
                value: dataString,
            });
            return;
        } catch (e) {
            console.error('Problem when using foreign storage', e);
        }
    }
    localStorage.setItem(keyName, dataString);
};

export const setArray = async (keyName, dataArray, chunkSize = 500) => {
    if (canUse()) {
        const chunkedArray = chunk(dataArray, chunkSize);

        const firstChunk = chunkedArray.shift();

        await Promise.all([
            setItem(keyName, JSON.stringify(firstChunk)),
            ...chunkedArray.map((tempArray, i) =>
                setItem(`${keyName}***${i}`, JSON.stringify(tempArray))
            ),
        ]);

        return;
    }
    return localStorage.setItem(keyName, JSON.stringify(dataArray));
};

export const removeItem = async keyName => {
    if (canUse()) {
        try {
            axios.delete(`/api/foreign-storage/${encodeURIComponent(keyName)}`);
            return;
        } catch (e) {
            console.error('Problem when using foreign storage', e);
        }
    }
    localStorage.removeItem(keyName);
};

export const listItems = async () => {
    return (await listAllItems()).filter(key => !key.includes('***'));
};
