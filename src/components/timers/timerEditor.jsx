import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.form``;

const Label = styled.label`
  text-transform: capitalize;

  & input {
    width: 3em;
  }

  & ~ & {
    margin-left: 0.5em;
  }
`;

export const NumberInput = ({ value, onChange, onBlur }) => (
  <input
    onChange={(e) => {
      onChange(parseFloat(e.target.value));
    }}
    onBlur={onBlur}
    type="number"
    value={value}
  />
);

export const getDHMSFromMS = (ms = 0) => {
  const days = Math.floor(ms / 86400000);
  let remainingMS = ms % 86400000;
  const hours = Math.floor(remainingMS / 3600000);
  remainingMS = remainingMS % 3600000;
  const minutes = Math.floor(remainingMS / 60000);
  remainingMS = remainingMS % 60000;
  const seconds = remainingMS / 1000;
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

const getMSFromDHMS = ({ days, hours, minutes, seconds }) => {
  return days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000;
};

export default function ({ durationMS, onSave }) {
  const [tempDuration, setTempDuration] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const setTempDuration2 = (value, unit) => {
    setTempDuration((prev) => ({ ...prev, [unit]: value }));
  };

  useEffect(() => {
    setTempDuration(getDHMSFromMS(durationMS));
  }, [durationMS]);

  return (
    <Container
      onSubmit={(e) => {
        e.preventDefault();
        onSave(getMSFromDHMS(tempDuration));
      }}
    >
      {Object.keys(tempDuration).map((key) => {
        return (
          <Label key={key}>
            {key}:&nbsp;
            <NumberInput
              value={tempDuration[key]}
              onChange={(value) => {
                setTempDuration2(value, key);
              }}
              onBlur={() => {
                onSave(getMSFromDHMS(tempDuration));
              }}
            />
          </Label>
        );
      })}
    </Container>
  );
}
