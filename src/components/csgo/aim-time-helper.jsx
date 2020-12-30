import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import AimTimeHelperA from './aim-time-helper-a';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const OutputRow = styled.div`
  display: flex;
  flex-direction: row;

  input {
    padding: 0.5em;
  }
`;

export default function AimTimeHelper() {
  const [ak47Times, setAk47Times] = useState([]);
  const [m4a4Times, setM4a4Times] = useState([]);
  const [m4a1Times, setM4a1Times] = useState([]);

  const [warning, setWarning] = useState(null);

  const outputRef = useRef();

  const today = new Date();
  const todayString = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;

  const outputString = [
    todayString,
    `=average(${ak47Times.join(',')})`,
    `=average(${m4a4Times.join(',')})`,
    `=average(${m4a1Times.join(',')})`,
  ].join('\t');

  return (
    <Container>
      <h2>CS:GO Aim Time Helper</h2>
      <AimTimeHelperA
        gunName="AK47"
        gunTimes={ak47Times}
        setGunTimes={setAk47Times}
        setWarning={setWarning}
      />
      <AimTimeHelperA
        gunName="M4A4"
        gunTimes={m4a4Times}
        setGunTimes={setM4a4Times}
        setWarning={setWarning}
      />
      <AimTimeHelperA
        gunName="M4A1"
        gunTimes={m4a1Times}
        setGunTimes={setM4a1Times}
        setWarning={setWarning}
      />
      <OutputRow>
        <input ref={outputRef} readOnly value={outputString} />
        <button
          onClick={() => {
            outputRef.current.select();
            document.execCommand('copy');
          }}
        >
          Copy
        </button>
      </OutputRow>
      <span>{warning}</span>
    </Container>
  );
}
