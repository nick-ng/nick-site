import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import MarkdownDisplay from '../markdown-display';

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  font-size: 3em;
  min-height: 100vh;
  min-width: 70vw;
  border-bottom: 1px solid lightgrey;

  * {
    text-align: center;
  }
`;

export default function ConfettiStandAlone({ message }) {
  const urlParams = new URLSearchParams(window.location.search);
  const [clientWidth, setClientWidth] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef) {
      setClientWidth(containerRef.current.clientWidth);
      setClientHeight(containerRef.current.clientHeight);
    }
  }, [containerRef]);

  return (
    <Container ref={containerRef}>
      <MarkdownDisplay content={message || urlParams.get('m') || ''} />
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
