import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Graph2d, DataSet } from 'vis-timeline/standalone';

import { getArray } from '../../../services/foreignStorage';
import {
    solvesByDay,
    bestRollingAoN,
    bestSingle,
    firstAoNByDay,
    rollingAoN,
} from './utils';
import SessionSelector, { getSessionStorageKey } from './session-selector';
import SessionStats from './session-stats';

const Container = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5em;
    margin: 0.3em 0 0;
`;

const SideStuff = styled.div``;

const Graphs = styled.div``;

export default class CubeTimer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            session: [],
            graph1: null,
            graph2: null,
            loading: false,
        };

        this.graph1Ref = React.createRef();
        this.graph2Ref = React.createRef();
    }

    async componentDidMount() {
        this.setState({ loading: true });
        this.setState(
            {
                session: await getArray(getSessionStorageKey()),
                loading: false,
            },
            this.makeGraphs
        );
    }

    makeGraphs() {
        const { session } = this.state;

        const groupNames = [
            'Best Single of the Day',
            'Best Ao5 of the Day',
            'Best Ao12 of the Day',
        ];

        const graph1Data = new DataSet([
            ...solvesByDay(session)
                .filter(a => a.length > 0)
                .map(daySolves => {
                    const bestSingleSolve = bestSingle(daySolves);
                    return bestSingleSolve
                        ? {
                              x: moment(bestSingleSolve.createdAt),
                              y: parseFloat(bestSingleSolve.time),
                              group: groupNames[0],
                          }
                        : { y: 9999 };
                })
                .filter(a => a.y < 9000),
            ...solvesByDay(session)
                .filter(a => a.length >= 5)
                .map(daySolves => {
                    const bestAverage = bestRollingAoN(daySolves, 5);
                    return bestAverage && bestAverage.average < 3000
                        ? {
                              x: moment(bestAverage.createdAt),
                              y: parseFloat(bestAverage.average),
                              group: groupNames[1],
                          }
                        : { y: 9999 };
                })
                .filter(a => a.y < 3000),
            ...solvesByDay(session)
                .filter(a => a.length >= 12)
                .map(daySolves => {
                    const bestAverage = bestRollingAoN(daySolves, 12);
                    return bestAverage && bestAverage.average < 3000
                        ? {
                              x: moment(bestAverage.createdAt),
                              y: parseFloat(bestAverage.average),
                              group: groupNames[2],
                          }
                        : { y: 9999 };
                })
                .filter(a => a.y < 3000),
        ]);

        const options1 = {
            start: moment()
                .startOf('day')
                .subtract(1, 'week'),
            end: moment().endOf('day'),
            defaultGroup: '',
            interpolation: false,
            legend: { left: { position: 'bottom-left' } },
        };

        const graph1 = new Graph2d(
            this.graph1Ref.current,
            graph1Data,
            options1
        );

        const graph2Data = new DataSet([
            ...solvesByDay(session)
                .filter(a => a.length > 0)
                .map(daySolves => {
                    return {
                        x: moment(
                            daySolves[daySolves.length - 1].createdAt
                        ).startOf('day'),
                        y: daySolves.length,
                    };
                }),
        ]);

        const options2 = {
            style: 'bar',
            start: moment()
                .startOf('day')
                .subtract(2, 'week'),
            end: moment().endOf('day'),
            barChart: { width: 50, align: 'right' },
            drawPoints: false,
        };

        const graph2 = new Graph2d(
            this.graph2Ref.current,
            graph2Data,
            options2
        );

        this.setState({
            graph1,
            graph2,
        });
    }

    render() {
        const { session, loading } = this.state;

        return (
            <Container>
                <SideStuff>
                    <SessionStats timerHistory={session} />
                    <hr />
                    <SessionSelector hideNew />
                </SideStuff>
                <Graphs>
                    {loading && <p>Loading...</p>}
                    <h3>Best Times</h3>
                    <div ref={this.graph1Ref} />
                    <h3>Solves Per Day</h3>
                    <div ref={this.graph2Ref} />
                </Graphs>
            </Container>
        );
    }
}
