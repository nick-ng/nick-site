import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Label } from '../styles';
import Todo from './todo';
import TodoEditor from './todoEditor';
import { listTodos, updateTodo, deleteTodo } from '../../../services/todos';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const List = styled.div`
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

const isCurrentlyWorkHours = () => {
    const now = new Date();
    if (now.getDay() === 0 || now.getDay() === 6 || now.getHours() < 9 || now.getHours() > 5) {
        return false;
    }
    return true;
};

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [workOnly, setWorkOnly] = useState(isCurrentlyWorkHours());

    useEffect(() => {
        const fetchTodos = async () => {
            setTodos(await listTodos());
        };
        fetchTodos();
    }, []);

    return (
        <Container>
            <h2>Dione: Todo List</h2>
            <Label>
                Show work tasks only:{' '}
                <input
                    name="workOnly"
                    type="checkbox"
                    checked={workOnly}
                    onChange={() => setWorkOnly(!workOnly)}
                />
            </Label>
            <TodoEditor
                updateTodo={async newTodo => {
                    setTodos(await updateTodo(todos, newTodo));
                }}
            />
            <List>
                {todos
                    .filter(todo => !workOnly || todo.category === 'work')
                    .map(todo => (
                        <Todo
                            todo={todo}
                            key={todo.id}
                            updateTodo={async newTodo => {
                                setTodos(await updateTodo(todos, newTodo));
                            }}
                            deleteTodo={async todoId => {
                                setTodos(await deleteTodo(todos, todoId));
                            }}
                        />
                    ))}
            </List>
        </Container>
    );
};

export default TodoList;
