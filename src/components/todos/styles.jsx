import styled from 'styled-components';

export const Button = styled.button`
    background-color: ${props => (props.active ? 'grey' : 'white')};
    color: ${props => (props.active ? 'white' : 'black')};
    border: 1px solid grey;
    padding: 0.2em;
`;

export const BigButton = styled(Button)`
    padding: 1em;
`;

export const Label = styled.label`
    display: flex;
    align-items: center;
`;

export const List = styled.div`
    display: grid;
    grid-template-columns: auto;
    gap: 0.2em 0;
    justify-content: stretch;
    min-width: 80%;
    margin-top: 0.5em;

    & > div:nth-child(2n) {
        background-color: #f5f5f5;
    }
`;

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 0.5em;
`;
