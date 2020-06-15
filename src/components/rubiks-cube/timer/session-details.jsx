import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Graph2d, DataSet } from 'vis-timeline/standalone';

import { getItem } from '../../../services/foreignStorage';
import { firstAoNByDay, rollingAoN } from './utils';
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

        const groups = new DataSet();

        const groupNames = ['Rolling Ao12s', 'First Ao5 of the Day'];

        const graphData = new DataSet([
            ...rollingAoN(session, 12).map(solve => ({
                id: solve.id,
                x: moment(solve.createdAt),
                y: parseFloat(solve.average),
                group: groupNames[0],
            })),
            ...firstAoNByDay(session, 5).map(solve => ({
                id: solve.id,
                x: moment(solve.createdAt),
                y: parseFloat(solve.average),
                group: groupNames[1],
            })),
        ]);

        const options = { defaultGroup: '', legend: { left: { position: 'top-right' } } };

        // Create a Timeline
        const graphp1 = new Graph2d(this.graph1Ref.current, graphData, groups, options);
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
