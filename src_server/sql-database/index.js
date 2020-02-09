const knex = require('knex');

const bookmark = require('./bookmark');

const db = knex({
    client: 'pg',
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    searchPath: ['knex', 'public'],
});

module.exports = {
    bookmark: bookmark(db),
};
