const { v4: uuid } = require('uuid');
const { promisify } = require('util');
const md5 = require('md5');

const SCORE_KEY = 'boxclickerscore';
const SCORE_TTL = 60 * 24 * 60 * 60; // 60 days

const shortenHistory = (history) => {
  let newHistory = [...history];
  let counter = 1;
  while (newHistory.length > 2000) {
    newHistory = history.filter((_, i) => !(i % counter));
    counter++;
  }

  return newHistory;
};

const sanitiseScore = (score) => {
  try {
    const moveHistory = JSON.parse(score.moveHistory);
    const clickHistory = JSON.parse(score.clickHistory);

    const combinedHistory = moveHistory
      .concat(clickHistory)
      .sort((a, b) => a.timestamp - b.timestamp);

    return {
      ...score,
      time:
        (combinedHistory[combinedHistory.length - 1].timestamp -
          combinedHistory[0].timestamp) /
        1000,
      accuracy: parseFloat(score.accuracy) || 1000,
      moveHistory,
      clickHistory,
      hasReplay: !!score.moveHistory && !!score.clickHistory,
      timestamp: parseInt(score.timestamp, 10) || Math.round(new Date() / 1000),
    };
  } catch (e) {
    return {};
  }
};

const summariseScore = (score) => {
  if (
    !score ||
    isNaN(score.time) ||
    isNaN(score.timestamp) ||
    score.time <= 0
  ) {
    return null;
  }
  return {
    id: score.id,
    name: score.name,
    time: score.time,
    accuracy: score.accuracy,
    hasReplay: score.hasReplay,
    timestamp: score.timestamp,
  };
};

const addScore = (client) => async ({
  name = '',
  start,
  end,
  seed,
  moveHistory,
  clickHistory,
  accuracy = 1000,
}) => {
  const hmset = promisify(client.hmset).bind(client);
  const expire = promisify(client.expire).bind(client);

  let newName = name || md5(uuid());

  if (name.length > 32 || !name) {
    newName = md5(name);
  }

  const key = `${SCORE_KEY}:${uuid()}`;

  try {
    const newMoveHistory = JSON.stringify(
      shortenHistory(JSON.parse(moveHistory))
    );
    const newClickHistory = JSON.stringify(
      shortenHistory(JSON.parse(clickHistory))
    );

    const data = {
      name,
      start,
      end,
      seed,
      moveHistory: newMoveHistory,
      clickHistory: newClickHistory,
      accuracy,
      timestamp: Math.round(new Date() / 1000),
    };

    const dataArray = Object.entries(data).reduce(
      (prev, curr) => prev.concat(curr),
      []
    );

    await hmset(key, ...dataArray);
    await expire(key, SCORE_TTL);
    return true;
  } catch (e) {
    return false;
  }
};

const deleteScore = (client) => async (id) => {
  const del = promisify(client.del).bind(client);

  const key = `${SCORE_KEY}:${id}`;

  try {
    await del(key);
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

  const allScores = await Promise.all(
    allScoreKeys.map(async (key) => {
      const res = await hgetall(key);
      return {
        id: key.replace(`${SCORE_KEY}:`, ''),
        ...res,
      };
    })
  );

  const sanitisedScores = allScores
    .map(sanitiseScore)
    .map(summariseScore)
    .filter((a) => a);

  return sanitisedScores;
};

const getScore = (client) => async (id) => {
  const hgetall = promisify(client.hgetall).bind(client);

  const key = `${SCORE_KEY}:${id}`;
  const temp = await hgetall(key);
  return sanitiseScore(temp);
};

module.exports = (client) => ({
  addScore: addScore(client),
  deleteScore: deleteScore(client),
  getAllScores: getAllScores(client),
  getScore: getScore(client),
});
