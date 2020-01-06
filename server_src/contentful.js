const contentful = require('contentful');

const getClient = (space) => {
    return contentful.createClient({
        space,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });
}

const getPhotoList = async () => {
    const client = getClient(process.env.CONTENTFUL_WEDDING_SPACE);
    const response = await client.getAssets();
    if (response.items) {
        return response.items.map(item => {
            return {
                ...item.fields,
            }
        });
    }
    return [];
}

module.exports = {
    getPhotoList,
};
