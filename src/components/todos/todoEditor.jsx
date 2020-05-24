import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';

import { Button } from './styles';

const Container = styled.form`
    display: flex;
    flex-direction: row;
`;

const ButtonFlex = styled(Button)`
    flex-basis: 2.5em;
    flex-shrink: 0;
    flex-grow: 0;
`;

const Input = styled.input`
    border: 1px solid grey;
    padding: 0.2em 0.5em;
    flex-grow: ${props => props.grow || 0};
    flex-basis: ${props => `${props.basis || 0}em`};
    min-width: 0;
`;

const Select = styled.select`
    border: 1px solid grey;
    padding: 0.2em;
`;

const Option = styled.option``;

const TodoEditor = ({ todo, updateTodo, deleteTodo }) => {
    const [importance, setImportance] = useState(todo?.importance || 0);
    const [task, setTask] = useState(todo?.task || '');
    const [blocker, setBlocker] = useState(todo?.blocker || '');
    const [category, setCategory] = useState(todo?.category || 'work');

    return (
        <Container
            onSubmit={e => {
                e.preventDefault();
                updateTodo({
                    id: todo?.id || uuid(),
                    importance,
                    task,
                    blocker,
                    category,
                    timestamp: todo?.timestamp || Date.now(),
                });
            }}
        >
            <Input
                type="number"
                style={{ textAlign: 'right' }}
                value={importance}
                placeholder="Importance"
                onChange={e => {
                    setImportance(e.target.value);
                    e.preventDefault();
                }}
                basis={6}
            />
            <Input
                type="text"
                value={task}
                placeholder="Task"
                onChange={e => {
                    setTask(e.target.value);
                    e.preventDefault();
                }}
                grow={2}
            />
            <Input
                type="text"
                value={blocker}
                placeholder="Blocker"
                onChange={e => {
                    setBlocker(e.target.value);
                    e.preventDefault();
                }}
                grow={1}
            />
            <Select
                type="text"
                value={category}
                onChange={e => {
                    setCategory(e.target.value);
                    e.preventDefault();
                }}
            >
                <Option value="other">Other</Option>
                <Option value="work">Work</Option>
            </Select>
            {updateTodo && (
                <ButtonFlex>
                    <i className="fa fa-save" />
                </ButtonFlex>
            )}
            {deleteTodo && (
                <ButtonFlex
                    type="button"
                    onClick={() => {
                        deleteTodo(todo.id);
                    }}
                >
                    <i className="fa fa-trash" />
                </ButtonFlex>
            )}
        </Container>
    );
};

export default TodoEditor;
