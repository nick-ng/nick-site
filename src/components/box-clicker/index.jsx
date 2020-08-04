import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import random from 'lodash/random';
import axios from 'axios';

import ScoreDisplay from './score-display';

const BOXES_TO_CLICK = 30;
const COLUMN_COUNT = 8;
const ROW_COUNT = 8;

const Container = styled.div`
  position: relative;
  margin: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Controls = styled.div`
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
    width: 3em;
  }
`;

const BoxGrid = styled.div`
  margin-top: 0.5rem;
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(${(props) => props.columns}, auto);
  min-width: ${(props) => props.width || 100}%;
  justify-items: center;
  justify-content: space-between;
`;

const Box = styled.button`
  width: ${(props) => props.size || 5}em;
  height: ${(props) => props.size || 5}em;
  background-color: ${(props) => (props.active ? 'darkslategrey' : 'white')};
  border: 1px solid black;
`;

const makeSound = (synth, phrase) => {
  const utterance = new SpeechSynthesisUtterance(phrase);
  synth.speak(utterance);
};

const BoxClicker = () => {
  const [rowCount, setRowCount] = useState(ROW_COUNT);
  const [columnCount, setColumnCount] = useState(COLUMN_COUNT);
  const [activeBox, setActiveBox] = useState(-1);
  const [boxesClicked, setBoxesClicked] = useState(0);
  const [boxesToClick, setBoxesToClick] = useState(BOXES_TO_CLICK);
  const [gridWidth, setGridWidth] = useState(1);
  const [gameState, setGameState] = useState('standby');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundStuff, setSoundStuff] = useState({});
  const [loadingScores, setLoadingScores] = useState(true);
  const [scores, setScores] = useState([]);

  const timeTaken = (endTime - startTime) / 1000;
  const boxCount = rowCount * columnCount;

  const restartGame = () => {
    setGameState('standby');
    setBoxesClicked(0);
    setActiveBox(random(0, boxCount - 1));
  };

  const defaultSettings = () => {
    setBoxesToClick(30);
    setRowCount(8);
    setColumnCount(8);
    setGridWidth(1);
  };

  const updateScores = async () => {
    setLoadingScores(true);
    const res = await axios.get('api/boxclicker/scores');
    setScores(res.data.allScores);
    setLoadingScores(false);
  };

  const isDefaultSettings =
    boxesToClick === 30 &&
    rowCount === 8 &&
    columnCount === 8 &&
    gridWidth === 1;

  useEffect(() => {
    restartGame();
  }, [rowCount, columnCount, boxesToClick, gridWidth]);

  useEffect(() => {
    setSoundStuff({
      synth: window.speechSynthesis,
    });
    updateScores();
  }, []);

  useEffect(() => {
    if (gameState !== 'done') {
      setActiveBox(random(0, boxCount - 1));
    }
  }, [boxCount]);

  useEffect(() => {
    const submitTime = async () => {
      if (gameState === 'done' && isDefaultSettings) {
        const temp = prompt(
          `You finished in ${timeTaken.toFixed(
            2
          )} seconds! Please enter your name for the high score board.`
        );
        setLoadingScores(true);
        await axios.post('api/boxclicker/score', {
          name: temp,
          time: timeTaken,
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
            }}
          />
        </label>
        <label>
          Grid Width:{' '}
          <input
            type="number"
            step={1}
            value={gridWidth}
            min={0}
            max={100}
            onChange={(e) => {
              setGridWidth(parseInt(e.target.value || 0));
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
          Click the coloured box <span>{boxesToClick}</span> times as it moves
          around.
        </div>
      )}
      <div>Play the game on default settings to set a high score.</div>
      <BoxGrid columns={columnCount} width={gridWidth}>
        {Array.from(Array(boxCount).keys()).map((_, i) => (
          <Box
            key={`box-${i}-of-${boxCount}`}
            onClick={async () => {
              let whatToSay = null;
              if (i === activeBox && gameState !== 'done') {
                let temp = random(0, boxCount - 2);
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
                  } in ${((new Date() - startTime) / 1000).toFixed(
                    1
                  )} seconds.`;
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
            active={i === activeBox}
          />
        ))}
      </BoxGrid>
      <ScoreDisplay scores={scores} isLoading={loadingScores} />
    </Container>
  );
};

export default BoxClicker;
