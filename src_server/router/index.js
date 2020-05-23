const bookmarkRouter = require('./bookmarks');
const countdownRouter = require('./countdowns');
const rubiksCubeRouter = require('./rubiks-cube');
const todoRouter = require('./todos');
const weddingPhotoRouter = require('./wedding-photos');

const applyRouters = router => {
    bookmarkRouter(router);
    countdownRouter(router);
    rubiksCubeRouter(router);
    todoRouter(router);
    weddingPhotoRouter(router);
};

module.exports = {
    applyRouters,
};
