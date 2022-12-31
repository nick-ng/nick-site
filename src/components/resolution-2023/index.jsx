import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { getArray, setArray } from '../../services/foreignStorage';

const DAYS_DONE_STORE = 'nick-ng-days-done-store';

const months = new Array(12).fill(0).map((_, i) => i);

const StyledResolution2023 = styled.div``;

export default function Resolution2023() {
  const [today] = useState(new Date());
  const [daysDone, setDaysDone] = useState([]);

  useEffect(() => {
    (async () => {
      const temp = await getArray(DAYS_DONE_STORE);
      console.log('temp', temp);
    })();
  }, []);

  return (
    <StyledResolution2023>
      <h1>2023 Resolution</h1>
      <ul>
        <li>Do push-ups equal to the sum of the month and the date.</li>
      </ul>
      <p>Push-ups to do today: {today.getDate() + today.getMonth() + 1}</p>
    </StyledResolution2023>
  );
}
