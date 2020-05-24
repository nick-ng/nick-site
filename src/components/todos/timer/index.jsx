import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Label } from '../styles';
import { listTodos, updateTodo, deleteTodo } from '../../../services/todos';

const Container = styled.div``;

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
`;

const isCurrentlyWorkHours = () => {
    const now = new Date();
    if (now.getDay() === 0 || now.getDay() === 6 || now.getHours() < 9 || now.getHours() > 5) {
        return false;
    }
    return true;
};

const TodoTimer = () => {
    const [todos, setTodos] = useState([]);
    const [workOnly, setWorkOnly] = useState(isCurrentlyWorkHours());
    const [timerVisible, setTimerVisible] = useState(false);

    useEffect(() => {
        const fetchTodos = async () => {
            setTodos(await listTodos());
        };
        fetchTodos();
    }, []);

    return (
        <Container>
            <h2>Dione: Todo Timer</h2>
            <Label>
                Show work tasks only:{' '}
                <input
                    name="workOnly"
                    type="checkbox"
                    checked={workOnly}
                    onChange={() => setWorkOnly(!workOnly)}
                />
            </Label>
            <button onClick={() => setTimerVisible(true)}>Start</button>
            {timerVisible && (
                <TimerContainer>
                    <TimerMainText>Hello World</TimerMainText>
                    <button onClick={() => setTimerVisible(false)}>Stop</button>
                </TimerContainer>
            )}
        </Container>
    );
};

export default TodoTimer;
