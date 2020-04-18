import React from 'react';
import styled from 'styled-components';
import chunk from 'lodash/chunk';

import css from './styles.css';

const STICKER_SIZE = 30;
const COLOR_MAP = {
    U: 'white',
    R: 'red',
    F: 'green',
    D: 'yellow',
    L: 'orange',
    B: 'blue',
};

const Scramble = styled.div`
    display: flex;
    justify-content: center;
    font-size: 1.5em;
`;

const CubeNet = styled.div`
    margin-top: 10px;
    justify-content: center;
    display: grid;
    grid-template-columns: ${STICKER_SIZE * 3}px ${STICKER_SIZE * 3}px ${STICKER_SIZE * 3}px ${STICKER_SIZE *
            3}px;
    grid-template-rows: ${STICKER_SIZE * 3}px ${STICKER_SIZE * 3}px ${STICKER_SIZE * 3}px;
    gap: 5px;
`;

const Face = styled.div`
    display: grid;
    grid-template-columns: ${STICKER_SIZE}px ${STICKER_SIZE}px ${STICKER_SIZE}px;
    grid-template-rows: ${STICKER_SIZE}px ${STICKER_SIZE}px ${STICKER_SIZE}px;
    grid-column-start: ${props => props.column};
    grid-row-start: ${props => props.row};
`;

const Sticker = styled.div`
    width: ${STICKER_SIZE}px;
    height: ${STICKER_SIZE}px;
    background-color: ${props => COLOR_MAP[props.scolor]};
    box-sizing: border-box;
    border: 1px solid black;
`;

const CubeScrambleHelper = ({ cubeString, scramble }) => {
    const [uFace, rFace, fFace, dFace, lFace, bFace] = chunk(cubeString.split(''), 9);
    return (
        <div className={css.cubeScrambleHelper}>
            <Scramble>{scramble}</Scramble>
            {cubeString.length === 54 && (
                <CubeNet>
                    <Face column={2} row={1}>
                        {uFace.map((sticker, i) => (
                            <Sticker key={`u${i}`} scolor={sticker} />
                        ))}
                    </Face>
                    <Face column={1} row={2}>
                        {lFace.map((sticker, i) => (
                            <Sticker key={`l${i}`} scolor={sticker} />
                        ))}
                    </Face>
                    <Face column={2} row={2}>
                        {fFace.map((sticker, i) => (
                            <Sticker key={`f${i}`} scolor={sticker} />
                        ))}
                    </Face>
                    <Face column={3} row={2}>
                        {rFace.map((sticker, i) => (
                            <Sticker key={`r${i}`} scolor={sticker} />
                        ))}
                    </Face>
                    <Face column={4} row={2}>
                        {bFace.map((sticker, i) => (
                            <Sticker key={`b${i}`} scolor={sticker} />
                        ))}
                    </Face>
                    <Face column={2} row={3}>
                        {dFace.map((sticker, i) => (
                            <Sticker key={`d${i}`} scolor={sticker} />
                        ))}
                    </Face>
                </CubeNet>
            )}
        </div>
    );
};

export default CubeScrambleHelper;
