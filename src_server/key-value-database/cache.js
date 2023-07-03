const { promisify } = require('util');

const CACHE_KEY = 'cache';
const CACHE_TTL = 60 * 10; // 10 minutes

/**
 * @param {string} key
 *
 * @returns {string}
 */
const getSafeKey = (key) => `${CACHE_KEY}${key.replace(/\//g, ':')}`;

const get = (client) => async (key, getter) => {
  const redisSet = promisify(client.set).bind(client);
  const redisGet = promisify(client.get).bind(client);

  const safeKey = getSafeKey(key);

  const fromCache = await redisGet(safeKey);
  if (fromCache) {
    return JSON.parse(fromCache).item;
  }

  const item = await getter();
  const forCache = JSON.stringify({ item });

  redisSet(safeKey, forCache, 'EX', CACHE_TTL);

  return item;
};

const delAll = (client) => async () => {
  const redisDel = promisify(client.del).bind(client);
  const redisScan = promisify(client.scan).bind(client);

  const allCacheKeys = [];
  let cursor = '0';
  do {
    const res = await redisScan(cursor, 'MATCH', `${CACHE_KEY}:*`);
    cursor = res[0];
    allCacheKeys.push(...res[1]);
  } while (cursor !== '0');

  allCacheKeys.forEach((key) => {
    redisDel(key);
  });
};

module.exports = (client) => ({
  get: get(client),
  delAll: delAll(client),
});
