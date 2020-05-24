import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';

const ultraDisco = keyframes`
    0%, 100% {
        background-color: #FF0000;
    }

    17% {
        background-color: #FFFF00;
    }

    33% {
        background-color: #00FF00;
    }

    50% {
        background-color: #00FFFF;
    }

    67% {
        background-color: #0000FF;
    }

    83%
        {
        background-color: #FF00FF;
    }
`;

const ultraDiscoAnimation = css`
    animation-name: ${ultraDisco};
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
`;

const BreakTimerContainer = styled.div`
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    width: 80vw;
    height: 5em;
    border: 1px solid grey;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1em;
    align-items: center;
    padding: 1em;
    background-color: white;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 1em;
    right: 1em;
    width: 2em;
    height: 2em;
    border-radius: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    color: grey;
    background-color: transparent;
    border: 1px solid grey;
`;

const BreakMessage = styled.div`
    font-size: 2em;
`;

const RemainingTimeDisplay = styled(BreakMessage)`
    font-family: monospace;
    font-size: 2em;
`;

const ProgressBarOuter = styled.div`
    height: 80%;
    border: 1px solid grey;
    ${props => (props.done ? ultraDiscoAnimation : '')}
`;

const ProgressBarInner = styled.div.attrs(props => ({
    style: {
        width: `${props.progress * 100}%`,
    },
}))`
    float: right;
    background-color: darkslategrey;
    content: '';
    height: 100%;
    transition: width 0.47s linear;
`;

const calculateRemainingSeconds = endTimestamp => {
    const ms = endTimestamp - Date.now();
    return ms / 1000;
};

const formatMinutesAndSeconds = seconds => {
    const remainingSeconds = Math.floor(seconds % 60);
    const minutes = Math.floor(seconds / 60);

    return `${minutes}:${`${remainingSeconds}`.padStart(2, '0')}`;
};

const BreakTimer = ({ closeTimer, endTimestamp, breakDurationSeconds }) => {
    const [startTimestamp, setStartTimestamp] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState(breakDurationSeconds);
    const [remainingSecondsInterval, setRemainingSecondsInterval] = useState(null);

    useEffect(() => {
        setStartTimestamp(Date.now());
        setRemainingSecondsInterval(
            setInterval(() => {
                const a = calculateRemainingSeconds(endTimestamp);
                if (a > 0) {
                    setRemainingSeconds(a);
                } else if (a > -5) {
                    setRemainingSeconds(0);
                }
            }, 500)
        );
        return () => {
            if (typeof remainingSecondsInterval === 'number') {
                clearInterval(remainingSecondsInterval);
            }
        };
    }, [endTimestamp]);

    return (
        <BreakTimerContainer>
            <CloseButton onClick={closeTimer}>
                <i className="fa fa-close" />
            </CloseButton>
            <BreakMessage>Break</BreakMessage>
            <ProgressBarOuter done={remainingSeconds <= 0}>
                <ProgressBarInner progress={Math.min(remainingSeconds / breakDurationSeconds, 1)} />
            </ProgressBarOuter>
            <RemainingTimeDisplay>{formatMinutesAndSeconds(remainingSeconds)}</RemainingTimeDisplay>
        </BreakTimerContainer>
    );
};

export default BreakTimer;
