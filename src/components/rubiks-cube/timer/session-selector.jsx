import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { listItems } from '../../../services/foreignStorage';

export const BASE_LOCAL_STORAGE_KEY = 'CUBE_TIMER_STORAGE';

export const getCurrentSession = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionName = urlParams.get('session') ? urlParams.get('session').toUpperCase() : '';
    return sessionName === 'DEFAULT' ? '' : sessionName;
};

export const getSessionStorageKey = () => {
    if (getCurrentSession()) {
        return `${BASE_LOCAL_STORAGE_KEY}-${getCurrentSession()}`;
    }
    return BASE_LOCAL_STORAGE_KEY;
};

export const listSessions = async () => {
    const uniqueSessions = new Set([
        ...(await listItems())
            .filter((key) => key.startsWith(`${BASE_LOCAL_STORAGE_KEY}-`))
            .map((key) => key.replace(`${BASE_LOCAL_STORAGE_KEY}-`, ''))
            .filter((key) => key !== 'DEFAULT'),
        getCurrentSession(),
    ]);
    const sessions = Array.from(uniqueSessions).sort();
    return sessions;
};

const Container = styled.div`
    overflow-y: scroll;
    max-height: 360px;

    @media screen and (max-device-width: 1280px) {
        max-height: 200px;
    }
`;

const SessionLink = styled.a`
    display: block;
    margin: 0 0.3em 0.3em;
    text-decoration: none;
    color: black;
    ${(props) => (props.current ? 'font-weight: bold' : '')}
`;

const SessionForm = styled.form`
    input {
        width: 8em;
    }
`;

const SessionSelector = ({ hideNew }) => {
    const currentSession = getCurrentSession();
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        (async () => {
            setSessions(await listSessions());
        })();
    }, []);

    return (
        <Container>
            {currentSession === '' ? (
                <SessionLink as="span" current>
                    Default
                </SessionLink>
            ) : (
                <SessionLink href={location.pathname}>Default</SessionLink>
            )}
            {sessions.map((sessionName) => {
                return currentSession === sessionName ? (
                    <SessionLink as="span" key={`session-${sessionName}`} current>
                        {sessionName}
                    </SessionLink>
                ) : (
                    <SessionLink
                        key={`session-${sessionName}`}
                        href={`${location.pathname}?session=${sessionName}`}
                    >
                        {sessionName}
                    </SessionLink>
                );
            })}
            {!hideNew && (
                <SessionForm method="get">
                    <input name="session" type="text" placeholder="New" />
                </SessionForm>
            )}
        </Container>
    );
};

export default SessionSelector;
