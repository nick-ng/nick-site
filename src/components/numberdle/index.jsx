import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { GameArea, Guess } from './styles';
import { getAnswer, checkGuess, getColour } from './utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FlexRows = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;

  @media screen and (max-device-width: 599px) {
    flex-direction: column;
  }
`;

const Instructions = styled.p`
  max-width: 50vw;
  width: 30em;

  margin-top: 0;
`;

const MaxNumberInput = styled.input`
  width: 3em;
`;

const OKButton = styled.button`
  width: 100%;
  margin-top: 0.3em;
`;

export default function Numberdle() {
  const [maxNumber, setMaxNumber] = useState(9);
  const [answer, setAnswer] = useState(getAnswer(1, parseInt(maxNumber, 10)));
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(['', '', '', '']);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const answerInputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const maxNumberLength = maxNumber.toString().length;

  const submitGuess = () => {
    if (currentGuess.every((a) => a.length > 0)) {
      const hints = checkGuess(currentGuess, answer);
      setGuesses((prev) =>
        prev.concat([
          {
            guess: currentGuess.map((a) => parseInt(a, 10)),
            hints,
          },
        ])
      );
      setCurrentGuess(['', '', '', '']);
      if (hints.filter((a) => a === 'correct').length === answer.length) {
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
      <h2>Numberdle</h2>
      <FlexRows>
        <Container>
          <Instructions>
            This is based on{' '}
            <a
              href="https://www.nytimes.com/games/wordle/index.html"
              target="_blank"
            >
              Wordle
            </a>{' '}
            and has the hints on the numbers directly.{' '}
            <Link to="/mastermind">Mastermind</Link> is based on the boardgame
            from 1972 and doesn't have hints on numbers.
          </Instructions>
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
                {guesses.map(({ guess, hints }, i) => (
                  <tr key={`${i},${guess.join(',')}`}>
                    {guess.map((a, j) => (
                      <td
                        key={`${i},${guess.join(',')}${j}`}
                        style={{ ...getColour(hints[j]) }}
                      >
                        <Guess>{a}</Guess>
                      </td>
                    ))}
                  </tr>
                ))}
                {!isCorrect && (
                  <tr>
                    {currentGuess.map((guess, i) => (
                      <td key={`guess-${i}`}>
                        <input
                          type="tel"
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
                  </tr>
                )}
              </tbody>
            </GameArea>
            {!isCorrect && <OKButton>OK</OKButton>}
          </form>
          {isCorrect && <p>Correct!</p>}
          {showReset && (
            <button type="button" onClick={resetGame}>
              Play Again
            </button>
          )}
        </Container>
      </FlexRows>
    </Container>
  );
}
