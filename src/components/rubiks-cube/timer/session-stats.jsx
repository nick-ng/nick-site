import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { getCurrentSession } from './session-selector';
import { getTime, bestSingle, bestRollingAoN, lastAverageOfN } from './utils';

const Container = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 0.5em 1em;
    align-content: start;
    margin: 0 0.3em 0.3em;

    @media screen and (max-device-width: 1280px) {
        font-size: 0.8em;
    }
`;

const Heading = styled.h3`
    grid-column: 1 / 5;
    margin: 0.5em 0;
`;

const Full = styled.div`
    grid-column: 1 / 5;
    font-weight: bold;
`;

const Left = styled.div``;

const Right = styled.div`
    text-align: right;
`;

const SessionStats = ({ timerHistory }) => {
    const attemptCount = timerHistory.length;
    const dnfCount = timerHistory.filter(a => getTime(a) > 9000).length;
    const solvePercent = Math.round(
        ((attemptCount - dnfCount) / Math.max(attemptCount, 1)) * 100
    );
    const dnfPercent = Math.round((dnfCount / Math.max(attemptCount, 1)) * 100);
    const solvesThisMonth = timerHistory.filter(a =>
        moment(a.createdAt).isSameOrAfter(moment().startOf('month'))
    );
    const solvesLastMonth = timerHistory.filter(a =>
        moment(a.createdAt).isBetween(
            moment()
                .startOf('month')
                .subtract(1, 'month'),
            moment().startOf('month'),
            'day',
            '[)'
        )
    );
    const solvesToday = timerHistory.filter(a =>
        moment(a.createdAt).isSameOrAfter(moment().startOf('day'))
    );

    return (
        <Container>
            <Heading>{`Stats for ${getCurrentSession().toLowerCase() ||
                'default'}`}</Heading>
            {/* <Left>Attempts:</Left>
            <Right>{timerHistory.length}</Right>
            <Left>Solves (not DNF):</Left>
            <Right>{attemptCount - dnfCount}</Right>
            <Left>Solve% (DNF%)</Left>
            <Right>{`${solvePercent}% (${dnfPercent}%)`}</Right> */}
            <Left>Attempts Today:</Left>
            <Right>
                {
                    timerHistory.filter(a =>
                        moment(a.createdAt).isAfter(moment().startOf('day'))
                    ).length
                }
            </Right>
            <Left />
            <Left />
            <Left />
            <Right>Single</Right>
            <Right>Ao5</Right>
            <Right>Ao12</Right>
            <Left>Best All Time:</Left>
            <Right>{getTime(bestSingle(timerHistory)) || '-'}</Right>
            <Right>{bestRollingAoN(timerHistory, 5)?.average || '-'}</Right>
            <Right>{bestRollingAoN(timerHistory, 12)?.average || '-'}</Right>
            <Left>Best Last Month:</Left>
            <Right>{getTime(bestSingle(solvesLastMonth)) || '-'}</Right>
            <Right>{bestRollingAoN(solvesLastMonth, 5)?.average || '-'}</Right>
            <Right>{bestRollingAoN(solvesLastMonth, 12)?.average || '-'}</Right>
            <Left>Best This Month:</Left>
            <Right>{getTime(bestSingle(solvesThisMonth)) || '-'}</Right>
            <Right>{bestRollingAoN(solvesThisMonth, 5)?.average || '-'}</Right>
            <Right>{bestRollingAoN(solvesThisMonth, 12)?.average || '-'}</Right>
            <Left>Best Today:</Left>
            <Right>{getTime(bestSingle(solvesToday)) || '-'}</Right>
            <Right>{bestRollingAoN(solvesToday, 5)?.average || '-'}</Right>
            <Right>{bestRollingAoN(solvesToday, 12)?.average || '-'}</Right>
            <Left>Current:</Left>
            <Right></Right>
            <Right>{lastAverageOfN(timerHistory, 5) || '-'}</Right>
            <Right>{lastAverageOfN(timerHistory, 12) || '-'}</Right>
        </Container>
    );
};

export default SessionStats;
