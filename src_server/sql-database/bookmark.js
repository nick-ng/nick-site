const bookmarkTable = 'bookmark';
const bookmarkColumns = ['id', 'user_id', 'url', 'name'];

const getBookmarksForUser = db => userId => {
    return db
        .select(['id', 'url', 'name'])
        .from(bookmarkTable)
        .where('user_id', userId);
};

const addBookmarkForUser = db => (userId, url, name) =>
    db(bookmarkTable).insert({
        user_id: userId,
        url,
        name,
    });

const updateBookmarkForUser = db => (userId, url, name) =>
    db(bookmarkTable)
        .where({
            user_id: userId,
            url,
        })
        .update({
            name,
        });

const updateBookmarkById = db => (userId, id, url, name) => {
    const updatedBookmark = {};
    let bookmarkChanged = false;
    if (typeof name !== 'undefined') {
        updatedBookmark.name = name;
        bookmarkChanged = true;
    }
    if (typeof url !== 'undefined') {
        updatedBookmark.url = url;
        bookmarkChanged = true;
    }

    return (
        bookmarkChanged &&
        db(bookmarkTable)
            .where({
                user_id: userId,
                id,
            })
            .update(updatedBookmark)
    );
};

const deleteBookmarkById = db => (userId, id) => {
    return db(bookmarkTable)
        .where({
            user_id: userId,
            id,
        })
        .del();
};

const addOrUpdateBookmarkForUser = db => async (userId, url, name) => {
    try {
        await addBookmarkForUser(db)(userId, url, name);
    } catch (e) {
        if (e.message.match(/violates unique constraint "bookmark_/gi)) {
            try {
                await updateBookmarkForUser(db)(userId, url, name);
            } catch (e) {
                console.error(`Trouble when updating bookmark for ${userId}`, e);
                return 500;
            }
            return 205;
        }
        console.error(`Trouble when adding bookmark for ${userId}`, e);
        return 500;
    }
    return 201;
};

module.exports = db => ({
    addOrUpdateBookmarkForUser: addOrUpdateBookmarkForUser(db),
    deleteBookmarkById: deleteBookmarkById(db),
    getBookmarksForUser: getBookmarksForUser(db),
    updateBookmarkById: updateBookmarkById(db),
});
