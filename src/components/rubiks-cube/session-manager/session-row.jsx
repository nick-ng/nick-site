import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { BASE_LOCAL_STORAGE_KEY } from '../timer/session-selector';

const convertName = name => {
    if (name === BASE_LOCAL_STORAGE_KEY) {
        return 'DEFAULT';
    }
    return name.replace(`${BASE_LOCAL_STORAGE_KEY}-`, '');
};

const Row = styled.tr``;

const Cell = styled.td`
    text-align: ${props => props.alignment || 'right'};
`;

const Checkbox = styled.input.attrs({
    type: 'checkbox',
})``;

const SessionRow = ({
    id,
    sessionName,
    sessionTimes,
    selectedSessions,
    toggleSelectedSessions,
}) => {
    let bestTime = Infinity;
    let dnfs = 0;
    let total = 0;

    sessionTimes.forEach(timeEntry => {
        if (timeEntry.time < bestTime) {
            bestTime = timeEntry.time;
        }
        if (timeEntry.time >= 9001) {
            dnfs++;
        } else {
            total += timeEntry.time;
        }
    });
    const average = total / (sessionTimes.length - dnfs);

    const fullSessionName = `${id}***${sessionName}`;

    return (
        <Row>
            <Cell>
                <Checkbox
                    checked={selectedSessions.includes(fullSessionName)}
                    onChange={() => toggleSelectedSessions(fullSessionName)}
                />
            </Cell>
            <Cell alignment="left">{convertName(sessionName)}</Cell>
            <Cell>{sessionTimes.length}</Cell>
            <Cell>{bestTime.toFixed(2)}</Cell>
            <Cell>{average.toFixed(2)}</Cell>
            <Cell alignment="center">
                <a href={`/cubetimer?session=${convertName(sessionName)}`}>
                    Go
                </a>
            </Cell>
        </Row>
    );
};

export default SessionRow;
