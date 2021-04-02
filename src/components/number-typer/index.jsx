import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { NumberGenerator, median } from './utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NumberDisplay = styled.div`
  font-size: 2em;
  display: flex;
  justify-content: center;

  div {
    display: flex;
    font-family: monospace;
    flex-basis: 10em;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
  }
`;

const MAX_ARRAY_SIZE = 30;

export default function NumberTyper() {
  const [typedNumbers, setTypedNumbers] = useState([]);
  const [nextNumbers, setNextNumbers] = useState([]);
  const [correctNumbers, setCorrectNumbers] = useState(0);
  const [wrongNumbers, setWrongNumbers] = useState(0);
  const [tic, setTic] = useState(Date.now());
  const [times, setTimes] = useState([1111, 1000]);

  const totalNumbers = correctNumbers + wrongNumbers;

  useEffect(() => {
    if (nextNumbers.length < MAX_ARRAY_SIZE) {
      setNextNumbers((c) => {
        const tempNextNumbers = [...c];
        while (tempNextNumbers.length < MAX_ARRAY_SIZE) {
          tempNextNumbers.push(NumberGenerator.getNumber());
        }
        return tempNextNumbers;
      });
    }

    if (nextNumbers[0] === ' ') {
      setNextNumbers((a) => {
        setTypedNumbers((b) => [...b, ' ']);
        return a.slice(1);
      });
    }
  }, [nextNumbers]);

  const msPerNumber = median(times);
  const wpm = (1 / msPerNumber) * 1000 * 60 * 0.2;

  useEffect(() => {
    if (typedNumbers.length > MAX_ARRAY_SIZE) {
      setTypedNumbers(typedNumbers.slice(-MAX_ARRAY_SIZE));
    }
  }, [typedNumbers]);

  return (
    <Container>
      <h2>Number Typer</h2>
      <p>Spaces are for reference only.</p>
      <NumberDisplay>
        <div
          style={{
            color: 'lightgrey',
            justifyContent: 'flex-end',
          }}
        >
          {typedNumbers.map((a, i) =>
            a === ' ' ? (
              <span key={`t${a}${i}`}>&nbsp;</span>
            ) : (
              <span key={`t${a}${i}`}>{a}</span>
            )
          )}
        </div>
        <div style={{ borderLeft: ' 1px dotted grey' }}>
          {nextNumbers.map((a, i) =>
            a === ' ' ? (
              <span key={`n${a}${i}`}>&nbsp;</span>
            ) : (
              <span key={`n${a}${i}`}>{a}</span>
            )
          )}
        </div>
      </NumberDisplay>
      <input
        value=""
        onChange={(e) => {
          if (e.target.value === ' ') {
            return;
          }
          setTimes((times) => {
            const toc = Date.now();
            const newTimes = [toc - tic, ...times].slice(0, 100);
            setTic(toc);
            return newTimes;
          });
          if (e.target.value === nextNumbers[0]) {
            setCorrectNumbers(correctNumbers + 1);
          } else {
            setWrongNumbers(wrongNumbers + 1);
          }
          setNextNumbers((a) => {
            setTypedNumbers((b) => [...b, a[0]]);
            return a.slice(1);
          });
        }}
      />
      <table>
        <tbody>
          <tr>
            <td>Correct</td>
            <td>{correctNumbers}</td>
          </tr>
          <tr>
            <td>Wrong</td>
            <td>{wrongNumbers}</td>
          </tr>
          <tr>
            <td>Accuracy</td>
            <td>
              {totalNumbers > 0
                ? `${((correctNumbers / totalNumbers) * 100).toFixed(1)}%`
                : '0.0%'}
            </td>
          </tr>
          <tr>
            <td>WPM</td>
            <td>
              {wpm.toFixed(0)} (
              {(wpm * (correctNumbers / totalNumbers)).toFixed(0)})
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
}
