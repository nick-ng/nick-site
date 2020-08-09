const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

module.exports = (server) => {
  const webSocketServer = new WebSocket.Server({ server });

  webSocketServer.on('connection', (websocketConnection) => {
    const connectionId = uuid();
    console.log('connection', connectionId);

    websocketConnection.send(
      JSON.stringify({
        type: 'setup',
        subType: 'set-connection-id',
        payload: {
          connectionId,
        },
      })
    );

    websocketConnection.on('message', (message) => {
      try {
        const messageObj = JSON.parse(message);
        switch (messageObj.type) {
          case 'test':
            console.log('test message', messageObj);
            websocketConnection.send(
              JSON.stringify({
                type: 'test',
                subType: 'hello',
                payload: 'world',
              })
            );
        }
      } catch (e) {
        console.log('error when receiving webSocket message', e);
      }
    });
  });
};
