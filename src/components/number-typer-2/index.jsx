import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Game = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  form {
    padding-bottom: 0.5em;

    input,
    button {
      font-size: 36pt;
    }

    input {
      width: 16em;
    }

    button {
      margin-left: 0.5em;
      padding: 0 0.3em;
    }
  }
`;

const NextNumber = styled.div`
  font-size: 36pt;
`;

const Stats = styled.div`
  margin-top: 0.5em;
  display: inline-flex;
  flex-direction: row;
  justify-content: center;

  & > div {
    border: 1px solid grey;
    padding: 0.5em;
  }
`;

const LettersTable = styled.table`
  border-collapse: collapse;

  td,
  th {
    border: 1px solid grey;
    padding: 0 0.5em;
  }
`;

const TOLERANCE = 0.001;
const LAST_NUMBER = 100;

export default function NumberTyper2() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [times, setTimes] = useState([]);
  const inputEl = useRef(null);

  const nextNumber = currentNumber + 1;

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  let chartData = [];
  if (times.length > 0) {
    chartData = times.map((time, i) => ({
      x: i + 1,
      y: time - times[0],
    }));
  }

  const isDone = currentNumber >= LAST_NUMBER;

  return (
    <Container>
      <h2>Type The Numbers 1 to {LAST_NUMBER}</h2>
      <Game>
        <NextNumber>{isDone ? 'Done' : nextNumber}</NextNumber>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCurrentNumber(0);
            setTimes([]);
            inputEl.current.focus();
          }}
        >
          <input
            placeholder="Press enter to restart"
            ref={inputEl}
            className={`number-input${isDone ? ' done' : ''}`}
            type="number"
            value={inputValue}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (`${nextNumber}`.startsWith(e.target.value)) {
                setInputValue(e.target.value);
              }
              if (Math.abs(value - nextNumber) < TOLERANCE) {
                setCurrentNumber(value);
                setTimes((prev) => [...prev, Date.now() / 1000]);
                setInputValue('');
              }
            }}
          />
          <button>Restart</button>
        </form>
        <div className="time">
          Total time:{' '}
          {times.length > 0 ? (
            <span>{(Math.max(...times) - Math.min(...times)).toFixed(3)}</span>
          ) : (
            '0.000'
          )}
          s {isDone && 'Done'}
        </div>
      </Game>
      <Stats>
        <div>
          <LineChart
            width={600}
            height={520}
            data={chartData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey="y" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="x" />
            <YAxis domain={[0, Math.ceil(Math.max(...times) - times[0])]} />
          </LineChart>
        </div>
        <div>
          <LettersTable>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Number</th>
                <th style={{ textAlign: 'right' }}>Time (s)</th>
                <th style={{ textAlign: 'right' }}>Delta</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map(({ x, y }, i) => {
                if (parseInt(x) % 5 !== 0) {
                  return null;
                }
                return (
                  <tr key={x}>
                    <td style={{ textAlign: 'center' }}>{x}</td>
                    <td style={{ textAlign: 'right' }}>{y.toFixed(3)}</td>
                    <td style={{ textAlign: 'right' }}>
                      {(i === 0 ? 0 : y - chartData[i - 1].y).toFixed(3)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </LettersTable>
        </div>
      </Stats>
      <p>
        Inspired by{' '}
        <a href="https://typethealphabet.app/" target="_blank">
          Type The Alphabet
        </a>
      </p>
    </Container>
  );
}
