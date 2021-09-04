import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Loading from '../loading';
import TimerEditor, { NumberInput, getDHMSFromMS } from './timerEditor';

const Container = styled.div``;

const Editor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export default function ({
  id,
  lastManualRestart,
  durationMS,
  autoRestart,
  name,
  size,
  onSave,
}) {
  const [editModeOn, setEditModeOn] = useState(typeof durationMS !== 'number');
  const [tempSettings, setTempSettings] = useState(null);

  const setTempSettings2 = (value, key) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    setTempSettings({
      lastManualRestart,
      durationMS,
      autoRestart,
      name,
      size,
    });
  }, [lastManualRestart, durationMS, autoRestart, name]);

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
            Size:&nbsp;
            <NumberInput
              value={tempSettings.size}
              onChange={(value) => {
                setTempSettings2(value, 'size');
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
          <button
            onClick={() => {
              onSave({ id, ...tempSettings });
              setEditModeOn(false);
            }}
          >
            Save
          </button>
        </Editor>
      ) : (
        <>
          {name}
          <button
            onClick={() => {
              onSave({ id, ...tempSettings, lastManualRestart: Date.now() });
            }}
          >
            Start
          </button>
          <button
            onClick={() => {
              setEditModeOn(true);
            }}
          >
            Edit
          </button>
        </>
      )}
    </Container>
  );
}
