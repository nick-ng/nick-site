const { markdownDocument } = require('../sql-database');

module.exports = (router) => {
  router.get('/api/markdown-document', async (_req, res, _next) => {
    const { user } = res.locals;
    if (!user || user.id === 0) {
      res.sendStatus(403);
      return;
    }

    try {
      res.json(await markdownDocument.getDocumentsForUser(user.id));
    } catch (e) {
      res.sendStatus(400);
    }
  });

  router.get('/api/markdown-document/id/:id', async (req, res, _next) => {
    const { user } = res.locals;
    if (!user || user.id === 0) {
      res.sendStatus(403);
      return;
    }

    const { id } = req.params;

    try {
      res.json(await markdownDocument.getDocumentByIdForUser(user.id, id));
    } catch (e) {
      res.sendStatus(400);
    }
  });

  router.post('/api/markdown-document', async (req, res, _next) => {
    const { user } = res.locals;
    if (!user || user.id === 0) {
      res.sendStatus(403);
      return;
    }

    try {
      const rowId = await markdownDocument.addDocumentForUser(
        user.id,
        req.body
      );
      res.json(rowId[0]);
    } catch (e) {
      res.status(500).send(e);
    }
  });

  router.put('/api/markdown-document/id/:id', async (req, res, _next) => {
    const { user } = res.locals;
    if (!user || user.id === 0) {
      res.sendStatus(403);
      return;
    }

    const { id } = req.params;

    try {
      await markdownDocument.updateDocumentById(id, user.id, req.body);
      res.sendStatus(202);
    } catch (e) {
      res.status(500).send(e);
    }
  });
};
