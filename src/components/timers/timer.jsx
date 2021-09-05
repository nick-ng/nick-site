import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Loading from '../loading';
import TimerEditor, { NumberInput, getDHMSFromMS } from './timerEditor';

const Container = styled.div`
  margin-top: 0.5em;
`;

const Editor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const getTimeFormat = ({ days, hours, minutes, seconds }) => {
  const dayUnit = days === 1 ? 'day' : 'days';
  const hourUnit = hours === 1 ? 'hour' : 'hours';
  const minuteUnit = minutes === 1 ? 'minute' : 'minutes';
  const secondUnit = seconds.toFixed(1) === '1.0' ? 'second' : 'seconds';

  if (days > 0) {
    return {
      display: `${days} ${dayUnit}, ${hours
        .toString()
        .padStart(2, '0')} ${hourUnit}`,
      timeout: 60000 / 3,
    };
  }
  if (hours > 0) {
    return {
      display: `${hours} ${hourUnit}, ${minutes
        .toString()
        .padStart(2, '0')} ${minuteUnit}`,
      timeout: 1000 / 3,
    };
  }
  if (minutes > 0) {
    return {
      display: `${minutes} ${minuteUnit}, ${seconds
        .toFixed(1)
        .toString()
        .padStart(4, '0')} ${secondUnit}`,
      timeout: 100 / 3,
    };
  }

  return {
    display: `${seconds.toFixed(1)} ${secondUnit}`,
    timeout: 100 / 3,
  };
};

export default function ({
  id,
  lastManualRestart,
  durationMS,
  autoRestart,
  name,
  startSize,
  endSize,
  runningState,
  onSave,
  onDelete,
}) {
  const [editModeOn, setEditModeOn] = useState(typeof durationMS !== 'number');
  const [tempSettings, setTempSettings] = useState(null);
  const [timerDisplay, setTimerDisplay] = useState('');
  const [timerTimeout, setTimerTimeout] = useState(null);
  const [timerUpdate, setTimerUpdate] = useState(0);
  const [currentSize, setCurrentSize] = useState(startSize);

  const elapsedMS = Date.now() - lastManualRestart;
  const remainingMS = durationMS - elapsedMS;

  const setTempSettings2 = (value, key) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setTempSettings({
      lastManualRestart,
      durationMS,
      autoRestart,
      name,
      startSize,
      endSize,
    });
  }, [lastManualRestart, durationMS, autoRestart, name]);

  // Updating Timer and queueing next timer restart
  useEffect(() => {
    if (runningState !== 'run') {
      setTimerDisplay('Stopped');
      setCurrentSize(endSize);
      return;
    }

    if (remainingMS <= 0) {
      setTimerDisplay('0.0 seconds');
      return;
    }

    const sizeDifference = endSize - startSize;
    const newSize = startSize + sizeDifference * (elapsedMS / durationMS);
    setCurrentSize(newSize);

    const { display, timeout } = getTimeFormat(getDHMSFromMS(remainingMS));
    setTimerDisplay(display);

    const timeoutId = setTimeout(() => {
      setTimerUpdate(Date.now());
    }, Math.min(timeout, remainingMS));

    setTimerTimeout(timeoutId);
  }, [timerUpdate]);

  useEffect(() => {
    return () => {
      if (timerTimeout) {
        clearTimeout(timerTimeout);
      }
    };
  }, [timerTimeout]);

  if (!tempSettings) {
    return <Loading />;
  }

  return (
    <Container>
      {editModeOn ? (
        <Editor>
          <label>
            Name:&nbsp;
            <input
              value={tempSettings.name}
              onChange={(e) => {
                setTempSettings2(e.target.value, 'name');
              }}
            ></input>
          </label>
          <TimerEditor
            durationMS={tempSettings.durationMS}
            onSave={(value) => {
              setTempSettings2(value, 'durationMS');
            }}
          />
          <label>
            Start Size:&nbsp;
            <NumberInput
              style={{
                fontSize: `${Math.max(tempSettings.startSize, 10)}pt`,
                width: '10vw',
              }}
              value={tempSettings.startSize}
              onChange={(value) => {
                setTempSettings2(value, 'startSize');
              }}
            />
          </label>
          <label>
            End Size:&nbsp;
            <NumberInput
              style={{
                fontSize: `${Math.max(tempSettings.endSize, 10)}pt`,
                width: '10vw',
              }}
              value={tempSettings.endSize}
              onChange={(value) => {
                setTempSettings2(value, 'endSize');
              }}
            />
          </label>
          <label>
            Auto Restart:&nbsp;
            <input
              type="checkbox"
              checked={tempSettings.autoRestart}
              onChange={() => {
                setTempSettings2(!tempSettings.autoRestart, 'autoRestart');
              }}
            />
          </label>
          <div>
            <button
              onClick={() => {
                onSave({ id, ...tempSettings, runningState: 'stop' });
                setEditModeOn(false);
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditModeOn(false);
              }}
            >
              Cancel
            </button>
          </div>
        </Editor>
      ) : (
        <>
          <div>
            {name} ({getTimeFormat(getDHMSFromMS(durationMS)).display})
          </div>
          <div
            style={{
              fontSize: `${currentSize}pt`,
              color:
                remainingMS <= 0 && runningState === 'run' ? 'red' : 'black',
              margin: '3pt 0',
            }}
          >
            {timerDisplay}
          </div>
          {runningState === 'run' && remainingMS > 0 ? (
            <button
              onClick={() => {
                onSave({
                  id,
                  ...tempSettings,
                  runningState: 'stop',
                });
              }}
            >
              Stop
            </button>
          ) : (
            <button
              onClick={() => {
                onSave({
                  id,
                  ...tempSettings,
                  runningState: 'run',
                  lastManualRestart: Date.now(),
                });
                setTimeout(() => {
                  setTimerUpdate(Date.now());
                }, 50);
              }}
            >
              Start
            </button>
          )}
          <button
            onClick={() => {
              setEditModeOn(true);
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (
                confirm(
                  `Really delete timer ${name} (${
                    getTimeFormat(getDHMSFromMS(durationMS)).display
                  })?`
                )
              ) {
                onDelete();
              }
            }}
          >
            Delete
          </button>
          {autoRestart && <span>Auto Restart</span>}
          <hr />
        </>
      )}
    </Container>
  );
}
