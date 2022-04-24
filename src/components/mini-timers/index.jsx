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

const newTimer = (id) => {
  return {
    id,
    ...TIMER_DEFAULTS,
  };
};
