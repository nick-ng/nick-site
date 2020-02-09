module.exports = db => ({
    getBookmarksForUser: user => {
        return db
            .from('user')
			.innerJoin('bookmark', 'user.id', 'bookmark.user_id')
			.where('user.username', user);
    },
});
