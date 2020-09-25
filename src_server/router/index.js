const bookmarkRouter = require('./bookmarks');
const boxclickerRouter = require('./boxclicker');
const countdownRouter = require('./countdowns');
const foreignStorageRouter = require('./foreign-storage');
const rubiksCubeRouter = require('./rubiks-cube');
const weddingPhotoRouter = require('./wedding-photos');
const workRouter = require('./work');

const applyRouters = (router) => {
  bookmarkRouter(router);
  boxclickerRouter(router);
  countdownRouter(router);
  foreignStorageRouter(router);
  rubiksCubeRouter(router);
  weddingPhotoRouter(router);
  workRouter(router);
};

module.exports = {
  applyRouters,
};
