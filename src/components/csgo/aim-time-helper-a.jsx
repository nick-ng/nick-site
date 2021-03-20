import React, { useState } from 'react';
import styled from 'styled-components';

const MainForm = styled.form`
  input {
    padding: 0.5em;
    margin-right: 0.5em;
  }
`;

export default function AimTimeHelperA({
  gunName,
  gunTimes,
  setGunTimes,
  setWarning,
}) {
  const [gunTime, setGunTime] = useState('');
  const [gunSeconds, setGunSeconds] = useState(-1);

  return (
    <MainForm
      onSubmit={(e) => {
        e.preventDefault();
        if (gunSeconds > 0) {
          setGunTimes([...gunTimes, gunSeconds]);
          setGunTime('');
        } else {
          setWarning(
            `Invalid time format for ${gunName}. Must be <minutes>:<seconds. Enter "0" minutes if under a minute`
          );
        }
      }}
    >
      <label>
        <input
          onChange={(e) => {
            setGunTime(e.target.value);
            try {
              const [minutes, seconds] = e.target.value.split(':');
              setGunSeconds(parseInt(minutes, 0) * 60 + parseFloat(seconds));
            } catch (_e) {
              setGunSeconds(-1);
            }
          }}
          value={gunTime}
        />
        {gunName} (count: {gunTimes.length})
      </label>
    </MainForm>
  );
}
