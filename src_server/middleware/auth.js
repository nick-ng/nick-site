module.exports = (app) => {
    app.use((req, res, next) => {
        const adminKey = req.header('x-admin-key');
        const identities = [];
        if (process.env.NICK_ADMIN_KEY) {
            identities.push({
                user: 'Nick',
                key: process.env.NICK_ADMIN_KEY
            });
        }
        identities.forEach((identity) => {
            if (adminKey === identity.key) {
                res.locals.identity = identity.user;
            }
        });
        return next();
    });
}
