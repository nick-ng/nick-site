const { v4: uuid } = require('uuid');
const { promisify } = require('util');
const md5 = require('md5');

const SCORE_KEY = 'boxclickerscore';
const SCORE_TTL = 60 * 24 * 60 * 60; // 60 days

const addScore = (client) => async ({
  name = '',
  time = 1000,
  accuracy = 1000,
}) => {
  const hmset = promisify(client.hmset).bind(client);
  const expire = promisify(client.expire).bind(client);

  let newName = name || md5(uuid());

  if (name.length > 32) {
    newName = md5(name);
  }

  const key = `${SCORE_KEY}:${uuid()}`;

  try {
    await hmset(
      key,
      'name',
      newName,
      'time',
      time,
      'accuracy',
      accuracy,
      'timestamp',
      Math.round(new Date() / 1000)
    );
    await expire(key, SCORE_TTL);
    return true;
  } catch (e) {
    return false;
  }
};

const getAllScores = (client) => async () => {
  const scan = promisify(client.scan).bind(client);
  const hgetall = promisify(client.hgetall).bind(client);

  const allScoreKeys = [];
  let cursor = '0';
  do {
    const res = await scan(cursor, 'MATCH', `${SCORE_KEY}:*`);
    cursor = res[0];
    allScoreKeys.push(...res[1]);
  } while (cursor !== '0');

  const allScores = await Promise.all(allScoreKeys.map((key) => hgetall(key)));

  const sanitisedScores = allScores
    .map((score) => {
      try {
        const temp = {
          name: score.name,
          time: parseFloat(score.time) || 1000,
          accuracy: parseFloat(score.accuracy) || 1000,
          timestamp:
            parseInt(score.timestamp, 10) || Math.round(new Date() / 1000),
        };

        if (
          isNaN(temp.name) ||
          isNaN(temp.time) ||
          isNaN(temp.timestamp) ||
          temp.time <= 0
        ) {
          return null;
        }

        return temp;
      } catch (e) {
        return null;
      }
    })
    .filter((a) => a);

  return sanitisedScores;
};

module.exports = (client) => ({
  addScore: addScore(client),
  getAllScores: getAllScores(client),
});
