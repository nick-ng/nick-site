import React from 'react';
import styled from 'styled-components';

const NotesContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const ThreeColumn = styled.div`
    display: grid;
    justify-content: start;
    grid-template-columns: auto auto auto;
    gap: 10px;
`;

const TableHeader = styled.div`
    font-weight: bold;
`;

const TableCell = styled.div``;

const BERRY_INFO = [
    {
        berry: 'Figy',
        flavour: 'Spicy',
        stat: 'Atk',
    },
    {
        berry: 'Wiki',
        flavour: 'Dry',
        stat: 'SpA',
    },
    {
        berry: 'Mago',
        flavour: 'Sweet',
        stat: 'Spe',
    },
    {
        berry: 'Aguav',
        flavour: 'Bitter',
        stat: 'SpD',
    },
    {
        berry: 'Iapapa',
        flavour: 'Sour',
        stat: 'Def',
    },
].sort((a, b) => a.stat.localeCompare(b.stat));

const PokemonNotes = () => (
    <NotesContainer>
        <h1>Pokemon Notes</h1>
        <ThreeColumn>
            <TableHeader>Berry</TableHeader>
            <TableHeader>Flavour</TableHeader>
            <TableHeader>Confusion Stat</TableHeader>
            {BERRY_INFO.map(({ berry, flavour, stat }) => (
                <>
                    <TableCell>{berry}</TableCell>
                    <TableCell>{flavour}</TableCell>
                    <TableCell>{stat}</TableCell>
                </>
            ))}
        </ThreeColumn>
    </NotesContainer>
);

export default PokemonNotes;
