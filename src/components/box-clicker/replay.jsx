import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import seedrandom from 'seedrandom';

import { processReplay } from './utils';
import { COLUMN_COUNT, ROW_COUNT, GRID_GAP, Controls } from './index';
import BoxGrid from './box-grid';
import ScoreDisplay from './score-display';
import ScoreDetails from './score-details';

const Container = styled.div`
  position: relative;
  margin: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ReplayArea = styled.div`
  position: relative;
`;

const Cursor = styled.div.attrs((props) => ({
  style: {
    top: `${props.top}px`,
    left: `${props.left}px`,
    transitionDuration: `${props.duration}s`,
  },
}))`
  position: absolute;
  clip-path: polygon(0 0, 40% 100%, 100% 40%);
  background-color: ${(props) => (props.player === 1 ? 'black' : 'white')};
  content: '';
  width: 20px;
  height: 20px;
  transition-property: left, top;
  transition-timing-function: linear;

  &:after {
    position: absolute;
    clip-path: polygon(0 0, 40% 100%, 100% 40%);
    width: 70%;
    height: 70%;
    left: 3px;
    top: 3px;
    background-color: ${(props) => (props.player === 1 ? 'white' : 'black')};
    content: '';
  }
`;

const Time = styled.div`
  font-family: monospace;
  text-align: right;
`;

const BoxClickerReplayPlayer = () => {
  const { replayId } = useParams();
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({});
  const [allScores, setAllScores] = useState([]);
  const [boxOrder, setBoxOrder] = useState([]);
  const [activeBox, setActiveBox] = useState(0);

  const [replayTick, setReplayTick] = useState(0);
  const [replayTickObject, setReplayTickObject] = useState({
    x: 0,
    y: 0,
    delta: 0,
    relativeTimestamp: 0,
  });
  const [replayState, setReplayState] = useState('stop');
  const [processedReplay, setProcessedReplay] = useState([]);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      const ress = await Promise.all([
        replayId ? axios.get(`/api/boxclicker/score/${replayId}`) : null,
        axios.get(`/api/boxclicker/scores`),
      ]);
      const newAllScores = ress[1].data.allScores;
      setAllScores(newAllScores);
      if (ress[0]) {
        setScore(ress[0].data);
      } else {
        const fastestWithReplay = newAllScores
          .filter((a) => a.hasReplay)
          .sort((a, b) => a.time - b.time)[0];
        const res = await axios.get(
          `/api/boxclicker/score/${fastestWithReplay.id}`
        );
        setScore(res.data);
      }
      setLoading(false);
    };
    fetcher();
  }, [replayId]);

  useEffect(() => {
    const { moveHistory, clickHistory, seed } = score;
    if (Array.isArray(moveHistory) && Array.isArray(clickHistory)) {
      setProcessedReplay(processReplay(moveHistory, clickHistory));
      setReplayTick(0);
      const rng = seedrandom(seed);
      const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
      let prev;
      setBoxOrder(
        clickHistory.map((_, i) => {
          if (i === 0) {
            const temp = randInt(0, COLUMN_COUNT * ROW_COUNT - 1);
            prev = temp;
            return temp;
          }
          const temp = randInt(0, COLUMN_COUNT * ROW_COUNT - 2);
          if (temp >= prev) {
            prev = temp + 1;
            return temp + 1;
          }
          prev = temp;
          return temp;
        })
      );
    }

    setReplayState('stop');
  }, [score]);

  useEffect(() => {
    let timeoutId = null;
    if (replayTick < processedReplay.length) {
      const { delta, type, boxNumber } = processedReplay[replayTick];
      setReplayTickObject(processedReplay[replayTick]);
      if (replayTick === 0) {
        setActiveBox(boxOrder[0]);
      } else if (replayTick === 1) {
        setActiveBox(boxOrder[1]);
      } else if (type === 'click') {
        if (boxNumber + 1 < boxOrder.length) {
          setActiveBox(boxOrder[boxNumber + 1]);
        } else {
          setActiveBox(-1);
        }
      }

      if (replayState === 'play') {
        timeoutId = setTimeout(() => {
          setReplayTick(replayTick + 1);
        }, delta);
      }
    } else {
      setReplayState('stop');
    }

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [replayState, replayTick, processedReplay]);

  return (
    <Container>
      <h1>Box Clicker Replay Player</h1>
      <Controls>
        <button
          onClick={() => {
            setReplayTick(0);
            setReplayState('stop');
          }}
        >
          <i className="fa fa-fast-backward"></i> Rewind
        </button>
        <button
          disabled={replayState === 'stop'}
          onClick={() => {
            setReplayState('stop');
          }}
        >
          <i className="fa fa-pause"></i> Pause
        </button>
        <button
          disabled={replayState === 'play'}
          onClick={() => {
            setReplayState('play');
          }}
        >
          <i className="fa fa-play"></i> Play
        </button>
      </Controls>
      <Time>{(replayTickObject.relativeTimestamp / 1000).toFixed(3)}</Time>
      {loading ? (
        <p>Loading replay...</p>
      ) : (
        <ReplayArea>
          <BoxGrid
            columns={COLUMN_COUNT}
            gap={GRID_GAP}
            boxCount={COLUMN_COUNT * ROW_COUNT}
            activeBox={activeBox}
            mouseMoveHandler={() => {}}
            boxClickHandler={() => {}}
          />
          <Cursor
            player={1}
            left={replayTickObject.x}
            top={replayTickObject.y}
            duration={replayTickObject.delta / 1001}
          />
        </ReplayArea>
      )}
      <ScoreDisplay
        alwaysOpen
        scores={allScores}
        isLoading={loading}
        limit={99999}
      />
      <ScoreDetails score={score} />
    </Container>
  );
};

export default BoxClickerReplayPlayer;
