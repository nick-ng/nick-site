const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

module.exports = (server) => {
  const webSocketServer = new WebSocket.Server({ server });

  webSocketServer.on('connection', (websocketConnection) => {
    const connectionId = uuid();
    console.log('connection', connectionId);

    websocketConnection.on('message', (message) => {
      console.log('Received message', message, connectionId);

      websocketConnection.send('PONG!', connectionId);
    });
  });
};
