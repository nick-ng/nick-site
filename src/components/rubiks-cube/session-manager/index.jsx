import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import SessionList from './session-list';
import SessionImporter from './session-importer';

import {
    listItems,
    getArray,
    setArray,
} from '../../../services/foreignStorage';
import { BASE_LOCAL_STORAGE_KEY } from '../timer/session-selector';

const listSessions = () => {
    return Object.keys(localStorage).filter(key =>
        key.startsWith(BASE_LOCAL_STORAGE_KEY)
    );
};

const Container = styled.div`
    display: grid;
    grid-template-columns: 3fr 2fr 3fr;
    gap: 0 0;
    justify-items: center;
    align-items: start;
`;

const Controls = styled.div`
    grid-column: 1 / 4;
`;

const Button = styled.button``;

const CubeSessionManager = () => {
    const [foreignSessions, setForeignSessions] = useState({});
    const [localSessions, setLocalSessions] = useState({});
    const [selectedSessions, setSelectedSessions] = useState([]);
    const [refreshHack, setRefreshHack] = useState(0);

    useEffect(() => {
        (async () => {
            const foreignSessionList = (await listItems()).filter(key =>
                key.startsWith(BASE_LOCAL_STORAGE_KEY)
            );
            const fetchedForeignSessions = {};
            const fetchedSessions = await Promise.all(
                foreignSessionList.map(sessionName => getArray(sessionName))
            );
            foreignSessionList.forEach((sessionName, i) => {
                fetchedForeignSessions[sessionName] = fetchedSessions[i];
            });

            setForeignSessions(fetchedForeignSessions);
        })();

        const localSessions = listSessions();

        setLocalSessions(
            localSessions.reduce((accumulator, sessionName) => {
                accumulator[sessionName] = JSON.parse(
                    localStorage.getItem(sessionName)
                );
                return accumulator;
            }, {})
        );
    }, [refreshHack]);

    const toggleSelectedSessions = sessionName => {
        if (selectedSessions.includes(sessionName)) {
            setSelectedSessions(
                selectedSessions.filter(a => a !== sessionName)
            );
        } else {
            setSelectedSessions(selectedSessions.concat([sessionName]));
        }
    };

    return (
        <Container>
            {/* <Controls>
                <Button>Copy to Foreign</Button>
                <Button>Copy to Local</Button>
                <Button>Merge</Button>
            </Controls> */}
            <SessionList
                title="Foreign Sessions"
                id="foreign"
                sessions={foreignSessions}
                selectedSessions={selectedSessions}
                toggleSelectedSessions={toggleSelectedSessions}
            />
            <SessionImporter
                selectedSessions={selectedSessions}
                refreshHack={() => setRefreshHack(refreshHack + 1)}
            />
            <SessionList
                title="Local Sessions"
                id="local"
                sessions={localSessions}
                selectedSessions={selectedSessions}
                toggleSelectedSessions={toggleSelectedSessions}
            />
        </Container>
    );
};

export default CubeSessionManager;
