import styled from 'styled-components';

export const GameArea = styled.table`
  margin-top: 0.5em;
  border-collapse: collapse;

  td {
    border: 2px solid black;
    width: 3em;
    height: 3em;

    input {
      border: none;
      height: 100%;
      width: 100%;
      padding: 0;
      margin: 0;
      text-align: center;
      font-family: sans-serif;
      font-size: 1em;
    }

    button {
      width: 100%;
      height: 100%;
    }
  }
`;

export const Guess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  font-size: 1em;
`;
