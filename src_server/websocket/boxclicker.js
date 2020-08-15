const bcService = require('../service/boxclicker');

module.exports = (websocketConnection, connectionId) => {
  websocketConnection.on('message', (message) => {
    try {
      const { type, subType, payload } = JSON.parse(message);
      if (type !== 'boxclicker') {
        return;
      }

      switch (subType) {
        case 'join':
          const { gameId, player } = payload;
          bcService.joinGame(gameId, player, websocketConnection);
          break;
        default:
        // nothing
      }
    } catch (e) {
      console.log('error when receiving webSocket message', e);
    }
  });
};
