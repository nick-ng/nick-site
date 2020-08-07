import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import seedrandom from 'seedrandom';

import { getMouseRelativePosition } from './utils';
import BoxGrid from './box-grid';
import ScoreDisplay from './score-display';

export const BOXES_TO_CLICK = 30;
export const COLUMN_COUNT = 8;
export const ROW_COUNT = 8;
export const GRID_GAP = 15;
const CLOCK_TICK_DELAY = 50;

const Container = styled.div`
  position: relative;
  margin: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Controls = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: row;
  label {
    margin-right: 1em;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  input[type='number'] {
    text-align: right;
    width: 5em;
  }
`;

let rng = () => 0;

const randInt = (min, max) => Math.floor(rng() * (max - min + 1)) + min;

const makeSound = (synth, phrase) => {
  const utterance = new SpeechSynthesisUtterance(phrase);
  synth.speak(utterance);
};

let mousePosition = { x: 0, y: 0 };

const mouseMoveHandler = (e) => {
  const { x, y } = getMouseRelativePosition(e);
  mousePosition = {
    x,
    y,
  };
};

const shortenHistory = (history) => {
  let newHistory = [...history];
  let counter = 1;
  while (newHistory.length > 2000) {
    newHistory = history.filter((_, i) => !(i % counter));
    counter++;
  }

  return newHistory;
};

