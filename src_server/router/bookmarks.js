const { bookmark } = require('../sql-database');

module.exports = (router) => {
  router.get('/api/bookmarks', async (req, res, next) => {
    const { user } = res.locals;
    if (!user || user.id === 0) {
      return res.sendStatus(403);
    }

    res.json({
      bookmarks: await bookmark.getBookmarksForUser(user.id),
    });
  });

  router.post('/api/bookmarks', async (req, res, next) => {
    const { user } = res.locals;
    const { name, url } = req.body;
    if (!user || user.id === 0) {
      return res.sendStatus(403);
    }
    if (typeof name === 'string' && typeof url === 'string') {
      const code = await bookmark.addOrUpdateBookmarkForUser(
        user.id,
        url,
        name
      );
      return res.sendStatus(code);
    }
    res.sendStatus(400);
  });

  router.put('/api/bookmarks/:id', async (req, res, next) => {
    const { user } = res.locals;
    const { name, url } = req.body;
    const { id } = req.params;
    if (!user || user.id === 0) {
      return res.sendStatus(403);
    }
    try {
      const result = await bookmark.updateBookmarkById(user.id, id, url, name);

      return res.sendStatus(result ? 205 : 304);
    } catch (e) {
      console.error(`Trouble when PUTting bookmark for ${user.name}`, e);
      return res.sendStatus(500);
    }
  });

  router.delete('/api/bookmarks/:id', async (req, res, next) => {
    const { user } = res.locals;
    const { id } = req.params;
    if (!user || user.id === 0) {
      return res.sendStatus(403);
    }
    try {
      const result = await bookmark.deleteBookmarkById(user.id, id);

      return res.sendStatus(result ? 205 : 304);
    } catch (e) {
      console.error(`Trouble when DELETEing bookmark for ${user.name}`, e);
      return res.sendStatus(500);
    }
  });
};
