import React, { useState } from 'react';
import styled from 'styled-components';

import GuessAccuracy from './guess-accuracy';
import { getAnswer, checkGuess } from './utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Instructions = styled.p`
  max-width: 35em;
  width: 30em;

  margin-top: 0;
`;

const MaxRangeInput = styled.input`
  width: 3em;
`;

const GameArea = styled.table`
  margin-top: 0.5em;
  border-collapse: collapse;

  td {
    border: 1px solid grey;
    width: 3em;
    height: 3em;

    input {
      border: none;
      height: 100%;
      width: 100%;
      padding: 0;
      margin: 0;
      background-color: none;
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

const Guess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  font-size: 1em;
`;

export default function Mastermind() {
  const [maxRange, setMaxRange] = useState(6);
  const [answer, setAnswer] = useState(getAnswer(1, parseInt(maxRange, 10)));
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(['', '', '', '']);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const submitGuess = () => {
    if (currentGuess.every((a) => a.length > 0)) {
      const guessAccuracy = checkGuess(currentGuess, answer);
      setGuesses((prev) =>
        prev.concat([{ guess: currentGuess, guessAccuracy }])
      );
      setCurrentGuess(['', '', '', '']);
      if (guessAccuracy.correct === 4) {
        setIsCorrect(true);
        setShowReset(true);
      }
    }
  };

  const resetGame = () => {
    setGuesses([]);
    setAnswer(getAnswer(1, parseInt(maxRange, 10)));
    setShowReset(false);
    setIsCorrect(false);
  };

  return (
    <Container>
      <h2>Mastermind</h2>
      <Instructions>
        Enter the numbers between 1 and{' '}
        <MaxRangeInput
          type="number"
          value={maxRange}
          onChange={(e) => {
            setMaxRange(e.target.value);
            setShowReset(true);
          }}
        />{' '}
        in the boxes below then press enter or the OK button.
      </Instructions>
      <Instructions>⚫ means a number is correct place.</Instructions>
      <Instructions>
        ⚪ means a number is in the answer but in the wrong place.
      </Instructions>
      {showReset && (
        <button type="button" onClick={resetGame}>
          Reset
        </button>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitGuess();
        }}
      >
        <GameArea>
          <tbody>
            {guesses.map(({ guess, guessAccuracy }, i) => (
              <tr key={`${i},${guess.join(',')}`}>
                {guess.map((a, j) => (
                  <td key={`${i},${guess.join(',')}${j}`}>
                    <Guess>{a}</Guess>
                  </td>
                ))}
                <td>
                  <GuessAccuracy {...guessAccuracy} />
                </td>
              </tr>
            ))}
            {!isCorrect && (
              <tr>
                {currentGuess.map((guess, i) => (
                  <td key={`guess-${i}`}>
                    <input
                      value={guess}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCurrentGuess((prev) => {
                          prev[i] = value;
                          return [...prev];
                        });
                      }}
                    />
                  </td>
                ))}
                <td>
                  <button>OK</button>
                </td>
              </tr>
            )}
          </tbody>
        </GameArea>
      </form>
      {isCorrect && <p>Correct!</p>}
      {showReset && (
        <button type="button" onClick={resetGame}>
          Play Again
        </button>
      )}
    </Container>
  );
}
