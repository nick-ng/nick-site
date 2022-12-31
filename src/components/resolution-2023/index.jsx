import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getArray, setArray } from '../../services/foreignStorage';

const DAYS_DONE_STORE = 'nick-ng-days-done-store';

const months = new Array(12).fill(0).map((_, i) => i);

const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const getDateString = (date) => {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

const StyledResolution2023 = styled.div``;

export default function Resolution2023() {
  const [today] = useState(new Date());
  const [daysDone, setDaysDone] = useState([]);

  useEffect(() => {
    (async () => {
      setDaysDone(await getArray(DAYS_DONE_STORE));
    })();
  }, []);

  return (
    <StyledResolution2023>
      <h1>2023 Resolution</h1>
      <ul>
        <li>Do push-ups equal to the sum of the month and the date.</li>
      </ul>
      <p>Push-ups to do today: {today.getDate() + today.getMonth() + 1}</p>
      <button
        onClick={() => {
          const dateString = getDateString(today);
          if (daysDone.includes(dateString)) {
            return;
          }

          const newDaysDone = daysDone.concat([dateString]);

          setArray(DAYS_DONE_STORE, newDaysDone);
          setDaysDone(newDaysDone);
        }}
      >
        Push-ups for {today.toLocaleDateString('en-NZ', dateOptions)} done
      </button>
      <p>Push-ups done:</p>
      <ul>
        {daysDone
          .sort((a, b) => new Date(a) - new Date(b))
          .map((dateString) => (
            <li key={dateString}>
              {new Date(dateString).toLocaleDateString('en-NZ', dateOptions)}
            </li>
          ))}
      </ul>
    </StyledResolution2023>
  );
}
