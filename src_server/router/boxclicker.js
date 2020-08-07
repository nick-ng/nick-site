const { boxclicker } = require('../key-value-database');

module.exports = (router) => {
  router.get('/api/boxclicker/scores', async (req, res, next) => {
    try {
      res.json({
        allScores: await boxclicker.getAllScores(),
      });
    } catch (e) {
      res.sendStatus(500);
    }
  });

  router.get('/api/boxclicker/score/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
      res.json(await boxclicker.getScore(id));
    } catch (e) {
      res.sendStatus(500);
    }
  });

  router.post('/api/boxclicker/score', async (req, res, next) => {
    const {
      name,
      time,
      start,
      end,
      seed,
      moveHistory,
      clickHistory,
      accuracy,
    } = req.body;

    try {
      await boxclicker.addScore({
        name,
        time,
        start,
        end,
        seed,
        moveHistory,
        clickHistory,
        accuracy,
      });
      res.sendStatus(201);
    } catch (e) {
      res.sendStatus(500);
    }
  });

  router.delete('/api/boxclicker/score/:id', async (req, res, next) => {
    const { user } = res.locals;
    const { id } = req.params;

    if (!user || user.id === 0) {
      return res.sendStatus(403);
    }

    try {
      await boxclicker.deleteScore(id);

      return res.sendStatus(205);
    } catch (e) {
      return res.sendStatus(500);
    }
  });
};
