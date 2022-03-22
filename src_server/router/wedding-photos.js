const { randomBytes } = require('crypto');

const { wedding } = require('../key-value-database');
const { weddingAlbumTag } = require('../sql-database');

const contentful = require('../contentful');

const hasValidWeddingAlbumKey = async (key) => {
  if (!key) {
    return false;
  }

  return wedding.getAccessKey(key);
};

module.exports = (router) => {
  router.get('/api/wedding_photos', async (req, res, next) => {
    const { user } = res.locals;
    if (
      !user &&
      !(await hasValidWeddingAlbumKey(req.header('x-wedding-album-key')))
    ) {
      res.status(401);
      res.send([]);
      return;
    }

    const [photos, photoTags] = await Promise.all([
      contentful.getPhotoList(),
      weddingAlbumTag.getAllTagsOnPhotos(),
    ]);
    res.send({ photos, photoTags });
  });

  router.post('/api/wedding_photo_access', async (req, res, next) => {
    let key = '';
    while (key.length < 32) {
      const keyPart = randomBytes(32 - key.length)
        .toString('ascii')
        .replaceAll(/[^a-z0-9]/gi, '');
      key = `${key}${keyPart}`;
    }

    const ipAddress =
      req.header('x-forwarded-for') || req.connection.remoteAddress;
    const { message } = req.body;

    const cleanMessage = message?.replaceAll(/[^a-z0-9]/gi, ' ');
    const requestTimestamp = Date.now();

    // store new uuid, ip address and clean message in redis for 10 days
    wedding.setRequest({
      message: cleanMessage,
      key,
      ipAddress,
      requestTimestamp,
    });

    res.json({
      key,
    });
  });

  router.get('/api/wedding_photo_access', async (req, res, next) => {
    const { user } = res.locals;
    if (!user || user.id === 0) {
      res.sendStatus(403);
      return;
    }

    res.json(await wedding.getAllRequests());
  });

  router.post('/api/wedding_photo_access/:key', async (req, res, next) => {
    const { user } = res.locals;
    if (!user || user.id === 0) {
      res.sendStatus(403);
      return;
    }

    const { key } = req.params;
    const { grantAccess } = req.body;

    if (grantAccess === 'yes') {
      wedding.setAccessKey(key);
    }

    res.sendStatus(201);
  });

  router.post('/api/wedding_album_tag', async (req, res, next) => {
    const { user } = res.locals;
    if (!user || user.id === 0) {
      res.sendStatus(401);
      return;
    }

    const { displayName, sortOrder, description } = req.body;

    try {
      await weddingAlbumTag.createTag({ displayName, sortOrder, description });
      res.sendStatus(201);
    } catch (e) {
      console.error(e.message);
      res.sendStatus(400);
    }
  });

  router.get('/api/wedding_album_tags', async (req, res, next) => {
    const { user } = res.locals;
    console.log('user', user);
    if (!user || user.id === 0) {
      res.sendStatus(401);
      return;
    }

    try {
      const a = await weddingAlbumTag.getAllTags();
      console.log('a', a);

      res.json(a);
    } catch (e) {
      console.error(e.message);
      res.sendStatus(500);
    }
  });
};
