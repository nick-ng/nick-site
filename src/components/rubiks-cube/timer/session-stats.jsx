import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { getCurrentSession } from './session-selector';
import { getTime, bestSingle, lastAverageOfN } from './utils';

const Container = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5em;
    align-content: start;
    margin: 0 0.3em 0.3em;

    @media screen and (max-device-width: 1280px) {
        font-size: 0.8em;
    }
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
    const attemptCount = timerHistory.length;
    const dnfCount = timerHistory.filter(a => getTime(a) > 9000).length;
    const solvePercent = Math.round(((attemptCount - dnfCount) / Math.max(attemptCount, 1)) * 100);
    const dnfPercent = Math.round((dnfCount / Math.max(attemptCount, 1)) * 100);
    return (
        <Container>
            <Heading>Session Stats</Heading>
            <Left>Session:</Left>
            <Right>{getCurrentSession().toLowerCase() || 'default'}</Right>
            <Left>Attempts:</Left>
            <Right>{timerHistory.length}</Right>
            <Left>Solves (not DNF):</Left>
            <Right>{attemptCount - dnfCount}</Right>
            <Left>Solve% (DNF%)</Left>
            <Right>{`${solvePercent}% (${dnfPercent}%)`}</Right>
            <Left>Attempts Today:</Left>
            <Right>
                {
                    timerHistory.filter(a => moment(a.createdAt).isAfter(moment().startOf('day')))
                        .length
                }
            </Right>
            <Left>Best Single:</Left>
            <Right>{getTime(bestSingle(timerHistory))}</Right>
            <Left>Ao12</Left>
            <Right>{lastAverageOfN(timerHistory, 12)}</Right>
        </Container>
    );
};

export default SessionStats;
