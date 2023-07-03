const redis = require('redis');
const { promisify } = require('util');

const { getSafeKey } = require('./utils');
const boxclicker = require('./boxclicker');
const cache = require('./cache');
const wedding = require('./wedding');

const EDITOR_KEY = 'editor';
const EDITOR_TTL_SECONDS = 60 * 1; // 1 minutes

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

module.exports = {
  boxclicker: boxclicker(client),
  cache: cache(client),
  wedding: wedding(client),
  editor: {
    /**
     * @param {string} documentId
     * @param {string} browserId
     *
     * @returns {Promise<void>}
     */
    set: async (documentId, browserId) => {
      const redisSet = promisify(client.set).bind(client);

      return redisSet(
        getSafeKey(`${EDITOR_KEY}:${documentId}:${browserId}`),
        browserId,
        'EX',
        EDITOR_TTL_SECONDS
      );
    },
    /**
     * @param {string} documentId
     *
     * @returns {Promise<string[]>}
     */
    find: async (documentId) => {
      const redisScan = promisify(client.scan).bind(client);

      const allCacheKeys = [];
      let cursor = '0';
      do {
        const res = await redisScan(
          cursor,
          'MATCH',
          `${getSafeKey(`${EDITOR_KEY}:${documentId}`)}:*`
        );
        cursor = res[0];
        allCacheKeys.push(...res[1]);
      } while (cursor !== '0');

      return allCacheKeys;
    },
  },
};
