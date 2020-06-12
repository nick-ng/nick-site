const { countdown } = require('../sql-database');

module.exports = router => {
    router.get('/api/countdowns', async (req, res, next) => {
        const { user } = res.locals;
        if (!user || user.id === 0) {
            return res.sendStatus(403);
        }

        res.json({
            countdowns: await countdown.getCountdownsForUser(user.id),
        });
    });

    router.post('/api/countdowns', async (req, res, next) => {
        const { user } = res.locals;
        const { name, endTime } = req.body;
        if (typeof name === 'string' && typeof endTime === 'string') {
            const code = await countdown.addOrUpdateCountdownForUser(user.id, endTime, name);
            return res.sendStatus(code);
        }
        res.sendStatus(400);
    });

    router.put('/api/countdowns/:id', async (req, res, next) => {
        const { user } = res.locals;
        const { name, endTime } = req.body;
        const { id } = req.params;
        try {
            const result = await countdown.updateCountdownById(user.id, id, endTime, name);

            return res.sendStatus(result ? 205 : 304);
        } catch (e) {
            console.error(`Trouble when PUTting countdown for ${user.name}`, e);
            return res.sendStatus(500);
        }
    });

    router.delete('/api/countdowns/:id', async (req, res, next) => {
        const { user } = res.locals;
        const { id } = req.params;
        try {
            const result = await countdown.deleteCountdownById(user.id, id);

            return res.sendStatus(result ? 205 : 304);
        } catch (e) {
            console.error(`Trouble when DELETEing countdown for ${user.name}`, e);
            return res.sendStatus(500);
        }
    });
};
