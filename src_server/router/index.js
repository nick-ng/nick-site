const bookmarkRouter = require('./bookmarks');
const weddingPhotoRouter = require('./wedding-photos');

const applyRouters = router => {
    bookmarkRouter(router);
    weddingPhotoRouter(router);
};

module.exports = {
    applyRouters,
};
