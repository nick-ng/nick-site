import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import SessionRow from './session-row';

const Container = styled.div``;

const Table = styled.table`
    border-collapse: collapse;

    td,
    th {
        border: 1px solid grey;
        padding: 0.2em;
    }
`;

const Heading = styled.th`
    font-weight: bold;
    text-align: ${props => props.alignment || 'right'};
`;

const SessionList = ({
    title,
    id,
    sessions,
    selectedSessions,
    toggleSelectedSessions,
}) => {
    return (
        <Container>
            <h3>{title}</h3>
            <Table>
                <thead>
                    <tr>
                        <Heading></Heading>
                        <Heading alignment="left">Session Name</Heading>
                        <Heading>Solves</Heading>
                        <Heading>Best</Heading>
                        <Heading>Average</Heading>
                        <Heading alignment="center">Link</Heading>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(sessions).map(([key, value]) => (
                        <SessionRow
                            key={key}
                            id={id}
                            sessionName={key}
                            sessionTimes={value}
                            selectedSessions={selectedSessions}
                            toggleSelectedSessions={toggleSelectedSessions}
                        />
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default SessionList;
