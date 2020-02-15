const userTable = 'user';
const userTableColumns = ['id', 'username'];

const getUserByUsername = db => username => {
    return db
        .select(userTableColumns)
        .from(userTable)
        .where('username', username).first();
};
const addUserByUsername = db => username => {
    return db(userTable)
        .insert({
            username,
        })
        .returning(userTableColumns);
};

const getOrAddUser = db => username => {
    return db.transaction(async trx => {
        try {
            const user = await getUserByUsername(trx)(username);
            console.log('username', username);
            console.log('user', user);
            return user || (await addUserByUsername(trx)(username));
        } catch (e) {
            console.error('Trouble in getOrAddUser', e);
        }
    });
};

module.exports = db => ({
    getUserByUsername: getUserByUsername(db),
    addUserByUsername: addUserByUsername(db),
    getOrAddUser: getOrAddUser(db),
});
