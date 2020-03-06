const bookmarkRouter = require('./bookmarks');
const countdownRouter = require('./countdowns');
const weddingPhotoRouter = require('./wedding-photos');

const applyRouters = router => {
    bookmarkRouter(router);
    countdownRouter(router);
    weddingPhotoRouter(router);
};

module.exports = {
    applyRouters,
};