const BoxClicker = () => {
  const [rowCount, setRowCount] = useState(ROW_COUNT);
  const [columnCount, setColumnCount] = useState(COLUMN_COUNT);
  const [activeBox, setActiveBox] = useState(-1);
  const [boxesClicked, setBoxesClicked] = useState(0);
  const [boxesToClick, setBoxesToClick] = useState(BOXES_TO_CLICK);
  const [gridGap, setGridGap] = useState(GRID_GAP);
  const [gameState, setGameState] = useState('standby');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundStuff, setSoundStuff] = useState({});
  const [loadingScores, setLoadingScores] = useState(true);
  const [scores, setScores] = useState([]);
  const [clockTick, setClockTick] = useState(0);
  const [gameSeed, setGameSeed] = useState(0);
  const [mouseMoveHistory, setMouseMoveHistory] = useState([]);
  const [mouseClickHistory, setMouseClickHistory] = useState([]);

  const timeTaken = (endTime - startTime) / 1000;
  const boxCount = rowCount * columnCount;

  const restartGame = () => {
    setTimeout(() => {
      setGameState('standby');
      setBoxesClicked(0);
      const newSeed = uuid();
      rng = seedrandom(newSeed);
      setGameSeed(newSeed);
      setActiveBox(randInt(0, boxCount - 1));
      setMouseMoveHistory([]);
      setMouseClickHistory([]);
    });
  };

  const defaultSettings = () => {
    setBoxesToClick(BOXES_TO_CLICK);
    setRowCount(ROW_COUNT);
    setColumnCount(COLUMN_COUNT);
    setGridGap(GRID_GAP);
    restartGame();
  };

  const updateScores = async () => {
    setLoadingScores(true);
    const res = await axios.get('api/boxclicker/scores');
    setScores(res.data.allScores);
    setLoadingScores(false);
  };

  const isDefaultSettings =
    boxesToClick === BOXES_TO_CLICK &&
    rowCount === ROW_COUNT &&
    columnCount === COLUMN_COUNT &&
    gridGap === GRID_GAP;

  useEffect(() => {
    setSoundStuff({
      synth: window.speechSynthesis,
    });
    updateScores();

    const clockInterval = setInterval(() => {
      setClockTick(Date.now());
    }, CLOCK_TICK_DELAY);

    restartGame();

    return () => {
      clearInterval(clockInterval);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'done') {
      setActiveBox(randInt(0, boxCount - 1));
    }
  }, [boxCount]);

  useEffect(() => {
    if (gameState === 'inprogress') {
      setMouseMoveHistory(
        shortenHistory(mouseMoveHistory).concat([
          {
            ...mousePosition,
            timestamp: clockTick,
          },
        ])
      );
    }
  }, [clockTick]);

  useEffect(() => {
    const submitTime = async () => {
      if (gameState === 'done' && isDefaultSettings) {
        const temp =
          prompt(
            `You finished in ${timeTaken.toFixed(
              2
            )} seconds! Please enter your name for the high score board.`
          ) || '';
        setLoadingScores(true);
        await axios.post('api/boxclicker/score', {
          name: temp,
          time: timeTaken,
          start: startTime,
          end: endTime,
          seed: gameSeed,
          moveHistory: JSON.stringify(shortenHistory(mouseMoveHistory)),
          clickHistory: JSON.stringify(shortenHistory(mouseClickHistory)),
          accuracy: 1000,
        });
        updateScores();
      }
    };
    setTimeout(submitTime, 500);
  }, [gameState]);

  return (
    <Container>
      <h1>Box Clicker</h1>
      <button onClick={restartGame}>Restart Game</button>
      <Controls>
        <label>
          Boxes to Click:{' '}
          <input
            type="number"
            step={1}
            min={1}
            max={9999999}
            value={boxesToClick}
            onChange={(e) => {
              setBoxesToClick(parseInt(e.target.value || 1));
              restartGame();
            }}
          />
        </label>
        <label>
          Rows:{' '}
          <input
            type="number"
            step={1}
            value={rowCount}
            min={1}
            max={100}
            onChange={(e) => {
              setRowCount(parseInt(e.target.value || 1));
              restartGame();
            }}
          />
        </label>
        <label>
          Columns:{' '}
          <input
            type="number"
            step={1}
            value={columnCount}
            min={1}
            max={100}
            onChange={(e) => {
              setColumnCount(parseInt(e.target.value || 2));
              restartGame();
            }}
          />
        </label>
        <label>
          Grid Spacing:{' '}
          <input
            type="number"
            step={1}
            value={gridGap}
            min={0}
            max={1000}
            onChange={(e) => {
              setGridGap(parseInt(e.target.value || 0));
              restartGame();
            }}
          />
        </label>
        <label>
          Sound:{' '}
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={() => {
              setSoundEnabled(!soundEnabled);
            }}
          />
        </label>
        <button disabled={isDefaultSettings} onClick={defaultSettings}>
          Default Settings
        </button>
      </Controls>
      {gameState === 'done' ? (
        <div>
          You clicked <span>{boxesToClick}</span> boxes in{' '}
          <span>{timeTaken.toFixed(3)}</span> seconds (
          <span>{(boxesToClick / timeTaken).toFixed(3)}</span> boxes per
          second).
        </div>
      ) : (
        <div>
          Click the dark coloured box <span>{boxesToClick}</span> times as it
          moves around. Play the game on default settings to set a high score.
        </div>
      )}
      <BoxGrid
        columns={columnCount}
        gap={gridGap}
        boxCount={boxCount}
        activeBox={activeBox}
        mouseMoveHandler={mouseMoveHandler}
        boxClickHandler={async (e, i) => {
          let whatToSay = null;
          if (i === activeBox && gameState !== 'done') {
            setMouseClickHistory(
              mouseClickHistory.concat([
                {
                  ...mousePosition,
                  timestamp: Date.now(),
                },
              ])
            );
            let temp = randInt(0, boxCount - 2);
            if (boxCount === 1) {
              temp = 0;
            } else if (temp >= i) {
              temp = temp + 1;
            }
            setActiveBox(temp);
          }
          if (i === activeBox && gameState === 'inprogress') {
            const newBoxesClicked = boxesClicked + 1;
            whatToSay =
              boxesToClick - newBoxesClicked === 1
                ? `1 box to go.`
                : `${boxesToClick - newBoxesClicked} boxes to go.`;
            if (newBoxesClicked >= boxesToClick) {
              setGameState('done');
              setEndTime(new Date());
              setActiveBox(-1);

              whatToSay = `0 boxes to go. Nice work. You clicked ${boxesToClick} ${
                boxesToClick === 1 ? 'box' : 'boxes'
              } in ${((new Date() - startTime) / 1000).toFixed(1)} seconds.`;
            }
            setBoxesClicked(newBoxesClicked);
          }
          if (gameState === 'standby') {
            setGameState('inprogress');
            setBoxesClicked(1);
            setStartTime(new Date());
            whatToSay =
              boxesToClick - 1 === 1
                ? `1 box to go.`
                : `${boxesToClick - 1} boxes to go.`;
          }
          if (soundEnabled && whatToSay) {
            const { synth } = soundStuff;
            makeSound(synth, whatToSay);
          }
        }}
      />
      <ScoreDisplay scores={scores} isLoading={loadingScores} />
    </Container>
  );
};

export default BoxClicker;
