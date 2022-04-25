import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { getArray, setArray } from '../../services/foreignStorage';
import MiniTimer from './mini-timer';

const TIMER_STORAGE = 'NICK_TIMER_STORAGE';

const TIMER_DEFAULTS = {
  lastManualRestart: 0,
  durationMS: 0,
  autoRestart: false,
  startSize: 12,
  endSize: 16,
  remindFrom: 0,
  url: '',
  timerState: 'new',
  sound: true,
};

const saveTimers = async (timers) => {
  setArray(TIMER_STORAGE, timers);
};

const fetchTimers = async (timerSetter) => {
  const tempTimers = await getArray(TIMER_STORAGE);
  timerSetter(
    tempTimers.map((tempTimer) => {
      return {
        ...TIMER_DEFAULTS,
        ...tempTimer,
      };
    })
  );
};

const timerSorter = (a, b) => {
  if (a.timerState === 'warn' && b.timerState === 'warn') {
    const aEndTime = a.lastManualRestart + a.durationMS;
    const bEndTime = b.lastManualRestart + b.durationMS;

    return aEndTime - bEndTime;
  }

  if (a.timerState === 'warn' && b.timerState !== 'warn') {
    return -1;
  }

  if (a.timerState !== 'warn' && b.timerState == 'warn') {
    return 1;
  }

  if (a.timerState === 'run' && b.timerState === 'run') {
    const aEndTime = a.lastManualRestart + a.durationMS;
    const bEndTime = b.lastManualRestart + b.durationMS;

    return aEndTime - bEndTime;
  }

  if (a.timerState === 'run' && b.timerState !== 'run') {
    return -1;
  }

  if (a.timerState !== 'run' && b.timerState === 'run') {
    return 1;
  }

  return a.durationMS - b.durationMS;
};

const newTimer = (id) => {
  return {
    ...TIMER_DEFAULTS,
    id,
    lastUsed: Date.now(),
  };
};

export default function MiniTimers() {
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    fetchTimers(setTimers);
  }, []);

  useEffect(() => {
    timers.length > 0 && saveTimers(timers);
  }, [timers]);

  return (
    <>
      {timers.sort(timerSorter).map((timer) => (
        <MiniTimer key={timer.id} {...timer} timersSetter={setTimers} />
      ))}
    </>
  );
}
