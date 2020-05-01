import React from 'react';
import styled from 'styled-components';
import chunk from 'lodash/chunk';

const TimerHistoryContainer = styled.div`
    margin-top: 10px;
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    justify-content: space-around;
    align-self: stretch;
`;

const AO5 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Times = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    gap: 0.5em;
    align-items: center;
`;

const Time = styled.div`
    justify-self: end;
    position: relative;
    white-space: nowrap;
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
    padding: 5px 10px;
    border: solid 1px grey;
    border-radius: 3px;
    color: ${({ invertColours }) => (invertColours ? 'white' : 'black')};
    background-color: ${({ invertColours }) => (invertColours ? 'darkslategrey' : 'white')};
    ${props => (props.invertColours ? 'font-weight: bold;' : '')}
`;

const TimerHistory = ({ removeTime, timerHistory, togglePenalty }) => {
    const ao5s = chunk(
        timerHistory.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateA - dateB;
        }),
        5
    ).reverse();

    return (
        <TimerHistoryContainer>
            {ao5s.slice(0, 5).map(ao5 => {
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
                    average = ao5
                        .reduce((a, c) => a + (c.time + (c.penalty ? 2 : 0)) / ao5.length, 0)
                        .toFixed(2);
                }

                return (
                    <AO5 key={ao5.map(a => a.id).join('-')}>
                        <h3>{average}</h3>
                        <Times>
                            {ao5.map(({ id, time, scramble, penalty }) => (
                                <>
                                    <Time
                                        key={`time-${id}`}
                                        fastest={id === fastestId}
                                        slowest={id === slowestId}
                                    >
                                        {time < 9001 ? time.toFixed(2) : 'DNF'}
                                        <ScrambleTooltip>
                                            <span>{scramble}</span>
                                        </ScrambleTooltip>
                                    </Time>
                                    <Button
                                        key={`penalty-toggle-${id}`}
                                        onClick={() => togglePenalty(id)}
                                        invertColours={penalty}
                                    >
                                        +2
                                    </Button>
                                    <Button key={`remove-${id}`} onClick={() => removeTime(id)}>
                                        X
                                    </Button>
                                </>
                            ))}
                        </Times>
                    </AO5>
                );
            })}
        </TimerHistoryContainer>
    );
};

export default TimerHistory;
