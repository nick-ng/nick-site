const foreignStorageTable = 'foreign_storage';

const getByUserIdAndKey = db => (userId, key) =>
    db
        .first('value')
        .from(foreignStorageTable)
        .where({
            user_id: userId,
            key,
        });

const addOrUpdate = db => async (userId, key, value) => {
    console.log(userId, key, value);
    try {
        await db(foreignStorageTable).insert({
            user_id: userId,
            key,
            value,
        });
    } catch (e) {
        if (e.message.match(/violates unique constraint/gi)) {
            try {
                await db(foreignStorageTable)
                    .where({
                        user_id: userId,
                        key,
                    })
                    .update({
                        value,
                    });
            } catch (e) {
                console.error(`Trouble when updating foreign storage for ${userId}`, e);
                return 500;
            }
            return 205;
        }
        console.error(`Trouble when adding foreign storage for ${userId}`, e);
        return 500;
    }
    return 201;
};

const deleteByUserIdAndKey = db => (userId, key) =>
    db(foreignStorageTable)
        .where({
            user_id: userId,
            key,
        })
        .del();

const listByUserId = db => userId =>
    db
        .select(['key'])
        .from(foreignStorageTable)
        .where({
            user_id: userId,
        });

module.exports = db => ({
    getByUserIdAndKey: getByUserIdAndKey(db),
    addOrUpdate: addOrUpdate(db),
    deleteByUserIdAndKey: deleteByUserIdAndKey(db),
    listByUserId: listByUserId(db),
});
