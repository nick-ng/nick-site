const { v4: uuid } = require('uuid');

const CHANNEL_PREFIX = 'boxclickerps';

const connectionData = {
  connections: [
    {
      id: '1234-1234-1234',
      channel: `${CHANNEL_PREFIX}:channel-id`,
      callback: (message) => {
        console.log('message', message);
      },
    },
  ],
};

const addConnection = (subscriber) => (channel, callback) => {
  const id = uuid();
  const actualChannel = `${CHANNEL_PREFIX}:${channel}`;
  connectionData.connections.push({
    id,
    channel: actualChannel,
    callback,
  });

  subscriber.subscribe(actualChannel);

  return id;
};

const removeConnection = (subscriber) => (id) => {
  const removedConnection = connectionData.connections.filter(
    (connection) => connection.id === id
  );
  connectionData.connections = connectionData.connections.filter(
    (connection) => connection.id !== id
  );

  if (
    connectionData.connections.every(
      (connection) => connection.channel !== removedConnection.channel
    ) &&
    removedConnection.channel
  ) {
    subscriber.unsubscribe(removedConnection.channel);
  }
};

const sendMessage = (publisher) => (channel, message) => {
  publisher.publish(channel, message);
};

module.exports = (publisher, subscriber) => {
  subscriber.on('message', (channel, message) => {
    const matchingConnections = connectionData.connections.filter(
      (connection) => connection.channel === channel
    );

    matchingConnections.forEach((connection) => {
      if (typeof connection.callback === 'function') {
        connectionData.callback(message);
      }
    });
  });

  return {
    CHANNEL_PREFIX,
    subscriber,
    addConnection: addConnection(subscriber),
    removeConnection: removeConnection(subscriber),
    sendMessage: sendMessage(publisher),
  };
};
