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

const NextLetter = styled.div`
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

const THE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export default function TypeTheAlphabet() {
  const [alphabet, setAlphabet] = useState('');
  const [times, setTimes] = useState([]);
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  let chartData = [];
  if (times.length > 0) {
    chartData = times.map((time, i) => ({
      x: THE_ALPHABET[i],
      y: time - times[0],
    }));
  }

  const isDone = alphabet.length === THE_ALPHABET.length;

  return (
    <Container>
      <h2>(Not) Type the Alphabet</h2>
      <Game>
        <NextLetter>
          {isDone
            ? (Math.max(...times) - Math.min(...times)).toFixed(3)
            : THE_ALPHABET[alphabet.length].toUpperCase()}
        </NextLetter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAlphabet('');
            setTimes([]);
            inputEl.current.focus();
          }}
        >
          <input
            placeholder="Press enter to restart"
            ref={inputEl}
            className={`alphabet-input${isDone ? ' done' : ''}`}
            type="text"
            value={alphabet}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              if (
                THE_ALPHABET.startsWith(value) &&
                value.length > alphabet.length
              ) {
                setAlphabet(value);
                setTimes((prev) => [...prev, Date.now() / 1000]);
              }
            }}
          />
          <button>Restart</button>
        </form>
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
                <th style={{ textAlign: 'center' }}>Letter</th>
                <th style={{ textAlign: 'right' }}>Time (s)</th>
                <th style={{ textAlign: 'right' }}>Delta</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map(({ x, y }, i) => {
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
