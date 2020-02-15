const sql = require('../sql-database');

module.exports = router => {
    router.get('/api/bookmarks', async (req, res, next) => {
        const { user } = res.locals;
        if (!user) {
            return res.sendStatus(403);
        }

        res.json({
            bookmarks: await sql.bookmark.getBookmarksForUser(user.id),
        });
    });

    router.post('/api/bookmarks', async (req, res, next) => {});
};
