const { promisify } = require('util');

const WEDDING_ACCESS_KEY = 'weddingaccess';
const WEDDING_REQUEST_KEY = 'weddingrequest';
const REQUEST_TTL = 10 * 24 * 60 * 60; // 10 days
const ACCESS_TTL = 400 * 24 * 60 * 60; // 400 days

const getSafeKey = (key) => `${WEDDING_ACCESS_KEY}:${key.replace(/\//g, ':')}`;
const getSafeKeyRequest = (key) =>
  `${WEDDING_REQUEST_KEY}:${key.replace(/\//g, ':')}`;

const getAccessKey = (client) => async (key) => {
  const redisGet = promisify(client.get).bind(client);

  const safeKey = getSafeKey(key);

  const result = await redisGet(safeKey);

  return result === 'true';
};

const setAccessKey = (client) => async (key) => {
  const redisSet = promisify(client.set).bind(client);
  const redisDel = promisify(client.del).bind(client);

  const safeKey = getSafeKey(key);
  const safeKeyR = getSafeKeyRequest(key);

  await redisSet(safeKey, 'true', 'EX', ACCESS_TTL);
  await redisDel(safeKeyR);
};

const getAllRequests = (client) => async () => {
  const scan = promisify(client.scan).bind(client);
  const redisGet = promisify(client.get).bind(client);

  const allKeys = [];
  let cursor = '0';
  do {
    const res = await scan(cursor, 'MATCH', `${WEDDING_REQUEST_KEY}:*`);
    cursor = res[0];
    allKeys.push(...res[1]);
  } while (cursor !== '0');

  const allRequests = await Promise.all(
    allKeys.map(async (key) => {
      const res = await redisGet(key);
      return res;
    })
  );

  return allRequests;
};

const setRequest = (client) => async (requestData) => {
  const { key, ipAddress, message, requestTimestamp } = requestData;
  const redisSet = promisify(client.set).bind(client);

  const safeKey = getSafeKeyRequest(key);

  redisSet(
    safeKey,
    JSON.stringify({ key, ipAddress, message, requestTimestamp }),
    'EX',
    REQUEST_TTL
  );
};

module.exports = (client) => ({
  getAccessKey: getAccessKey(client),
  setAccessKey: setAccessKey(client),
  getAllRequests: getAllRequests(client),
  setRequest: setRequest(client),
});
