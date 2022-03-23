import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

export default function GuessAccuracy({ correct, nearly }) {
  return (
    <Container>
      <div>!: {correct}</div>
      <div>?: {nearly}</div>
    </Container>
  );
}
