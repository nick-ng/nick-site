import React, { useState, useEffect } from 'react';

let webSocket = null;

const Test = () => {
  const [varA, setVarA] = useState(0);
  const [varB, setVarB] = useState(0);
  const [varC, setVarC] = useState(0);
  useEffect(() => {
    const popupVideoId = setTimeout(() => {
      window.open('https://www.youtube.com/watch?v=PWgvGjAhvIw', '_blank');
    }, 1000);

    const setupWebSocket = async () => {
      //   const res = await axios.get('/api/websocketport');

      webSocket = new WebSocket(`ws://${window.location.host}/ws`);

      console.log('webSocket 1', webSocket);

      webSocket.onopen = () => {
        webSocket.send('onopen event on client');
      };

      webSocket.onerror = (error) => {
        console.log('WebSocket error', error);
      };

      webSocket.onmessage = (e) => {
        setVarA(`${e.data} (${Date.now()})`);
        setVarC(Date.now());
      };

      webSocket.onclose = () => {
        console.log('onclose event on client');
        webSocket = null;
      };
    };

    setupWebSocket();

    return () => {
      clearTimeout(popupVideoId);
    };
  }, []);

  useEffect(() => {
    console.log('webSocket 2', webSocket);
    if (webSocket && webSocket.readyState) {
      console.log('varB', varB);
      console.log('websocket 3', webSocket);

      webSocket.send(varB);
    }
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
