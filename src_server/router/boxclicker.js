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

  router.post('/api/boxclicker/score', async (req, res, next) => {
    const { name, time, accuracy } = req.body;

    try {
      await boxclicker.addScore({ name, time, accuracy });
      res.sendStatus(201);
    } catch (e) {
      res.sendStatus(500);
    }
  });
};
