import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {
  BarChart,
  Bar,
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
import { solvesByDay, bestRollingAoN, bestSingle } from './utils';
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
const DateRangeControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.5em 0;
`;

const prepareData = (session) => {
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
          a.timestamp = dayjs(bestAverage5.createdAt).startOf('day').valueOf();
          a.ao5_day = parseFloat(bestAverage5.average);
        }
      }

      if (daySolves.length >= 12) {
        const bestAverage12 = bestRollingAoN(daySolves, 12);
        if (bestAverage12 && bestAverage12.average < 3000) {
          a.timestamp = dayjs(bestAverage12.createdAt).startOf('day').valueOf();
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

  return {
    dataTimes,
    dataTries,
  };
};

export default function CubeTimer() {
  const [session, setSession] = useState([]);
  const [dataTimes, setDataTimes] = useState([]);
  const [dataTries, setDataTries] = useState([]);
  const [timestampThreshold, setTimestampThreshold] = useState(0);
  const [startDate, setStartDate] = useState('2000-01-01');
  const [endDate, setEndDate] = useState('2000-01-02');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      const newSession = await getArray(getSessionStorageKey());

      setSession(newSession);
      const preparedData = prepareData(newSession);
      const thresholdA =
        Math.max(...preparedData.dataTimes.map((a) => a.timestamp)) -
        1000 * 60 * 60 * 24 * 37;

      setDataTimes(preparedData.dataTimes);
      setDataTries(preparedData.dataTries);
      setTimestampThreshold(thresholdA);
      setStartDate(
        dayjs(thresholdA + 1000 * 60 * 60 * 24 * 2).format('YYYY-MM-DD')
      );
      setEndDate(dayjs().endOf('day').format('YYYY-MM-DD'));
      setLoading(false);
    };
    fetchSession();
  }, []);

  const resetDateRange = () => {
    setStartDate(
      dayjs(timestampThreshold + 1000 * 60 * 60 * 24 * 2).format('YYYY-MM-DD')
    );
    setEndDate(dayjs().endOf('day').format('YYYY-MM-DD'));
  };

  const domain = [
    dayjs(startDate).valueOf() || 'auto',
    dayjs(endDate).valueOf() || 'auto',
  ];

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
          <DateRangeControls>
            Date Range:&nbsp;
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
            &nbsp;to&nbsp;
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
            <button onClick={resetDateRange}>Reset</button>
          </DateRangeControls>
          <ResponsiveContainer height={400}>
            <LineChart
              data={dataTimes.filter(
                (a) =>
                  (!startDate || a.timestamp >= dayjs(startDate).valueOf()) &&
                  (!endDate ||
                    a.timestamp <= dayjs(endDate).endOf('day').valueOf())
              )}
            >
              <CartesianGrid stroke="#dddddd" />
              <XAxis
                type="number"
                dataKey="timestamp"
                height={45}
                domain={domain}
                tickFormatter={(timestamp) => dayjs(timestamp).format('D MMM')}
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
                labelFormatter={(timestamp) => dayjs(timestamp).format('D MMM')}
              />
              <Line
                name="Best Single"
                key="single_day"
                type="monotone"
                dataKey="single_day"
                stroke="green"
                strokeOpacity={1}
                connectNulls
              ></Line>
              <Line
                name="Best Ao5"
                key="ao5_day"
                type="monotone"
                dataKey="ao5_day"
                stroke="blue"
                strokeOpacity={1}
                connectNulls
              ></Line>
              <Line
                name="Best Ao12"
                key="ao12_day"
                type="monotone"
                dataKey="ao12_day"
                stroke="red"
                strokeOpacity={1}
                connectNulls
              ></Line>
            </LineChart>
          </ResponsiveContainer>
          <ResponsiveContainer height={400}>
            <BarChart
              data={dataTries.filter(
                (a) =>
                  (!startDate || a.timestamp >= dayjs(startDate).valueOf()) &&
                  (!endDate ||
                    a.timestamp <= dayjs(endDate).endOf('day').valueOf())
              )}
            >
              <CartesianGrid stroke="#dddddd" />
              <XAxis
                type="number"
                dataKey="timestamp"
                height={45}
                domain={domain}
                tickFormatter={(timestamp) => dayjs(timestamp).format('D MMM')}
                allowDataOverflow
              >
                <Label value="Date" position="insideBottom" />
              </XAxis>
              <YAxis type="number" width={70} domain={[0, 'auto']} />
              <Tooltip
                labelFormatter={(timestamp) => dayjs(timestamp).format('D MMM')}
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
