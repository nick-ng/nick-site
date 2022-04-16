import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Loading from '../loading';
import {
  VOICE_CHARACTER_STORE,
  VOICE_VOLUME_STORE,
  sayWithVoice2,
} from '../text-to-speech/text-to-speech';
import TimerEditor, { NumberInput, getDHMSFromMS } from './timerEditor';

const Container = styled.div`
  box-shadow: 0 0 0 1px grey;
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Editor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const getTimeFormat = ({ days, hours, minutes, seconds }, padding = 2) => {
  const dayUnit = days === 1 ? 'day' : 'days';
  const hourUnit = hours === 1 ? 'hour' : 'hours';
  const minuteUnit = minutes === 1 ? 'minute' : 'minutes';
  const secondUnit = seconds.toFixed(1) === '1.0' ? 'second' : 'seconds';

  if (days > 0) {
    return {
      display: `${days} ${dayUnit}, ${hours
        .toString()
        .padStart(padding, '0')} ${hourUnit}`,
      timeout: 60000 / 3,
    };
  }
  if (hours > 0) {
    return {
      display: `${hours} ${hourUnit}, ${minutes
        .toString()
        .padStart(padding, '0')} ${minuteUnit}`,
      timeout: 1000 / 3,
    };
  }
  if (minutes > 0) {
    return {
      display: `${minutes} ${minuteUnit}, ${seconds
        .toFixed(1)
        .toString()
        .padStart(padding + 2, '0')} ${secondUnit}`,
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
  timerState,
  sound,
  remindFrom,
  url: tempUrl,
  onSave,
  onDelete,
}) {
  const url = (tempUrl || '').trim();
  const [editModeOn, setEditModeOn] = useState(timerState === 'new');
  const [tempSettings, setTempSettings] = useState({
    lastManualRestart,
    durationMS,
    autoRestart,
    name,
    startSize,
    endSize,
    timerState,
    sound,
    url,
  });
  const [timerDisplay, setTimerDisplay] = useState('');
  const [timerTimeout, setTimerTimeout] = useState(null);
  const [timerUpdate, setTimerUpdate] = useState(0);
  const [currentSize, setCurrentSize] = useState(startSize);
  const [firstRun, setFirstRun] = useState(true);

  const voice = localStorage.getItem(VOICE_CHARACTER_STORE) || '';
  const voiceVolume = parseFloat(
    localStorage.getItem(VOICE_VOLUME_STORE) ?? 0.3
  );

  const elapsedMS = Date.now() - lastManualRestart;
  const remainingMS = durationMS - elapsedMS;

  const setTempSettings2 = (value, key) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setTempSettings({
      ...tempSettings,
      lastManualRestart,
      durationMS,
      autoRestart,
      name,
      timerState,
      sound,
      url,
    });
  }, [lastManualRestart, durationMS, autoRestart, name, timerState, sound]);

  useEffect(() => {
    setFirstRun(false);
    if (timerState === 'new') {
      onSave({
        id,
        ...tempSettings,
        timerState: 'stopped',
      });
    }
    if (remainingMS <= 0 && timerState === 'run') {
      onSave({
        id,
        ...tempSettings,
        timerState: 'expired',
      });
    }
  }, []);

  // Updating Timer and queueing next timer restart
  useEffect(() => {
    if (timerState !== 'run') {
      setTimerDisplay('Stopped');
      setCurrentSize(startSize);
      return;
    }

    if (remainingMS <= 0) {
      if (!firstRun && sound) {
        sayWithVoice2(`${name} timer is complete.`, voice, {
          volume: voiceVolume,
        });
      }

      setTimerDisplay('0.0 seconds');
      return;
    }

    const sizeDifference = endSize - startSize;
    const newSize =
      startSize +
      sizeDifference * (elapsedMS / durationMS) * (elapsedMS / durationMS);
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

  const nameString = `${name} (${
    getTimeFormat(getDHMSFromMS(durationMS), -9).display
  })`;

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
          <label>
            URL:&nbsp;
            <input
              value={tempSettings.url}
              onChange={(e) => {
                setTempSettings2(e.target.value, 'url');
              }}
            />
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
          <label>
            Sound:&nbsp;
            <input
              type="checkbox"
              checked={tempSettings.sound}
              onChange={() => {
                setTempSettings2(!tempSettings.sound, 'sound');
              }}
            />
          </label>
          <div>
            <button
              onClick={() => {
                onSave({ id, ...tempSettings });
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
            {url ? (
              <a
                href={url.match(/^http(s)*:\/\//) ? url : `https://${url}`}
                target="_blank"
              >
                {nameString}
              </a>
            ) : (
              <span>{nameString}</span>
            )}
          </div>
          <div
            style={{
              fontSize: `${currentSize}pt`,
              color: remainingMS <= 0 && timerState === 'run' ? 'red' : 'black',
              margin: '3pt 0',
            }}
          >
            {timerDisplay}
          </div>
          <div>
            <button
              onClick={() => {
                if (!confirm(`Really stop timer "${name}"?`)) {
                  return;
                }
                onSave({
                  id,
                  ...tempSettings,
                  timerState: 'stop',
                });
              }}
              disabled={timerState !== 'run'}
            >
              Stop
            </button>
            <button
              onClick={() => {
                if (
                  remainingMS > 0 &&
                  timerState === 'run' &&
                  !confirm(`Really restart timer "${name}"?`)
                ) {
                  return;
                }
                onSave({
                  id,
                  ...tempSettings,
                  timerState: 'run',
                  lastManualRestart: Date.now(),
                });
                setTimeout(() => {
                  setTimerUpdate(Date.now());
                }, 50);
              }}
            >
              {remainingMS > 0 && timerState === 'run' ? 'Restart' : 'Start'}
            </button>
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
          </div>
        </>
      )}
    </Container>
  );
}
