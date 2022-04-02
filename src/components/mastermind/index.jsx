import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

import GuessAccuracy from './guess-accuracy';
import GuessEliminator from './guess-eliminator';
import { GameArea, Guess } from './styles';
import { getAnswer, checkGuess, getColour } from './utils';

const getSeed = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
};

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

const Details = styled.details`
  max-width: 50vw;
  width: 30em;

  cursor: pointer;

  summary {
    margin-bottom: 1em;
    text-decoration: underline;
  }

  &[open] summary {
    text-decoration: none;
  }
`;

const MaxNumberInput = styled.input`
  width: 3em;
`;

export default function Mastermind() {
  const [maxNumber, setMaxNumber] = useState(6);
  const [answer, setAnswer] = useState([1, 1, 1, 1]);
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(['', '', '', '']);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showGuessEliminator, setShowGuessEliminator] = useState(false);

  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const isDaily = query.get('daily') !== 'no';

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

  const resetGame = (seed = null) => {
    setGuesses([]);
    setAnswer(getAnswer(1, parseInt(maxNumber, 10), seed));
    setShowReset(false);
    setIsCorrect(false);
    setCurrentGuess(['', '', '', '']);
  };

  useEffect(() => {
    const seed = isDaily ? getSeed() : null;
    resetGame(seed);
  }, [maxNumber, isDaily]);

  return (
    <Container>
      <h2>{isDaily && 'Daily '}Mastermind</h2>
      {isDaily ? (
        <Instructions>
          Click <Link to="/mastermind?daily=no">here</Link> for a random
          Mastermind puzzle.
        </Instructions>
      ) : (
        <Instructions>
          Click <Link to="/mastermind">here</Link> for the daily Mastermind
          puzzle.
        </Instructions>
      )}
      {!isDaily && (
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
      )}
      <FlexRows>
        <Container>
          <Instructions>
            This is based on the 1972 boardgame{' '}
            <a href="" target="_blank">
              Mastermind
            </a>
            . For a version based on{' '}
            <a
              href="https://www.nytimes.com/games/wordle/index.html"
              target="_blank"
            >
              Wordle
            </a>
            , try <Link to="/numberdle">Numberdle</Link>.
          </Instructions>
          {isDaily ? (
            <Instructions>
              Enter numbers between 1 and 6 in the boxes below then press enter
              or the OK button.
            </Instructions>
          ) : (
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
          )}
          <Details>
            <summary>Instructions</summary>
            <Instructions>Numbers may be repeated.</Instructions>
            <Instructions>
              A ⚫ hint means a number is correct place.
            </Instructions>
            <Instructions>
              A ⚪ hint means a number is in the answer but in the wrong place.
            </Instructions>
            <Instructions>
              The hints don't indicate <em>which</em> number is correct. Only
              how many are correct/nearly correct.
            </Instructions>
          </Details>
          {showReset && !isDaily && (
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
          {isCorrect && (
            <p>
              Correct!
              {isDaily && (
                <span>
                  {' '}
                  Click <Link to="/mastermind?daily=no">here</Link> for a random
                  Mastermind puzzle.
                </span>
              )}
            </p>
          )}
          {showReset && !isDaily && (
            <button type="button" onClick={resetGame}>
              Play Again
            </button>
          )}
        </Container>
        {showGuessEliminator && !isDaily && (
          <GuessEliminator
            guesses={guesses.filter((guess) => guess.isSentToGuessEliminator)}
            maxNumber={maxNumber}
          />
        )}
      </FlexRows>
    </Container>
  );
}
