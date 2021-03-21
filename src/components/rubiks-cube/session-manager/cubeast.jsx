import React, { useState } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
dayjs.extend(customParseFormat);
dayjs.extend(utc);

const CUBEAST_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export default function CubeastImporter({ importHandler }) {
  const [csv, setCsv] = useState([]);

  const sessions = csv.reduce((prev, curr) => {
    const {
      session_name,
      scramble,
      inspection_two_second_penalty,
      one_turn_away_two_second_penalty,
      id,
      date,
      dnf,
      timer_time,
      time,
    } = curr;

    if (!prev[session_name]) {
      prev[session_name] = [];
    }

    prev[session_name].push({
      id: `cubeast-${id}`,
      scramble,
      time: dnf === 'true' ? 9999 : Math.floor((timer_time || time) / 10) / 100,
      createdAt: dayjs.utc(date, CUBEAST_DATE_FORMAT).valueOf(),
      penalty:
        inspection_two_second_penalty === 'true' ||
        one_turn_away_two_second_penalty === 'true',
    });

    return prev;
  }, {});

  return (
    <div>
      <label>
        Cubeast .CSV Export
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) {
              return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
              const contents = e.target.result;
              setCsv(
                Papa.parse(contents, { header: true })
                  .data.filter((a) => a.id.length > 0)
                  .sort((a, b) => {
                    return dayjs(a.date, CUBEAST_DATE_FORMAT).diff(
                      dayjs(b.date, CUBEAST_DATE_FORMAT)
                    );
                  })
              );
            };
            reader.readAsText(file);
          }}
        />
      </label>
      <div>
        {Object.entries(sessions).map((a) => {
          const [sessionName, sessionTimes] = a;
          return (
            <div key={sessionName}>
              <button
                onClick={() => {
                  importHandler(sessionTimes);
                }}
              >
                {sessionName}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
