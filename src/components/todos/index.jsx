import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { BigButton, Label, List, Row } from './styles';
import { filterTodos, isCurrentlyWorkHours } from './utils';
import Todo from './todo';
import TodoEditor from './todoEditor';
import Timer from './timer';
import BreakTimer from './breakTimer';
import { listTodos, updateTodo, deleteTodo } from '../../services/todos';

const POMODORO_TIME = 25 * 60 * 1000; // 25 minutes;
const BREAK_TIME = 5 * 60 * 1000; // 5 minutes;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [workOnly, setWorkOnly] = useState(isCurrentlyWorkHours());
    const [timerVisible, setTimerVisible] = useState(false);
    const [breakTimerVisible, setBreakTimerVisible] = useState(false);
    const [breakEndTimestamp, setBreakEndTimestamp] = useState(0);
    const [activeTodoId, setActiveTodoId] = useState(null);
    const [newTodoId, setNewTodoId] = useState(uuid());

    useEffect(() => {
        const fetchTodos = async () => {
            const fetchedTodos = await listTodos();
            setTodos(fetchedTodos);
            const filteredTodos = filterTodos(fetchedTodos, workOnly);
            if (filteredTodos.length > 0) {
                setActiveTodoId(filteredTodos[0].id);
            }
        };
        fetchTodos();
    }, []);

    const startTimer = () => {
        setTimerVisible(true);
        setTimeout(() => {
            setTimerVisible(false);
            setBreakTimerVisible(true);
            setBreakEndTimestamp(Date.now() + BREAK_TIME);
        }, POMODORO_TIME);
    };

    const activeTodo = todos.find(todo => todo.id === activeTodoId);

    return (
        <Container>
            <h2>Dione: Todo List</h2>
            <Row>
                <Label>
                    Show work tasks only:{' '}
                    <input
                        name="workOnly"
                        type="checkbox"
                        checked={workOnly}
                        onChange={() => setWorkOnly(!workOnly)}
                    />
                </Label>
                <BigButton style={{ marginLeft: '1em' }} onClick={startTimer}>
                    Start Timer
                </BigButton>
            </Row>
            <TodoEditor
                updateTodo={async newTodo => {
                    setTodos(await updateTodo(todos, newTodo));
                    setNewTodoId(uuid());
                }}
                key={newTodoId}
                newTodoId={newTodoId}
            />
            <List>
                {filterTodos(todos, workOnly).map(todo => (
                    <Todo
                        todo={todo}
                        key={todo.id}
                        isActive={activeTodoId === todo.id}
                        chooseTodo={() => setActiveTodoId(todo.id)}
                        updateTodo={async newTodo => {
                            setTodos(await updateTodo(todos, newTodo));
                        }}
                        deleteTodo={async todoId => {
                            setTodos(await deleteTodo(todos, todoId));
                        }}
                    />
                ))}
            </List>
            {timerVisible && (
                <Timer
                    closeTimer={() => setTimerVisible(false)}
                    todos={filterTodos(todos, workOnly)}
                    activeTodo={activeTodo}
                />
            )}
            {breakTimerVisible && (
                <BreakTimer
                    closeTimer={() => setBreakTimerVisible(false)}
                    endTimestamp={breakEndTimestamp}
                    breakDurationSeconds={BREAK_TIME / 1000}
                />
            )}
        </Container>
    );
};

export default TodoList;
