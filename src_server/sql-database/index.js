const knex = require('knex');

const bookmark = require('./bookmark');
const countdown = require('./countdown');
const foreignStorage = require('./foreign-storage');
const user = require('./user');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  searchPath: ['knex', 'public'],
});

module.exports = {
  bookmark: bookmark(db),
  countdown: countdown(db),
  foreignStorage: foreignStorage(db),
  user: user(db),
};
