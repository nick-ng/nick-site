import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import ConfettiWithMessage from './confetti-with-message';
import { getNextAnniversary, conversionFactors, formatMSHMMSS } from './utils';

const SIZE_RATIO = 5184000000; // 60 days
const COUNTDOWN_THRESHOLD = 6 * 60 * 60 * 1000; // milliseconds
let countdownOffset = 0;

const Container = styled.div`
  margin-top: 1em;
`;

const MonoSpan = styled.span.attrs((props) => {
  const size = Math.max(1, Math.min(5, props.size || 1));
  return {
    style: {
      fontSize: `${size}em`,
    },
  };
})`
  font-family: monospace;
`;

const BigCountdown = styled.div`
  display: flex;
  justify-content: center;

  span {
    font-size: 6em;
    font-family: monospace;
    font-weight: bold;
  }
`;

export default function AnniversaryCountdown() {
  const urlParams = new URLSearchParams(window.location.search);
  const timeFormat = parseInt(urlParams.get('tf'), 10);
  const precision = parseInt(urlParams.get('p'), 10);
  const testSeconds = parseInt(urlParams.get('test'), 10) || 0;

  const [timeMS, setTimeMS] = useState(0);
  const [timeString, setTimeString] = useState('');
  const [timeUnit, setTimeUnit] = useState('');
  const [anniversaryOrdinal, setAnniversaryOrdinal] = useState('');

  const { previousAnniversary } = getNextAnniversary();
  const showConfetti =
    (new Date() >= previousAnniversary &&
      new Date() < previousAnniversary + 1000 * 60 * 60) ||
    timeMS < 0;
  const showBigCountdown = timeMS <= COUNTDOWN_THRESHOLD || showConfetti;

  const size = timeMS > COUNTDOWN_THRESHOLD ? SIZE_RATIO / (timeMS + 1) : 1;

  useEffect(() => {
    const { ms } = getNextAnniversary();

    if (testSeconds > 0) {
      countdownOffset = ms - 1000 * testSeconds;
    }
  }, []);

  useEffect(() => {
    let stopUpdating = false;
    function updateTimeString() {
      if (stopUpdating) {
        return;
      }
      const { ms, ordinal } = getNextAnniversary();
      setAnniversaryOrdinal(ordinal);

      let time = ms - countdownOffset;
      setTimeMS(time);
      let factor = 1;
      if (timeFormat && !isNaN(timeFormat) && conversionFactors[timeFormat]) {
        for (let i = 0; i <= timeFormat; i++) {
          // eslint-disable-line no-plusplus
          time = time / conversionFactors[i].factor; // eslint-disable-line operator-assignment
          factor = factor * conversionFactors[i].factor; // eslint-disable-line operator-assignment
        }

        const ii = Math.floor(time).toLocaleString({ useGrouping: true });
        const actualPrecision = isNaN(precision)
          ? Math.floor(Math.pow(Math.log10(factor), 1.2)) // eslint-disable-line
          : precision;
        const dd =
          actualPrecision > 0
            ? `.${(time % 10).toFixed(actualPrecision).slice(2)}`
            : '';

        setTimeString(`${ii}${dd}`);
        setTimeUnit(conversionFactors[timeFormat].name);
      } else {
        setTimeString(
          `${time.toLocaleString({
            useGrouping: true,
          })}`
        );
        setTimeUnit('milliseconds');
      }

      setTimeout(updateTimeString, Math.random() * 10 + 10);

      return () => {
        stopUpdating = true;
      };
    }
    updateTimeString();
  }, [timeFormat, precision]);

  return (
    <Container>
      {showBigCountdown ? (
        <BigCountdown>
          {showConfetti ? (
            <ConfettiWithMessage
              style={{ borderBottom: '1px solid lightgrey' }}
              message="It's Our Anniversary!"
            />
          ) : (
            <span>{formatMSHMMSS(timeMS)}</span>
          )}
        </BigCountdown>
      ) : (
        <div>
          Only <MonoSpan size={size}>{timeString}</MonoSpan>{' '}
          <span>{timeUnit}</span> until our <span>{anniversaryOrdinal}</span>{' '}
          wedding anniversary!
        </div>
      )}
    </Container>
  );
}
