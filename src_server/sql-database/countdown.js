const countdownTable = 'countdown';

const getCountdownsForUser = db => userId => {
    return db
        .select(['id', 'end_time as endTime', 'name'])
        .from(countdownTable)
        .where('user_id', userId);
};

const addCountdownForUser = db => (userId, endTime, name) =>
    db(countdownTable).insert({
        user_id: userId,
        end_time: endTime,
        name,
    });

const updateCountdownForUser = db => (userId, endTime, name) =>
    db(countdownTable)
        .where({
            user_id: userId,
            end_time: endTime,
        })
        .update({
            name,
        });

const updateCountdownById = db => (userId, id, endTime, name) => {
    const updatedCountdown = {};
    let countdownChanged = false;
    if (typeof name !== 'undefined') {
        updatedCountdown.name = name;
        countdownChanged = true;
    }
    if (typeof endTime !== 'undefined') {
        updatedCountdown.end_time = endTime;
        countdownChanged = true;
    }

    return (
        countdownChanged &&
        db(countdownTable)
            .where({
                user_id: userId,
                id,
            })
            .update(updatedCountdown)
    );
};

const deleteCountdownById = db => (userId, id) => {
    return db(countdownTable)
        .where({
            user_id: userId,
            id,
        })
        .del();
};

const addOrUpdateCountdownForUser = db => async (userId, url, name) => {
    try {
        await addCountdownForUser(db)(userId, url, name);
    } catch (e) {
        if (e.message.match(/violates unique constraint "countdown_/gi)) {
            try {
                await updateCountdownForUser(db)(userId, url, name);
            } catch (e) {
                console.error(`Trouble when updating countdown for ${userId}`, e);
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
    addOrUpdateCountdownForUser: addOrUpdateCountdownForUser(db),
    deleteCountdownById: deleteCountdownById(db),
    getCountdownsForUser: getCountdownsForUser(db),
    updateCountdownById: updateCountdownById(db),
});
