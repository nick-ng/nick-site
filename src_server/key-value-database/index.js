const redis = require('redis');
const { cli } = require('webpack');

const boxclicker = require('./boxclicker');
const cache = require('./cache');
const wedding = require('./wedding');

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

module.exports = {
  boxclicker: boxclicker(client),
  cache: cache(client),
  wedding: wedding(client),
};
