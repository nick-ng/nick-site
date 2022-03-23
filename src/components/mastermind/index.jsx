import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import GuessAccuracy from './guess-accuracy';
import { getAnswer, checkGuess } from './utils';

const Container = styled.div``;

const PrevGuesses = styled.div``;

const Guess = styled.form`
  display: grid;
  justify-content: start;
  grid-template-columns: auto auto auto auto auto;
  grid-gap: 0.5em;

  input,
  & > div {
    display: block;
    border: 1px solid grey;
    width: 48px;
    height: 48px;
    text-align: center;
    font-size: 1em;
  }

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  button {
    width: 48px;
    height: 48px;
  }
`;

export default function Mastermind() {
  const [answer, setAnswer] = useState(getAnswer());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState(['', '', '', '']);
  const [isCorrect, setIsCorrect] = useState(false);

  const submitGuess = () => {
    if (currentGuess.every((a) => a.length > 0)) {
      const guessAccuracy = checkGuess(currentGuess, answer);
      setGuesses((prev) =>
        prev.concat([{ guess: currentGuess, guessAccuracy }])
      );
      setCurrentGuess(['', '', '', '']);
    }
  };

  return (
    <Container>
      <h2>Mastermind</h2>
      <PrevGuesses>
        {guesses.map(({ guess, guessAccuracy }) => (
          <Guess key={guess.join(',')}>
            <div>{guess[0]}</div>
            <div>{guess[1]}</div>
            <div>{guess[2]}</div>
            <div>{guess[3]}</div>
            <GuessAccuracy {...guessAccuracy} />
          </Guess>
        ))}
      </PrevGuesses>
      <Guess
        onSubmit={(e) => {
          e.preventDefault();
          submitGuess();
        }}
      >
        <input
          value={currentGuess[0]}
          onChange={(e) => {
            const value = e.target.value;
            setCurrentGuess((prev) => {
              prev[0] = value;
              return [...prev];
            });
          }}
        />
        <input
          value={currentGuess[1]}
          onChange={(e) => {
            const value = e.target.value;
            setCurrentGuess((prev) => {
              prev[1] = value;
              return [...prev];
            });
          }}
        />
        <input
          value={currentGuess[2]}
          onChange={(e) => {
            const value = e.target.value;
            setCurrentGuess((prev) => {
              prev[2] = value;
              return [...prev];
            });
          }}
        />
        <input
          value={currentGuess[3]}
          onChange={(e) => {
            const value = e.target.value;
            setCurrentGuess((prev) => {
              prev[3] = value;
              return [...prev];
            });
          }}
        />
        <button>Guess!</button>
      </Guess>
    </Container>
  );
}
