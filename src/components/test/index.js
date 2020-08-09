import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import {
  wsAddListener,
  wsConnect,
  wsRemoveListener,
  wsSend,
} from '../../services/websocket';

let webSocket = null;

const Test = () => {
  const [varA, setVarA] = useState(0);
  const [varB, setVarB] = useState(0);
  const [varC, setVarC] = useState(0);
  useEffect(() => {
    const popupVideoId = setTimeout(() => {
      window.open('https://www.youtube.com/watch?v=PWgvGjAhvIw', '_blank');
    }, 1000);

    wsConnect();
    const listenerId = uuid();
    wsAddListener({
      id: listenerId,
      type: 'test',
      callback: ({ subType, payload }) => {
        console.log('subType', subType);
        console.log('payload', payload);
      },
    });

    return () => {
      clearTimeout(popupVideoId);
      wsRemoveListener(listenerId);
    };
  }, []);

  useEffect(() => {
    wsSend({
      type: 'test',
      subType: 'set-var-b',
      payload: varB,
    });
  }, [varB]);

  return (
    <div>
      <p>Opening a new tab in 1 seconds.</p>
      <h2>{varA}</h2>
      <h3>{`${varC - varB} ms`}</h3>
      <button
        onClick={() => {
          setVarB(Date.now());
        }}
      >
        Hi
      </button>
      <pre>{JSON.stringify(webSocket, null, '  ')}</pre>
    </div>
  );
};
export default Test;
