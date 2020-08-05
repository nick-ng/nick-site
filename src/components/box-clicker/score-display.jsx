import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: -1em;
  left: -2em;
  padding: 0.3em 0.5em;
  border-bottom: 1px solid grey;
  border-right: 1px solid grey;
  background-color: white;
`;

const Score = styled.div`
  margin: 0.5em 0 0;
  display: ${(props) => (props.i === 0 ? 'block' : 'none')};

  ${Container}:hover & {
    display: block;
  }

  &:first-of-type {
    margin-top: 0;
  }
`;

const HideOnHover = styled.div`
  font-size: 0.8em;
  margin-top: 0.5em;

  & + & {
    margin-top: 0.2em;
  }

  ${Container}:hover & {
    display: none;
  }
`;

const ScoreDisplay = ({ scores, isLoading }) => {
  const topScores = scores.sort((a, b) => a.time - b.time).slice(0, 10);
  return (
    <Container>
      {isLoading && <div>Loading scores...</div>}
      {topScores.map((score, i) => (
        <Score key={`${score.name}${score.timestamp}`} i={i}>
          {`${i + 1}. ${score.name} - ${score.time.toFixed(2)} seconds`}{' '}
          {score.hasReplay && (
            <a
              href="#"
              onClick={() => {
                alert(`Coming soon. id: ${score.id}`);
              }}
            >
              (View Replay)
            </a>
          )}
        </Score>
      ))}
      {topScores.length > 1 && (
        <HideOnHover>
          Hover to see <span>{topScores.length - 1}</span> more score
          <span>{topScores.length - 1 !== 1 ? 's' : ''}</span>
        </HideOnHover>
      )}
      <HideOnHover>Scores expire after 2 months.</HideOnHover>
    </Container>
  );
};

export default ScoreDisplay;
