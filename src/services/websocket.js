import { v4 as uuid } from 'uuid';
import { sleep } from '../utils';

const WEBSOCKET_MACHINE_ID = 'WEBSOCKET_MACHINE_ID';

const temp = localStorage.getItem(WEBSOCKET_MACHINE_ID);
let machineId = temp;
if (!temp) {
  machineId = uuid();
  localStorage.setItem(WEBSOCKET_MACHINE_ID, machineId);
}

const webSocketService = {
  websocket: null, // WebSocket connection
  machineId,
  connectionId: null,
  listeners: [
    {
      id: 'set-when-adding-listener',
      type: 'setup',
      callback: ({ subType, payload }) => {
        if (subType === 'set-connection-id') {
          webSocketService.connectionId = payload.connectionId;
        }
      },
    },
  ],
};

// readystate
const readyStates = {
  0: 'CONNECTING',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'CLOSED',
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export const wsConnect = async () => {
  if (
    !webSocketService.websocket ||
    [readyStates.CLOSING, readyStates.CLOSING].includes(
      webSocketService.websocket.readyState
    )
  ) {
    webSocketService.websocket = new WebSocket(
      `${window.location.protocol === 'http:' ? 'ws' : 'wss'}://${
        window.location.host
      }/ws`
    );

    webSocketService.connectionId = await sleep(100);

    webSocketService.websocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('data', data);
      webSocketService.listeners.forEach((listener) => {
        if (data.type === listener.type) {
          listener.callback(data);
        }
      });

      console.log('webSocketService', webSocketService);
    };
  }

  while (webSocketService.websocket.readyState === readyStates.CONNECTING) {
    await sleep(500);
  }

  return true;
};

export const wsSend = async ({ type, subType, payload }) => {
  await wsConnect();
  webSocketService.websocket.send(
    JSON.stringify({
      connectionId: webSocketService.connectionId,
      machineId: webSocketService.machineId,
      type,
      subType,
      payload,
    })
  );
};

export const wsRemoveListener = (listenerId) => {
  webSocketService.listeners = webSocketService.listeners.filter(
    (listener) => listener.id !== listenerId
  );
};

export const wsAddListener = (newListener) => {
  wsConnect();
  wsRemoveListener(newListener.id);
  webSocketService.listeners.push(newListener);
};
