const db = require('../sql-database');

module.exports = app => {
    app.use(async (req, res, next) => {
        const adminKey = req.header('x-admin-key');
        if (!adminKey) {
            return next();
        }

        const identities = [];
        if (process.env.NICK_ADMIN_KEY) {
            identities.push({
                username: 'Nick',
                key: process.env.NICK_ADMIN_KEY,
            });
        }

        await Promise.all(
            identities.map(async identity => {
                if (adminKey === identity.key) {
                    try {
                        const user = await db.user.getOrAddUser(
                            identity.username
                        );
                        res.locals.user = user;
                    } catch (e) {
                        console.error(
                            `Trouble when getting ${identity.username} info`,
                            e
                        );
                    }
                }
            })
        );

        if (process.env.GUEST_KEY && adminKey === process.env.GUEST_KEY) {
            res.locals.user = {
                id: 0,
                username: 'guest',
            };
        }

        return next();
    });
};
