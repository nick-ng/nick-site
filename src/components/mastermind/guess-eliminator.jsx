import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { GameArea, Guess } from './styles';
import { checkGuess, getColour } from './utils';

const Container = styled.div`
  margin-left: 1em;
  margin-bottom: 1em;

  h3 {
    margin-top: 0;

    @media screen and (max-device-width: 599px) {
      margin-top: 1em;
    }
  }
`;

export default function GuessEliminator({ guesses, maxNumber }) {
  const [possiblePermutations, setPossiblePermutations] = useState([]);

  useEffect(() => {
    const tempAnswers = [];

    for (let a = 1; a <= maxNumber; a++) {
      for (let b = 1; b <= maxNumber; b++) {
        for (let c = 1; c <= maxNumber; c++) {
          for (let d = 1; d <= maxNumber; d++) {
            const tempAnswer = [a, b, c, d];
            const isPossible = guesses.every(({ guess, guessAccuracy }) => {
              const tempAccuracy = checkGuess(guess, tempAnswer);

              return (
                guessAccuracy.correct === tempAccuracy.correct &&
                guessAccuracy.nearly === tempAccuracy.nearly
              );
            });

            if (isPossible) {
              tempAnswers.push(tempAnswer);
            }
          }
        }
      }
    }

    setPossiblePermutations(tempAnswers);
  }, [guesses, maxNumber]);

  return (
    <Container>
      <h3>
        Possible Answers (<span>{possiblePermutations.length}</span> total)
      </h3>
      {guesses.length > 0 ? (
        <GameArea>
          <tbody>
            {possiblePermutations.length < 1000
              ? possiblePermutations.map((permutation) => (
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
                ))
              : 'Too many permutations'}
          </tbody>
        </GameArea>
      ) : (
        <p>There are no guesses so this would just be everything.</p>
      )}
    </Container>
  );
}
