import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import GuessAccuracy from './guess-accuracy';
import GuessEliminator from './guess-eliminator';
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

export default function Mastermind() {
  const [maxNumber, setMaxNumber] = useState(6);
  const [answer, setAnswer] = useState(getAnswer(1, parseInt(maxNumber, 10)));
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(['', '', '', '']);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showGuessEliminator, setShowGuessEliminator] = useState(false);

  const answerInputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const maxNumberLength = maxNumber.toString().length;

  const submitGuess = () => {
    if (currentGuess.every((a) => a.length > 0)) {
      const guessAccuracy = checkGuess(currentGuess, answer);
      setGuesses((prev) =>
        prev.concat([
          {
            guess: currentGuess.map((a) => parseInt(a, 10)),
            guessAccuracy,
            isSentToGuessEliminator: true,
          },
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
      <label style={{ marginBottom: '1em' }}>
        Cheat:&nbsp;
        <input
          type="checkbox"
          checked={showGuessEliminator}
          onChange={() => {
            setShowGuessEliminator((prev) => !prev);
          }}
        />
      </label>
      <FlexRows>
        <Container>
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
          <Instructions>
            A ⚫ hint means a number is correct place.
          </Instructions>
          <Instructions>
            A ⚪ hint means a number is in the answer but in the wrong place.
          </Instructions>
          <Instructions>
            The hints don't indicate <em>which</em> number is correct. Only how
            many are correct/nearly correct.
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
                {guesses.map(
                  ({ guess, guessAccuracy, isSentToGuessEliminator }, i) => (
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
                      {showGuessEliminator && (
                        <td>
                          <input
                            type="checkbox"
                            checked={isSentToGuessEliminator}
                            onChange={() => {
                              setGuesses((prev) => {
                                const next = [...prev];
                                next[i].isSentToGuessEliminator =
                                  !prev[i].isSentToGuessEliminator;
                                return next;
                              });
                            }}
                          />
                        </td>
                      )}
                    </tr>
                  )
                )}
                {!isCorrect && (
                  <tr>
                    {currentGuess.map((guess, i) => (
                      <td
                        key={`guess-${i}`}
                        style={{ backgroundColor: getColour(guess, maxNumber) }}
                      >
                        <input
                          type="tel"
                          style={{
                            backgroundColor: getColour(guess, maxNumber),
                          }}
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
                    <td colSpan={showGuessEliminator ? 2 : 1}>
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
        {showGuessEliminator && (
          <GuessEliminator
            guesses={guesses.filter((guess) => guess.isSentToGuessEliminator)}
            maxNumber={maxNumber}
          />
        )}
      </FlexRows>
    </Container>
  );
}
