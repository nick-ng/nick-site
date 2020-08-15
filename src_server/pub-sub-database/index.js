const redis = require('redis');

const boxclicker = require('./boxclicker');

const publisher = redis.createClient({
  url: process.env.REDIS_URL,
});
const subscriber = publisher.duplicate();

module.exports = {
  boxclicker: boxclicker(publisher, subscriber),
};
