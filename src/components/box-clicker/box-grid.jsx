import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import random from 'lodash/random';

const Container = styled.div`
  padding: 2rem 5rem 5rem;
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(${(props) => props.columns}, auto);
  gap: ${(props) => props.gap || 10}px;
  justify-items: center;
  justify-content: space-between;
`;

const Box = styled.button.attrs((props) => ({
  style: {
    // backgroundColor: props.active ? randomBlack() : randomWhite(),
    backgroundColor: props.active ? 'black' : 'white',
  },
}))`
  width: ${(props) => props.size || 5}em;
  height: ${(props) => props.size || 5}em;
  border: 1px solid black;
`;

const BoxGrid = ({
  activeBox,
  boxClickHandler,
  boxCount,
  columns,
  gap,
  mouseMoveHandler,
}) => {
  return (
    <Container columns={columns} gap={gap} onMouseMove={mouseMoveHandler}>
      {Array.from(Array(boxCount).keys()).map((_, i) => (
        <Box
          key={`box-${i}-of-${boxCount}`}
          onClick={(e) => boxClickHandler(e, i)}
          active={i === activeBox}
        />
      ))}
    </Container>
  );
};

export default BoxGrid;
