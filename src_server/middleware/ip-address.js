const db = require('../sql-database');

module.exports = app => {
    // d&d whitelist
    app.use((req, res, next) => {
        if (!req.url.match(/\/dnd-.*spell.+\.json$/gi) || res.locals.user) {
            return next();
        }
        const ip =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        next();
    });
};
