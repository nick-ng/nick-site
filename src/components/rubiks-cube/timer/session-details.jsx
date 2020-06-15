import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Graph2d, DataSet } from 'vis-timeline/standalone';

import { getItem } from '../../../services/foreignStorage';
import { solvesByDay, bestRollingAoN, firstAoNByDay, rollingAoN } from './utils';
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
            graphp1: null,
        };

        this.graph1Ref = React.createRef();
    }

    async componentDidMount() {
        const sessionJSONString = await getItem(getSessionStorageKey());
        if (sessionJSONString) {
            this.setState(
                {
                    session: JSON.parse(sessionJSONString),
                },
                this.makeGraphs
            );
        }
    }

    makeGraphs() {
        const { session } = this.state;

        const groupNames = ['Rolling Ao12s', 'Best Ao12 of the Day', 'First Ao5 of the Day'];

        const graphData = new DataSet([
            ...rollingAoN(session, 12).map(solve => ({
                x: moment(solve.createdAt),
                y: parseFloat(solve.average),
                group: groupNames[0],
            })),
            ...solvesByDay(session)
                .filter(a => a.length >= 12)
                .map(daySolves => {
                    const bestAverage = bestRollingAoN(daySolves);
                    return {
                        x: moment(bestAverage.createdAt),
                        y: parseFloat(bestAverage.average),
                        group: groupNames[1],
                    };
                }),
            ...firstAoNByDay(session, 5).map(solve => ({
                x: moment(solve.createdAt),
                y: parseFloat(solve.average),
                group: groupNames[2],
            })),
        ]);

        const options = {
            defaultGroup: '',
            interpolation: false,
            legend: { left: { position: 'top-right' } },
        };

        // Create a Timeline
        const graphp1 = new Graph2d(this.graph1Ref.current, graphData, options);
        this.setState({
            graphp1,
        });
    }

    render() {
        const { session } = this.state;

        return (
            <Container>
                <SideStuff>
                    <SessionStats timerHistory={session} />
                    <hr />
                    <SessionSelector hideNew />
                </SideStuff>
                <Graphs>
                    <h3>Session Graphs</h3>
                    <div ref={this.graph1Ref} />
                </Graphs>
            </Container>
        );
    }
}
