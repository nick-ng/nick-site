import React from 'react';
import styled from 'styled-components';

import typeInfo from '../type-info.json';

const StyledPokemonFlashCardStats = styled.details`
  margin-top: 0.5em;

  summary {
    cursor: pointer;
  }

  button {
    margin-top: 1em;
  }
`;

const { matchUps } = typeInfo;

export const groupMatchUps = (history) => {
  return history.reduce((a, item) => {
    const { aType, dType, answer } = item;
    const key = `${aType}-${dType}`;
    const isCorrect = answer === matchUps[aType][dType];

    const prev = a[key] || { total: 0, correct: 0 };

    const newTotal = prev.total + 1;
    const newCorrect = prev.correct + (isCorrect ? 1 : 0);

    return {
      ...a,
      [key]: {
        total: newTotal,
        correct: newCorrect,
        correctPercent: (newCorrect / newTotal) * 100,
        correctAnswer: matchUps[aType][dType],
      },
    };
  }, {});
};

const PokemonFlashCardStats = ({ history, resetStatsHandler }) => {
  const matchUps = groupMatchUps(history);

  console.log('history', history);

  return (
    <StyledPokemonFlashCardStats>
      <summary>Stats ({history.length})</summary>
      <div>
        {Object.entries(matchUps)
          .sort((a, b) => a[1].correctPercent - b[1].correctPercent)
          .filter((a) => a[1].correctPercent < 90)
          .map(([key, value]) => (
            <div key={key}>
              <span>{`${key}: ${value.correctPercent}%`}</span>
              <span>{` (${
                value.correctAnswer === 0.5 ? '½' : value.correctAnswer
              })`}</span>
            </div>
          ))}
      </div>
      <button
        onClick={() => {
          resetStatsHandler();
        }}
      >
        Reset Stats
      </button>
    </StyledPokemonFlashCardStats>
  );
};

export default PokemonFlashCardStats;
