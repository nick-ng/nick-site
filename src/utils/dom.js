export const getFormData = eventTarget => {
    const keys = Object.keys(eventTarget).filter(key => key.match(/^\d+$/));
    return keys.reduce((result, key) => {
        const { name, value } = eventTarget[key];
        if (name !== '' && value !== '') {
            result[name] = value;
        }
        return result;
    }, {});
};
