import React from 'react';
import styled from 'styled-components';

import { getCurrentSession } from './session-selector';
import { getTime, bestSingle, lastAverageOfN } from './utils';

const Container = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5em;
    align-content: start;
`;

const Heading = styled.h3`
    grid-column: 1 / 3;
    margin: 0.5em 0;
`;

const Left = styled.div``;

const Right = styled.div`
    text-align: right;
`;

const SessionStats = ({ timerHistory }) => {
    return (
        <Container>
            <Heading>Session Stats</Heading>
            <Left>Session:</Left>
            <Right>{getCurrentSession().toLowerCase() || 'default'}</Right>
            <Left>Solves:</Left>
            <Right>{timerHistory.length}</Right>
            <Left>Solves without DNFs:</Left>
            <Right>{timerHistory.filter(a => getTime(a) < 9001).length}</Right>
            <Left>Best Single:</Left>
            <Right>{getTime(bestSingle(timerHistory))}</Right>
            <Left>Ao12</Left>
            <Right>{lastAverageOfN(timerHistory, 12)}</Right>
        </Container>
    );
};

export default SessionStats;
