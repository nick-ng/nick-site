const knex = require('knex');

const bookmark = require('./bookmark');
const countdown = require('./countdown');
const foreignStorage = require('./foreign-storage');
const markdownDocument = require('./markdown-document');
const user = require('./user');
const weddingAlbumTag = require('./wedding-album-tag');

const options = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  searchPath: ['knex', 'public'],
};

const db = knex(options);

module.exports = {
  bookmark: bookmark(db),
  countdown: countdown(db),
  foreignStorage: foreignStorage(db),
  markdownDocument: markdownDocument(db),
  user: user(db),
  weddingAlbumTag: weddingAlbumTag(db),
};
