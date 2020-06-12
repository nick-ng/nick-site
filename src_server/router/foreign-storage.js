const { foreignStorage } = require('../sql-database');

module.exports = router => {
    router.get('/api/foreign-storage', async (req, res, next) => {
        const { user } = res.locals;
        if (!user || user.id === 0) {
            res.sendStatus(403);
            return;
        }

        res.json(await foreignStorage.listByUserId(user.id));
    });

    router.get('/api/foreign-storage/:key', async (req, res, next) => {
        const { user } = res.locals;
        if (!user || user.id === 0) {
            res.sendStatus(403);
            return;
        }

        const { key } = req.params;

        res.json(await foreignStorage.getByUserIdAndKey(user.id, key));
    });

    router.put('/api/foreign-storage/:key', async (req, res, next) => {
        const { user } = res.locals;
        if (!user || user.id === 0) {
            return res.sendStatus(403);
        }

        const { key } = req.params;
        const { value } = req.body;

        res.sendStatus(await foreignStorage.addOrUpdate(user.id, key, value));
    });

    router.delete('/api/foreign-storage/:key', async (req, res, next) => {
        const { user } = res.locals;
        if (!user || user.id === 0) {
            res.sendStatus(403);
            return;
        }

        const { key } = req.params;

        try {
            const result = await foreignStorage.deleteByUserIdAndKey(user.id, key);

            res.sendStatus(result ? 205 : 304);
        } catch (e) {
            console.error(`Trouble when DELETEing foreign storage for ${user.name}`, e);
            res.sendStatus(500);
        }
    });
};
