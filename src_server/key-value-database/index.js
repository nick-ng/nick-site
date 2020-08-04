const redis = require('redis');

const boxclicker = require('./boxclicker');

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

module.exports = {
  boxclicker: boxclicker(client),
};
