module.exports = (router) => {
  router.get('/dev/:status', async (req, res, next) => {
    const { status } = req.params;
    try {
      const statusInt = status - 0;
      res.sendStatus(statusInt);
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

  router.get('/real-504', async () => {});
};
