import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import SessionList from './session-list';

import { listItems, getItem, setItem } from '../../../services/foreignStorage';
import { BASE_LOCAL_STORAGE_KEY } from '../timer/session-selector';

const listSessions = () => {
    return Object.keys(localStorage).filter(key => key.startsWith(BASE_LOCAL_STORAGE_KEY));
};

const Container = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr 3fr;
    gap: 0 0;
    justify-items: center;
    align-items: start;
`;

const Controls = styled.div``;

const Button = styled.button``;

const CubeSessionManager = () => {
    const [foreignSessions, setForeignSessions] = useState({});
    const [localSessions, setLocalSessions] = useState({});
    const [selectedSession, setSelectedSession] = useState('');

    useEffect(() => {
        (async () => {
            const foreignSessionList = (await listItems()).filter(key =>
                key.startsWith(BASE_LOCAL_STORAGE_KEY)
            );
            const fetchedForeignSessions = {};
            for (let sessionName of foreignSessionList) {
                const temp = await getItem(sessionName);
                fetchedForeignSessions[sessionName] = JSON.parse(temp);
            }
            setForeignSessions(fetchedForeignSessions);
        })();

        const localSessions = listSessions();

        setLocalSessions(
            localSessions.reduce((accumulator, sessionName) => {
                accumulator[sessionName] = JSON.parse(localStorage.getItem(sessionName));
                return accumulator;
            }, {})
        );
    }, []);

    return (
        <Container>
            <SessionList title="Foreign Sessions" sessions={foreignSessions} />
            <Controls>
                <Button>Copy to Foreign</Button>
                <Button>Copy to Local</Button>
                <Button>Merge</Button>
            </Controls>
            <SessionList title="Local Sessions" sessions={localSessions} />
        </Container>
    );
};

export default CubeSessionManager;
