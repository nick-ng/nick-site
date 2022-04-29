import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const getFormattedTime = (milliseconds) => {
  let temp = milliseconds;
  const hours = Math.floor(temp / 3600000);
  temp = temp % 3600000;
  const minutes = Math.floor(temp / 60000);
  temp = temp % 60000;
  const seconds = Math.floor(temp / 1000);

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

const Container = styled.div`
  position: relative;
  margin-bottom: 0.2em;
`;

const TimeDisplay = styled.div`
  display: inline-block;
  // font-family: monospace;
  margin-left: 0.2em;
`;

const TimerButtons = styled.button`
  display: inline-block;
  background-color: white;
  border: 1px solid grey;
  cursor: pointer;
  text-align: center;
`;

const TimerLabel = styled.div`
  display: ${(props) => (props.alwaysShow ? 'block' : 'none')};
  position: absolute;
  top: -0.2em;
  left: calc(100% + 0.2em);
  background-color: white;
  padding: 0.2em 0.3em;
  border: 1px solid ${(props) => (props.warn ? 'red' : 'grey')};
  cursor: pointer;
  color: ${(props) => (props.warn ? 'red' : 'black')};
  pointer-events: ${(props) => (props.alwaysShow ? 'auto' : 'none')};

  ${Container}:hover & {
    display: block;
  }

  span {
    white-space: nowrap;
  }
`;

export default function MiniTimer(props) {
  const { id, lastManualRestart, name, durationMS, timerState, timersSetter } =
    props;

  const [displayTime, setDisplayTime] = useState(getFormattedTime(durationMS));
  const [displayTime2, setDisplayTime2] = useState('');

  useEffect(() => {
    let intervalId = null;
    if (timerState === 'run') {
      intervalId = setInterval(() => {
        const remainingMS = durationMS - (Date.now() - lastManualRestart);

        const formattedTime = getFormattedTime(remainingMS);

        if (remainingMS > 36000000) {
          setDisplayTime('9:99:99');
          if (formattedTime !== displayTime2) {
            setDisplayTime2(formattedTime);
          }
          return;
        }

        if (remainingMS <= 0) {
          const beep = new Audio('/sounds/440-0.2.mp3');
          beep.play();
          setDisplayTime('0:00:00');
          setDisplayTime2('');
          timersSetter((prev) => {
            return [...prev]
              .filter((a) => a.id !== id)
              .concat([
                {
                  ...props,
                  timerState: 'warn',
                },
              ]);
          });

          clearInterval(intervalId);
          intervalId = null;

          return;
        }

        if (formattedTime !== displayTime) {
          setDisplayTime(formattedTime);
          setDisplayTime2('');
        }
      }, 331);
    }

    if (timerState === 'stopped') {
      setDisplayTime(getFormattedTime(durationMS));
    }

    return () => {
      intervalId !== null && clearInterval(intervalId);
    };
  }, [timerState, lastManualRestart]);

  return (
    <Container>
      <TimerLabel
        alwaysShow={timerState === 'warn'}
        warn={timerState === 'warn'}
        role="button"
        onClick={() => {
          if (timerState === 'warn') {
            timersSetter((prev) => {
              return [...prev]
                .filter((a) => a.id !== id)
                .concat([
                  {
                    ...props,
                    timerState: 'stopped',
                  },
                ]);
            });
          }
        }}
      >
        <span>{name}</span>
        {displayTime2 && <span>&nbsp;{displayTime2}</span>}
      </TimerLabel>
      {timerState !== 'run' && (
        <TimerButtons
          disabled={timerState === 'run'}
          onClick={() => {
            timersSetter((prev) => {
              return [...prev]
                .filter((a) => a.id !== id)
                .concat([
                  {
                    ...props,
                    lastManualRestart: Date.now(),
                    timerState: 'run',
                  },
                ]);
            });
          }}
        >
          <i className="fa fa-play" />
        </TimerButtons>
      )}
      {timerState === 'run' && (
        <TimerButtons
          disabled={timerState !== 'run'}
          onClick={() => {
            const remainingMS = durationMS - (Date.now() - lastManualRestart);
            if (
              remainingMS > 10 * 1000 * 60 &&
              !confirm(
                `Really stop ${name}? ${getFormattedTime(
                  remainingMS
                )} remaining.`
              )
            ) {
              return;
            }

            timersSetter((prev) => {
              return [...prev]
                .filter((a) => a.id !== id)
                .concat([
                  {
                    ...props,
                    lastManualRestart: Date.now(),
                    timerState: 'stopped',
                  },
                ]);
            });
          }}
        >
          <i className="fa fa-stop" />
        </TimerButtons>
      )}
      <TimeDisplay>{displayTime}</TimeDisplay>
    </Container>
  );
}
