import React, { useState, useEffect, useRef, useReducer } from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';

const Container = styled.div`
  margin-top: -1em;
  position: relative;
  display: flex;
  justify-content: center;
  font-size: 3em;
  min-height: 50vh;
  min-width: 70vw;
  border-bottom: 1px solid lightgrey;
`;

export default function ConfettiWithMessage({ message }) {
  const [clientWidth, setClientWidth] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log(containerRef && containerRef.current);
    if (containerRef) {
      setClientWidth(containerRef.current.clientWidth);
      setClientHeight(containerRef.current.clientHeight);
    }
  }, [containerRef]);

  return (
    <Container ref={containerRef}>
      <h2>{message}</h2>
      <Confetti
        style={{ top: 0, left: 0 }}
        width={clientWidth}
        height={clientHeight}
        numberOfPieces={100}
        gravity={0.03}
      />
    </Container>
  );
}
