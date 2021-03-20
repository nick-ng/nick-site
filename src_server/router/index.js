const bookmarkRouter = require('./bookmarks');
const boxclickerRouter = require('./boxclicker');
const countdownRouter = require('./countdowns');
const dev = require('./dev');
const foreignStorageRouter = require('./foreign-storage');
const markdownDocumentRouter = require('./markdown-document');
const rubiksCubeRouter = require('./rubiks-cube');
const weddingPhotoRouter = require('./wedding-photos');

const applyRouters = (router) => {
  bookmarkRouter(router);
  boxclickerRouter(router);
  countdownRouter(router);
  dev(router);
  foreignStorageRouter(router);
  markdownDocumentRouter(router);
  rubiksCubeRouter(router);
  weddingPhotoRouter(router);
};

module.exports = {
  applyRouters,
};
