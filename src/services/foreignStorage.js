export const getItem = async keyName => {
    return localStorage.getItem(keyName);
};

export const setItem = async (keyName, dataString) => {
    return localStorage.setItem(keyName, dataString);
};

export const removeItem = async keyName => {
    return localStorage.removeItem(keyName);
};

export const listItems = async startString => {
    return Object.keys(localStorage).filter(key => key.startsWith(startString));
};
