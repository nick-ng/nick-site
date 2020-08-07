import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const BoxClickerReplayPlayer = () => {
  const history = useHistory();
  const { replayId } = useParams();
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState({});
  const [allScores, setAllScores] = useState([]);
  const [boxOrder, setBoxOrder] = useState([]);
  const [activeBox, setActiveBox] = useState(0);
  const [replayFrame, setReplayFrame] = useState(0);
  const [replayFrameObject, setReplayFrameObject] = useState({
    x: 0,
    y: 0,
    delta: 0,
    relativeTimestamp: 0,
  });
  const [replayState, setReplayState] = useState('pause');
  const [replaySpeed, setReplaySpeed] = useState(1);
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
        history.push(`/boxclicker/replay/${fastestWithReplay.id}`);
      }
      setLoading(false);
    };
    fetcher();
  }, [replayId]);

  useEffect(() => {
    const { moveHistory, clickHistory, seed } = score;
    if (Array.isArray(moveHistory) && Array.isArray(clickHistory)) {
      setProcessedReplay(processReplay(moveHistory, clickHistory));
      setReplayFrame(0);
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

    setReplayState('pause');
  }, [score]);

  useEffect(() => {
    let timeoutId = null;
    if (replayFrame < processedReplay.length) {
      const { delta, type, boxNumber } = processedReplay[replayFrame];
      setReplayFrameObject(processedReplay[replayFrame]);
      if (replayFrame === 0) {
        setActiveBox(boxOrder[0]);
      } else if (replayFrame === 1) {
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
          setReplayFrame(replayFrame + 1);
        }, delta / Math.max(replaySpeed, 0.0001));
      }
    } else {
      setReplayState('pause');
    }

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [replayState, replayFrame, processedReplay]);

  console.log('replayFrame', replayFrame);

  return (
    <Container>
      <h1>Box Clicker Replay Player</h1>
      <Controls>
        <button
          onClick={() => {
            setReplayFrame(0);
            setReplayState('pause');
          }}
        >
          <i className="fa fa-fast-backward"></i> Rewind
        </button>
        <button
          onClick={() => {
            setReplayFrame(Math.max(0, replayFrame - 1));
            setReplayState('pause');
          }}
        >
          <i className="fa fa-step-backward"></i> Step
        </button>
        <button
          disabled={replayState === 'pause'}
          onClick={() => {
            setReplayState('pause');
          }}
        >
          <i className="fa fa-pause"></i> Pause
        </button>
        <button
          onClick={() => {
            setReplayFrame(replayFrame + 1);
            setReplayState('pause');
          }}
        >
          <i className="fa fa-step-forward"></i> Step
        </button>
        <button
          disabled={replayState === 'play'}
          onClick={() => {
            if (replayFrame >= processedReplay.length) {
              setReplayFrame(0);
            }
            setReplayState('play');
          }}
        >
          <i className="fa fa-play"></i> Play
        </button>
      </Controls>
      <Controls>
        <label>
          Replay Speed:
          <input
            type="number"
            step={0.01}
            min={0.01}
            max={9999999}
            value={replaySpeed}
            onChange={(e) => {
              try {
                let a = e.target.value;
                if (a[0] === '.') {
                  a = '0' + a;
                }
                setReplaySpeed(parseFloat(a));
              } catch (e) {
                // pass
              }
            }}
          />
        </label>
        <label>
          Replay Frame:
          <input
            type="number"
            step={1}
            value={replayFrame}
            onChange={(e) => {
              console.log(
                Math.max(processedReplay.length - 1, 0),
                e.target.value
              );
              try {
                let a = parseInt(e.target.value);

                setReplayFrame(Math.max(0, a));
                setReplayState('pause');
              } catch (e) {
                // pass
              }
            }}
          />
        </label>
        <Time>{(replayFrameObject.relativeTimestamp / 1000).toFixed(3)}</Time>
      </Controls>

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
            left={replayFrameObject.x}
            top={replayFrameObject.y}
            duration={
              replayState === 'play'
                ? replayFrameObject.delta /
                  (1001 * Math.max(replaySpeed, 0.0001))
                : 0.1
            }
          />
        </ReplayArea>
      )}
      <ScoreDisplay
        alwaysOpen
        scores={allScores}
        isLoading={loading}
        limit={99999}
      />
      <ScoreDetails
        score={score}
        deleteHandler={async () => {
          if (
            confirm(
              `Really delete ${score.name}'s replay (${score.time} seconds)?`
            )
          ) {
            await axios.delete(`/api/boxclicker/score/${replayId}`);
            history.push('/boxclicker/replay');
          }
        }}
      />
    </Container>
  );
};

export default BoxClickerReplayPlayer;
