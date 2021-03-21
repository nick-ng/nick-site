import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {
  BarChart,
  Bar,
  Legend,
  LineChart,
  Label,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ResponsiveContainer,
} from 'recharts';

import Loading from '../../loading';
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
      dataTimes: [],
      dataTries: [],
      loading: false,
    };

    this.graph1Ref = React.createRef();
    this.graph2Ref = React.createRef();
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const session = await getArray(getSessionStorageKey());
    this.setState({
      session,
      ...this.prepareData(session),
      loading: false,
    });
  }

  prepareData(session) {
    const groupNames = [
      'Best Single of the Day',
      'Best Ao5 of the Day',
      'Best Ao12 of the Day',
    ];

    const dataTimes = solvesByDay(session)
      .filter((a) => a.length > 0)
      .map((daySolves) => {
        const a = {};
        if (daySolves.length > 0) {
          const bestSingleSolve = bestSingle(daySolves);
          if (bestSingleSolve) {
            a.timestamp = dayjs(bestSingleSolve.createdAt)
              .startOf('day')
              .valueOf();
            a.single_day = parseFloat(bestSingleSolve.time);
          }
        }

        if (daySolves.length >= 5) {
          const bestAverage5 = bestRollingAoN(daySolves, 5);
          if (bestAverage5 && bestAverage5.average < 3000) {
            a.timestamp = dayjs(bestAverage5.createdAt)
              .startOf('day')
              .valueOf();
            a.ao5_day = parseFloat(bestAverage5.average);
          }
        }

        if (daySolves.length >= 12) {
          const bestAverage12 = bestRollingAoN(daySolves, 12);
          if (bestAverage12 && bestAverage12.average < 3000) {
            a.timestamp = dayjs(bestAverage12.createdAt)
              .startOf('day')
              .valueOf();
            a.ao12_day = parseFloat(bestAverage12.average);
          }
        }

        return a;
      });

    const dataTries = solvesByDay(session)
      .filter((a) => a.length > 0)
      .map((daySolves) => {
        return {
          timestamp: dayjs(daySolves[daySolves.length - 1].createdAt)
            .startOf('day')
            .valueOf(),
          tries: daySolves.length,
        };
      });
    console.log('dataTries', dataTries);
    return {
      dataTimes,
      dataTries,
    };
  }

  render() {
    const { dataTimes, dataTries, session, loading } = this.state;

    const newestTimestamp = Math.max(...dataTimes.map((a) => a.timestamp));
    const timestampThreshold = newestTimestamp - 1000 * 60 * 60 * 24 * 37;

    return (
      <Container>
        <SideStuff>
          <SessionStats timerHistory={session} />
          <hr />
          <SessionSelector hideNew />
        </SideStuff>
        {loading ? (
          <Loading />
        ) : (
          <Graphs>
            <ResponsiveContainer height={400}>
              <LineChart
                data={dataTimes.filter(
                  (a) => a.timestamp >= timestampThreshold
                )}
              >
                <CartesianGrid stroke="#dddddd" />
                <Legend layout="vertical" />
                <XAxis
                  type="number"
                  dataKey="timestamp"
                  height={45}
                  domain={[
                    timestampThreshold + 1000 * 60 * 60 * 24 * 2,
                    Date.now(),
                  ]}
                  tickFormatter={(timestamp) =>
                    dayjs(timestamp).format('D MMM')
                  }
                  allowDataOverflow
                >
                  <Label value="Date" position="insideBottom" />
                </XAxis>
                <YAxis
                  type="number"
                  unit=" s"
                  width={70}
                  domain={['auto', 'auto']}
                >
                  <Label value="Seconds" position="insideLeft" angle={270} />
                </YAxis>
                <Tooltip
                  labelFormatter={(timestamp) =>
                    dayjs(timestamp).format('D MMM')
                  }
                />
                <Line
                  name="Best Single"
                  key="single_day"
                  type="monotone"
                  dataKey="single_day"
                  stroke="green"
                  strokeOpacity={1}
                ></Line>
                <Line
                  name="Best Ao5"
                  key="ao5_day"
                  type="monotone"
                  dataKey="ao5_day"
                  stroke="blue"
                  strokeOpacity={1}
                ></Line>
                <Line
                  name="Best Ao12"
                  key="ao12_day"
                  type="monotone"
                  dataKey="ao12_day"
                  stroke="red"
                  strokeOpacity={1}
                ></Line>
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer height={400}>
              <BarChart
                data={dataTries.filter(
                  (a) => a.timestamp >= timestampThreshold
                )}
              >
                <CartesianGrid stroke="#dddddd" />
                <XAxis
                  type="number"
                  dataKey="timestamp"
                  height={45}
                  domain={[
                    timestampThreshold + 1000 * 60 * 60 * 24 * 2,
                    Date.now(),
                  ]}
                  tickFormatter={(timestamp) =>
                    dayjs(timestamp).format('D MMM')
                  }
                  allowDataOverflow
                >
                  <Label value="Date" position="insideBottom" />
                </XAxis>
                <YAxis type="number" width={70} domain={[0, 'auto']} />
                <Tooltip
                  labelFormatter={(timestamp) =>
                    dayjs(timestamp).format('D MMM')
                  }
                />
                <Bar
                  name="Tries"
                  key="tries"
                  type="monotone"
                  dataKey="tries"
                  stroke="green"
                  fill="green"
                />
              </BarChart>
            </ResponsiveContainer>
          </Graphs>
        )}
      </Container>
    );
  }
}
