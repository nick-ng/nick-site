import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  padding: 25px 70px 70px;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, auto);
  gap: ${(props) => props.gap || 15}px;
  justify-items: center;
  justify-content: space-between;
`;

export const Box = styled.button.attrs((props) => ({
  style: {
    backgroundColor: props.active ? 'darkslategrey' : 'white',
    color: props.active ? 'white' : 'black',
  },
}))`
  width: ${(props) => props.size || 65}px;
  height: ${(props) => props.size || 65}px;
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
