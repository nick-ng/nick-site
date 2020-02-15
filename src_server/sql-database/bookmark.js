const bookmarkTable = 'bookmark';
const bookmarkColumns = ['id', 'user_id', 'uri', 'name'];

const getBookmarksForUser = db => userId => {
    return db
        .select(bookmarkColumns)
        .from(bookmarkTable)
        .where('user_id', userId);
};

module.exports = db => ({
    getBookmarksForUser: getBookmarksForUser(db),
});
