import React, { useState } from 'react';
import styled from 'styled-components';

import { BigButton } from './styles';

const MAX_TODOS = 3;

const TimerContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const TimerMainText = styled.div`
    color: white;
    margin-bottom: 1em;
`;

const OtherTasks = styled(TimerMainText)`
    margin-top: 1em;
    text-decoration: ${props => (props.active ? 'line-through' : 'none')};
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

const OtherTasksButton = styled(BigButton)`
    color: white;
    background-color: transparent;
    border: 1px solid grey;
`;

const Timer = ({ closeTimer, activeTodo, todos }) => {
    const [otherTodosVisible, setOtherTodosVisible] = useState(false);

    return (
        activeTodo && (
            <TimerContainer>
                <CloseButton onClick={closeTimer}>
                    <i className="fa fa-close" />
                </CloseButton>
                <TimerMainText>
                    {otherTodosVisible
                        ? todos
                              .slice(0, MAX_TODOS)
                              .map(({ id, task, blocker }) => (
                                  <OtherTasks active={id === activeTodo.id}>{`${task}${
                                      blocker ? ` (${blocker})` : ''
                                  }`}</OtherTasks>
                              ))
                        : activeTodo.task}
                </TimerMainText>
                <OtherTasksButton
                    onClick={e => {
                        setOtherTodosVisible(!otherTodosVisible);
                        e.target.blur();
                    }}
                >
                    {`${otherTodosVisible ? 'Hide' : 'Show'} Other Tasks`}
                </OtherTasksButton>
            </TimerContainer>
        )
    );
};

export default Timer;
