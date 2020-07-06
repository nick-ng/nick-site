import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { getArray, setArray } from '../../../services/foreignStorage';
import { CHUNK_LIMIT, SESSION_LIMIT } from '../timer';

const getRelevantSessions = (sessions, string) => {
    return sessions
        .filter(name => name.includes(string))
        .map(name => name.replace(string, ''));
};

const convertCSTimer = sessionTimes =>
    sessionTimes.map(entry => {
        const [timeInfo, scramble, comment, unixTimestamp] = entry;
        const [penalty, timeMS] = timeInfo;
        let time = 0;
        if (penalty < 0) {
            time = 9999;
        } else {
            time = Math.floor(timeMS / 10) / 100;
        }

        return {
            id: `cstimer-${unixTimestamp}`,
            scramble,
            time,
            createdAt: moment.unix(unixTimestamp).valueOf(),
            penalty: penalty > 0,
        };
    });

const importCSTimerForeign = async (selectedSessions, convertedTimes) => {
    const relevantSessions = getRelevantSessions(
        selectedSessions,
        'foreign***'
    );

    await Promise.all(
        relevantSessions.map(async sessionName => {
            const oldHistory = await getArray(sessionName);
            const newHistory = oldHistory
                .concat(convertedTimes)
                .sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateA - dateB;
                })
                .slice(0, SESSION_LIMIT);
            await setArray(sessionName, newHistory, CHUNK_LIMIT);
        })
    );
};

const importCSTimerLocal = (selectedSessions, convertedTimes) => {
    const relevantSessions = getRelevantSessions(selectedSessions, 'local***');

    relevantSessions.forEach(sessionName => {
        const oldHistory = JSON.parse(
            localStorage.getItem(sessionName) || '[]'
        );
        const newHistory = oldHistory
            .concat(convertedTimes)
            .sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateA - dateB;
            })
            .slice(0, SESSION_LIMIT);
        localStorage.setItem(sessionName, JSON.stringify(newHistory));
    });
};

const Container = styled.div`
    display: grid;
    grid-template-columns: auto;
    gap: 0.5em;
    align-content: center;
    margin: 0 0.3em 0.3em;

    @media screen and (max-device-width: 1280px) {
        font-size: 0.8em;
    }
`;

const Heading = styled.h3`
    text-align: center;
`;

const TextArea = styled.textarea``;

const Button = styled.button``;

const SessionImporter = ({ selectedSessions, refreshHack }) => {
    const [importText, setImportText] = useState('');
    const [importObject, setImportObject] = useState({});
    const [importError, setImportError] = useState(null);

    useEffect(() => {
        try {
            const temp = JSON.parse(importText || '{}');
            delete temp.properties;
            setImportObject(temp);
            setImportError(null);
        } catch (e) {
            setImportError(e.message);
        }
    }, [importText]);

    return (
        <Container>
            <Heading>Importer</Heading>
            <a href="https://cstimer.net/" target="_blank">
                csTimer.net
            </a>
            <TextArea
                onChange={e => {
                    setImportText(e.target.value);
                }}
                value={importText}
            />
            {importError && <pre>{importError}</pre>}
            {Object.entries(importObject).map(value => {
                const [sessionName, sessionTimes] = value;
                return (
                    <Button
                        key={sessionName}
                        onClick={async () => {
                            const convertedTimes = convertCSTimer(sessionTimes);
                            await importCSTimerForeign(
                                selectedSessions,
                                convertedTimes
                            );
                            importCSTimerLocal(
                                selectedSessions,
                                convertedTimes
                            );
                            refreshHack();
                        }}
                    >
                        {sessionName}
                    </Button>
                );
            })}
        </Container>
    );
};

export default SessionImporter;
