import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  justify-content: stretch;
  align-content: stretch;
  width: 100%;
  height: 100%;

  span {
    margin: 0;
    padding: 0;
  }
`;

const CORRECT = '⚫';
const NEARLY = '⚪';

export default function GuessAccuracy({ correct, nearly }) {
  const accuracy = [
    <span>&nbsp;</span>,
    <span>&nbsp;</span>,
    <span>&nbsp;</span>,
    <span>&nbsp;</span>,
  ];

  for (let n = 0; n < nearly; n++) {
    accuracy.unshift(<span>{NEARLY}</span>);
  }

  for (let n = 0; n < correct; n++) {
    accuracy.unshift(<span>{CORRECT}</span>);
  }

  return (
    <Container>
      {accuracy[0]}
      {accuracy[1]}
      {accuracy[2]}
      {accuracy[3]}
    </Container>
  );
}
