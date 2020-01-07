const contentful = require('contentful');

const getClient = (space) => {
    return contentful.createClient({
        space,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    });
}

const getPhotoList = async () => {
    const client = getClient(process.env.CONTENTFUL_WEDDING_SPACE);
    let items = [];
    let total = 0;
    do {
        const response = await client.getAssets({
            limit: 1000,
            skip: items.length,
            mimetype_group: 'image',
        });
        if (response.items) {
            const newItems = response.items.map(item => {
                return {
                    ...item.fields,
                }
            });
            items = items.concat(newItems);
        }
        total = response.total;
    } while (total > items.length);
    return items;
}

module.exports = {
    getPhotoList,
};
