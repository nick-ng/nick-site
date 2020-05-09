import React from 'react';
import styled from 'styled-components';
import chunk from 'lodash/chunk';

const Button = styled.button`
    padding: 5px 10px;
    border: solid 1px grey;
    border-radius: 3px;
    color: ${({ invertColours }) => (invertColours ? 'white' : 'black')};
    background-color: ${({ invertColours }) => (invertColours ? 'darkslategrey' : 'white')};
    ${props => (props.invertColours ? 'font-weight: bold;' : '')}
`;

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

const AO5Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 1em 0;

    h3 {
        margin: 0;
    }

    ${Button} {
        margin-left: 1em;
    }
`;

const Times = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
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

const TimerHistory = ({ editTime, removeTime, storeTime, timerHistory, togglePenalty }) => {
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
                        <AO5Header>
                            <h3>{average}</h3>
                            {ao5.length < 5 && (
                                <Button
                                    onClick={e => {
                                        if (e) {
                                            e.target.blur();
                                        }
                                        storeTime(9999, 5 - ao5.length);
                                    }}
                                >
                                    New AO5
                                </Button>
                            )}
                        </AO5Header>
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
                                        onClick={e => {
                                            if (e) {
                                                e.target.blur();
                                            }
                                            togglePenalty(id);
                                        }}
                                        invertColours={penalty}
                                    >
                                        +2
                                    </Button>
                                    <Button
                                        key={`edit-${id}`}
                                        onClick={e => {
                                            if (e) {
                                                e.target.blur();
                                            }
                                            editTime(id);
                                        }}
                                    >
                                        <i className="fa fa-pencil" />
                                    </Button>
                                    <Button
                                        key={`remove-${id}`}
                                        onClick={e => {
                                            if (e) {
                                                e.target.blur();
                                            }
                                            removeTime(id, time < 9001 ? time.toFixed(2) : 'DNF');
                                        }}
                                    >
                                        <i className="fa fa-times" />
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
