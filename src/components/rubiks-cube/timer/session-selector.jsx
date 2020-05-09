import React from 'react';
import styled from 'styled-components';

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

const listSessions = () => {
    const uniqueSessions = new Set([
        ...Object.keys(localStorage)
            .filter(key => key.startsWith(`${BASE_LOCAL_STORAGE_KEY}-`))
            .map(key => key.replace(`${BASE_LOCAL_STORAGE_KEY}-`, ''))
            .filter(key => key !== 'DEFAULT'),
        getCurrentSession(),
    ]);
    const sessions = Array.from(uniqueSessions).sort();
    return sessions;
};

const Container = styled.div`
    overflow-y: scroll;
    height: 360px;
`;

const SessionLink = styled.a`
    display: block;
    margin: 0 0.3em 0.3em;
    text-decoration: none;
    color: black;
    ${props => (props.current ? 'font-weight: bold' : '')}
`;

const SessionForm = styled.form`
    input {
        width: 8em;
    }
`;

const SessionSelector = () => {
    const currentSession = getCurrentSession();
    return (
        <Container>
            {currentSession === '' ? (
                <SessionLink as="span" current>
                    Default
                </SessionLink>
            ) : (
                <SessionLink href={`/cubetimer`}>Default</SessionLink>
            )}
            {listSessions().map(sessionName => {
                return currentSession === sessionName ? (
                    <SessionLink as="span" key={`session-${sessionName}`} current>
                        {sessionName}
                    </SessionLink>
                ) : (
                    <SessionLink
                        key={`session-${sessionName}`}
                        href={`/cubetimer?session=${sessionName}`}
                    >
                        {sessionName}
                    </SessionLink>
                );
            })}
            <SessionForm method="get">
                <input name="session" type="text" placeholder="New" />
            </SessionForm>
        </Container>
    );
};

export default SessionSelector;
