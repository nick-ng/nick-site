import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import GuessAccuracy from './guess-accuracy';
import { getAnswer, checkGuess, getColour } from './utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Instructions = styled.p`
  max-width: 50vw;
  width: 30em;

  margin-top: 0;
`;

const MaxNumberInput = styled.input`
  width: 3em;
`;

const GameArea = styled.table`
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

const Guess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  font-size: 1em;
`;

export default function Mastermind() {
  const [maxNumber, setMaxNumber] = useState(6);
  const [answer, setAnswer] = useState(getAnswer(1, parseInt(maxNumber, 10)));
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(['', '', '', '']);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const answerInputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const maxNumberLength = maxNumber.toString().length;

  const submitGuess = () => {
    if (currentGuess.every((a) => a.length > 0)) {
      const guessAccuracy = checkGuess(currentGuess, answer);
      setGuesses((prev) =>
        prev.concat([
          { guess: currentGuess.map((a) => parseInt(a, 10)), guessAccuracy },
        ])
      );
      setCurrentGuess(['', '', '', '']);
      if (guessAccuracy.correct === answer.length) {
        setIsCorrect(true);
        setShowReset(true);
      }
      answerInputs[0].current.focus();
    }
  };

  const resetGame = () => {
    setGuesses([]);
    setAnswer(getAnswer(1, parseInt(maxNumber, 10)));
    setShowReset(false);
    setIsCorrect(false);
    setCurrentGuess(['', '', '', '']);
  };

  useEffect(() => {
    resetGame();
  }, [maxNumber]);

  return (
    <Container>
      <h2>Mastermind</h2>
      <Instructions>
        Enter numbers between 1 and{' '}
        <MaxNumberInput
          type="number"
          value={maxNumber}
          onChange={(e) => {
            setMaxNumber(e.target.value);
            setShowReset(true);
          }}
        />{' '}
        in the boxes below then press enter or the OK button.
      </Instructions>
      <Instructions>Numbers may be repeated.</Instructions>
      <Instructions>A ⚫ hint means a number is correct place.</Instructions>
      <Instructions>
        A ⚪ hint means a number is in the answer but in the wrong place.
      </Instructions>
      <Instructions>
        The hints don't indicate <em>which</em> number is correct. Only how many
        are correct/nearly correct.
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
                  <td
                    key={`${i},${guess.join(',')}${j}`}
                    style={{ backgroundColor: getColour(a, maxNumber) }}
                  >
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
                  <td
                    key={`guess-${i}`}
                    style={{ backgroundColor: getColour(guess, maxNumber) }}
                  >
                    <input
                      type="tel"
                      style={{ backgroundColor: getColour(guess, maxNumber) }}
                      value={guess}
                      ref={answerInputs[i]}
                      onChange={(e) => {
                        const value = e.target.value;

                        setCurrentGuess((prev) => {
                          const newCurrentGuess = [...prev];
                          newCurrentGuess[i] = value;
                          return newCurrentGuess;
                        });
                      }}
                      onInput={(e) => {
                        if (
                          e.target.value.length >= maxNumberLength ||
                          parseInt(`${e.target.value}0`, 10) > maxNumber
                        ) {
                          answerInputs[(i + 1) % 4].current.focus();
                        }
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
