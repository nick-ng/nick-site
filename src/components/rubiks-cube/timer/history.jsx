import React from 'react';
import styled from 'styled-components';
import chunk from 'lodash/chunk';

const TimerHistoryContainer = styled.div`
    margin-top: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
`;

const AO5 = styled.div`
    display: flex;
    flex-direction: column;
`;

const Time = styled.div`
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

const RemoveButton = styled.button`
    margin-left: 10px;
`;

const TimerHistory = ({ removeTime, timerHistory }) => {
    const ao5s = chunk(
        timerHistory.sort((a, b) => -new Date(a.time) + new Date(b.time)),
        5
    ).reverse();

    return (
        <TimerHistoryContainer>
            {ao5s.map(ao5 => {
                let ao5Time = null;
                let fastestId = null;
                let slowestId = null;
                if (ao5.length === 5) {
                    const sortedTimes = [...ao5].sort((a, b) => a.time - b.time);
                    const [fastest, a, b, c, slowest] = sortedTimes;
                    fastestId = fastest.id;
                    slowestId = slowest.id;
                    ao5Time = ((a.time + b.time + c.time) / 3).toFixed(2);
                }

                return (
                    <AO5 key={ao5.map(a => a.id).join('-')}>
                        {ao5Time && <h3>{ao5Time}</h3>}
                        {ao5.map(({ id, time }) => (
                            <Time key={id} fastest={id === fastestId} slowest={id === slowestId}>
                                <span>{time.toFixed(2)}</span>
                                <RemoveButton onClick={() => removeTime(id)}>X</RemoveButton>
                            </Time>
                        ))}
                    </AO5>
                );
            })}
        </TimerHistoryContainer>
    );
};

export default TimerHistory;
