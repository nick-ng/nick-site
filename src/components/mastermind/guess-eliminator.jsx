import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { GameArea, Guess } from './styles';
import { getColour } from './utils';

const Container = styled.div`
  margin-left: 1em;

  h3 {
    margin-top: 0;
  }
`;

export default function GuessEliminator({ guesses, maxNumber }) {
  const [allPermutations, setAllPermutations] = useState([]);

  useState(() => {
    const tempGuesses = [];

    for (let a = 1; a <= maxNumber; a++) {
      for (let b = 1; b <= maxNumber; b++) {
        for (let c = 1; c <= maxNumber; c++) {
          for (let d = 1; d <= maxNumber; d++) {
            tempGuesses.push([a, b, c, d]);
          }
        }
      }
    }

    setAllPermutations(tempGuesses);
  }, [maxNumber]);

  return (
    <Container>
      <h3>Possible Answers</h3>
      <pre>{JSON.stringify(guesses, null, '  ')}</pre>
      {guesses.length > 0 && (
        <GameArea>
          <tbody>
            {allPermutations.map((permutation) => (
              <tr key={permutation.join('-')}>
                {permutation.map((a, i) => (
                  <td
                    key={`${permutation.join('-')}${i}`}
                    style={{ backgroundColor: getColour(a, maxNumber) }}
                  >
                    <Guess>{a}</Guess>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </GameArea>
      )}
    </Container>
  );
}
