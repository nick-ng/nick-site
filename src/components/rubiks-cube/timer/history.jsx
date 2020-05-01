import React from 'react';
import styled from 'styled-components';
import chunk from 'lodash/chunk';

const TimerHistoryContainer = styled.div`
    margin-top: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 25px;
`;

const AO5 = styled.div`
    display: flex;
    flex-direction: column;
`;

const Time = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${props => {
        if (props.fastest) {
            return 'red';
        }
        if (props.slowest) {
            return 'blue';
        }
        return 'black';
    }};
`;

const ScrambleTooltip = styled.div`
    position: absolute;
    display: none;

    pointer-events: none;
    bottom: 110%;
    white-space: nowrap;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 1;

    span {
        border: solid 1px grey;
        background-color: white;
        padding: 0.5rem;
    }

    ${Time}:hover & {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
`;

const Button = styled.button`
    margin-left: 10px;
`;

const TimerHistory = ({ removeTime, timerHistory, togglePenalty }) => {
    const ao5s = chunk(
        timerHistory.sort((a, b) => -new Date(a.createdAt) + new Date(b.createdAt)),
        5
    ).reverse();

    return (
        <TimerHistoryContainer>
            {ao5s.map(ao5 => {
                let average = null;
                let fastestId = null;
                let slowestId = null;
                if (ao5.length === 5) {
                    const sortedTimes = [...ao5].sort(
                        (a, b) => a.time + (a.penalty ? 2 : 0) - (b.time + (b.penalty ? 2 : 0))
                    );
                    const [fastest, a, b, c, slowest] = sortedTimes;
                    fastestId = fastest.id;
                    slowestId = slowest.id;
                    average = (
                        (a.time +
                            (a.penalty ? 2 : 0) +
                            b.time +
                            (b.penalty ? 2 : 0) +
                            c.time +
                            (c.penalty ? 2 : 0)) /
                        3
                    ).toFixed(2);
                } else {
                    average = ao5.reduce((a, c) => a + c.time / ao5.length, 0).toFixed(2);
                }

                return (
                    <AO5 key={ao5.map(a => a.id).join('-')}>
                        <h3>{average}</h3>
                        {ao5.map(({ id, time, scramble, penalty }) => (
                            <Time key={id} fastest={id === fastestId} slowest={id === slowestId}>
                                <ScrambleTooltip>
                                    <span>{scramble}</span>
                                </ScrambleTooltip>
                                <span>
                                    {time < 9001
                                        ? `${time.toFixed(2)}${penalty ? ' + 2' : ''}`
                                        : 'DNF'}
                                </span>
                                <Button onClick={() => togglePenalty(id)}>+2</Button>
                                <Button onClick={() => removeTime(id)}>X</Button>
                            </Time>
                        ))}
                    </AO5>
                );
            })}
        </TimerHistoryContainer>
    );
};

export default TimerHistory;
