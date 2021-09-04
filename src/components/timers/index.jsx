import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { getArray, setArray } from '../../services/foreignStorage';
import Timer from './timer';

const TIMER_STORAGE = 'NICK_TIMER_STORAGE';

const Container = styled.div``;

const Timers = styled.div``;

const fetchTimers = async (timerSetter) => {
  timerSetter(await getArray(TIMER_STORAGE));
};

export default function () {
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    fetchTimers(setTimers);
  }, []);

  return (
    <Container>
      <h2>Timers</h2>
      <button
        onClick={() => {
          setTimers((prevTimers) => {
            return [{ id: uuid() }].concat(prevTimers);
          });
        }}
      >
        New Timer
      </button>
      <Timers>
        {timers.map((timer) => {
          return (
            <Timer
              key={timer.id}
              {...timer}
              onSave={(newTimer) => {
                setTimers((prevTimers) => {
                  return [newTimer].concat(
                    prevTimers.filter((timer) => timer.id !== newTimer.id)
                  );
                });
                console.log('newTimer', newTimer);
              }}
            />
          );
        })}
      </Timers>
    </Container>
  );
}
