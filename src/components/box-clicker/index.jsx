import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import random from 'lodash/random';

const BOXES_TO_CLICK = 30;
const COLUMN_COUNT = 8;
const ROW_COUNT = 8;

const Container = styled.div`
    margin: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Controls = styled.div`
    margin-top: 0.5rem;
    label {
        margin-right: 1em;
    }
    input {
        width: 3em;
    }
`;

const BoxGrid = styled.div`
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(${props => props.columns}, auto);
    min-width: ${props => props.width || 100}%;
    justify-items: center;
    justify-content: space-between;
`;

const Box = styled.button`
    width: ${props => props.size || 5}em;
    height: ${props => props.size || 5}em;
    background-color: ${props => (props.active ? 'darkslategrey' : 'white')};
    border: 1px solid black;
`;

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

    const timeTaken = (endTime - startTime) / 1000;
    const boxCount = rowCount * columnCount;

    useEffect(() => {
        if (gameState !== 'done') {
            setActiveBox(random(0, boxCount - 1));
        }
    }, [boxCount]);

    const restartGame = () => {
        setGameState('standby');
        setBoxesClicked(0);
        setActiveBox(random(0, boxCount - 1));
    };

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
                        onChange={e => {
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
                        onChange={e => {
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
                        onChange={e => {
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
                        onChange={e => {
                            setGridWidth(parseInt(e.target.value || 0));
                        }}
                    />
                </label>
            </Controls>
            {gameState === 'done' ? (
                <p>
                    You clicked <span>{boxesToClick}</span> boxes in{' '}
                    <span>{timeTaken.toFixed(3)}</span> seconds (
                    <span>{(boxesToClick / timeTaken).toFixed(3)}</span> boxes
                    per second).
                </p>
            ) : (
                <p>
                    Click the coloured box <span>{boxesToClick}</span> times as
                    fast as you can.
                </p>
            )}
            <BoxGrid columns={columnCount} width={gridWidth}>
                {Array.from(Array(boxCount).keys()).map((_, i) => (
                    <Box
                        key={`box-${i}-of-${boxCount}`}
                        onClick={() => {
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
                                if (newBoxesClicked >= boxesToClick) {
                                    setGameState('done');
                                    setEndTime(new Date());
                                    setActiveBox(-1);
                                }
                                setBoxesClicked(newBoxesClicked);
                            }
                            if (gameState === 'standby') {
                                setGameState('inprogress');
                                setBoxesClicked(1);
                                setStartTime(new Date());
                            }
                        }}
                        active={i === activeBox}
                    />
                ))}
            </BoxGrid>
        </Container>
    );
};

export default BoxClicker;
