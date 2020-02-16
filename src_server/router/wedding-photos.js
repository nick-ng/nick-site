const contentful = require('../contentful');

module.exports = router => {
    router.get('/api/wedding_photos', async (req, res, next) => {
        const photos = await contentful.getPhotoList();
        res.send(photos);
    });
};
