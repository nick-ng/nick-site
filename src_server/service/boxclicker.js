const { v4: uuid } = require('uuid');

const { boxclicker: boxclickerPubSub } = require('../pub-sub-database');

const GAME_STATES = {
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
  POSTGAME: 'POSTGAME',
};

const PLAYER_STATES = {
  STANDBY: 'STANDBY',
  READY: 'READY',
};

const boxclickerGames = {};
let gameTicking = false;

boxclickerPubSub.subscriber.on('message', (channel, message) => {
  const matchingConnections = connectionData.connections.filter(
    (connection) => connection.channel === channel
  );

  matchingConnections.forEach((connection) => {
    if (typeof connection.callback === 'function') {
      connectionData.callback(message);
    }
  });
});

const gameHandler = (id, player) => (message) => {};

const gameHasPlayers = (game) =>
  Object.values(game.players).some((player) => player.connected);

const gameTicker = () => {
  gameTicking = true;
  const start = Date.now();
  // Do stuff

  // Do it again 50 ms since the start
  const delta = 50 - (Date.now() - start);
  setTimeout(() => {
    // But only if at least one game has a player connected.
    if (Object.values(boxclickerGames).some((game) => gameHasPlayers(game))) {
      gameTicker();
    } else {
      gameTicking = false;
    }
  }, Math.max(delta, 0));
};

const newGame = () => {
  const id = uuid();

  boxclickerGames[id] = {
    id,
    players: {},
    boxOrder: [],
    gameState: GAME_STATES.LOBBY,
    start: Date.now(),
  };

  return id;
};

const joinGame = (id, player, websocketConnection) => {
  if (!boxclickerGames[id]) {
    return false;
  }

  if (Object.values(boxclickerGames[id].players).length < 2) {
    boxclickerGames[id].players[player.id] = {
      id: player.id,
      name: player.name,
      state: PLAYER_STATES.STANDBY,
      websocketConnection,
      connected: true,
    };

    websocketConnection.on('close', () => {
      boxclickerGames[id].players[player.id].connected = false;
    });
  }
};

module.exports = {
  newGame,
  joinGame,
};

console.log('aaaa');
