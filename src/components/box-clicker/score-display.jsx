import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
  display: ${({ alwaysOpen, i }) => (i === 0 || alwaysOpen ? 'block' : 'none')};

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

const ScoreDisplay = ({
  scores,
  isLoading,
  alwaysOpen = false,
  limit = 10,
}) => {
  const topScores = scores.sort((a, b) => a.time - b.time).slice(0, limit);
  return (
    <Container>
      {isLoading && <div>Loading scores...</div>}
      {topScores.map((score, i) => (
        <Score
          alwaysOpen={alwaysOpen}
          key={`${score.name}${score.timestamp}`}
          i={i}
        >
          {`${i + 1}. ${score.name} - ${score.time.toFixed(2)} seconds`}{' '}
          {score.hasReplay && (
            <Link to={`/boxclicker/replay/${score.id}`}>(View Replay)</Link>
          )}
        </Score>
      ))}
      {!alwaysOpen && topScores.length > 1 && (
        <HideOnHover>
          Hover to see <span>{topScores.length - 1}</span> more score
          <span>{topScores.length - 1 !== 1 ? 's' : ''}</span>
        </HideOnHover>
      )}
      {!alwaysOpen && <HideOnHover>Scores expire after 2 months.</HideOnHover>}
    </Container>
  );
};

export default ScoreDisplay;
