import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { getArray, setArray } from '../../services/foreignStorage';
import Timer from './timer';

const TIMER_STORAGE = 'NICK_TIMER_STORAGE';

const Container = styled.div``;

const Timers = styled.div`
  margin-top: 0.3em;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1px;
`;

const saveTimers = async (timers) => {
  setArray(TIMER_STORAGE, timers);
};

const fetchTimers = async (timerSetter) => {
  timerSetter(await getArray(TIMER_STORAGE));
};

const newTimer = (id) => {
  return {
    id,
    lastManualRestart: 0,
    durationMS: 0,
    autoRestart: false,
    name: ` ${id}`,
    startSize: 12,
    endSize: 16,
    timerState: 'new',
    sound: true,
  };
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
            return [newTimer(uuid())].concat(prevTimers);
          });
        }}
      >
        New Timer
      </button>
      <Timers>
        {timers
          .sort((a, b) =>
            `${a.name}_${a.id}`.localeCompare(`${b.name}_${b.id}`)
          )
          .map((timer) => {
            return (
              <Timer
                key={timer.id}
                {...timer}
                onSave={(newTimer) => {
                  setTimers((prevTimers) => {
                    const newTimers = [newTimer].concat(
                      prevTimers.filter((timerb) => timerb.id !== newTimer.id)
                    );
                    saveTimers(newTimers);
                    return newTimers;
                  });
                }}
                onDelete={() => {
                  setTimers((prevTimers) => {
                    const newTimers = prevTimers.filter(
                      (timerb) => timerb.id !== timer.id
                    );
                    saveTimers(newTimers);
                    return newTimers;
                  });
                }}
              />
            );
          })}
      </Timers>
    </Container>
  );
}
