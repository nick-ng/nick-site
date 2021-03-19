const knex = require('knex');

const bookmark = require('./bookmark');
const countdown = require('./countdown');
const foreignStorage = require('./foreign-storage');
const user = require('./user');

const ssl = {
  require: true,
  rejectUnauthorized: false,
};

const options = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  searchPath: ['knex', 'public'],
};

if (process.env.NODE_ENV !== 'development') {
  options.connection.ssl = ssl;
}

const db = knex(options);

module.exports = {
  bookmark: bookmark(db),
  countdown: countdown(db),
  foreignStorage: foreignStorage(db),
  user: user(db),
};
