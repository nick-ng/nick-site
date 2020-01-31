const authMiddleware = require('./auth');
const redirectMiddleware = require('./redirect');

const applyMiddlewares = app => {
    authMiddleware(app);
    redirectMiddleware(app);
};

module.exports = {
    applyMiddlewares,
};
