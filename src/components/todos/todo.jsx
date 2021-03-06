import React, { useState } from 'react';
import styled from 'styled-components';

import TodoEditor from './todoEditor';
import { Button } from './styles';

const Container = styled.div``;

const Row = styled.div`
    display: grid;
    grid-template-columns: 2.5em 3em auto auto 3em 2.5em 2.5em;
    gap: 0 1em;
    align-items: center;
`;

const Todo = ({ todo, isActive, chooseTodo, updateTodo, deleteTodo }) => {
    const [editorVisible, setEditorVisible] = useState(false);

    return (
        <Container>
            <Row>
                <Button active={isActive} onClick={chooseTodo}>
                    Next
                </Button>
                <div style={{ textAlign: 'right' }}>{todo.importance}</div>
                <div>{todo.task}</div>
                <div>{todo.blocker}</div>
                <div>{todo.category}</div>
                <Button
                    active={editorVisible}
                    onClick={() => {
                        setEditorVisible(!editorVisible);
                    }}
                >
                    <i className="fa fa-pencil" />
                </Button>
                <Button
                    onClick={() => {
                        if (window.confirm(`Finished ${todo.task}?`)) {
                            deleteTodo(todo.id);
                        }
                    }}
                >
                    <i className="fa fa-check" />
                </Button>
            </Row>
            {editorVisible && (
                <TodoEditor
                    todo={todo}
                    updateTodo={newTodo => {
                        setEditorVisible(false);
                        updateTodo(newTodo);
                    }}
                    deleteTodo={todoId => {
                        if (window.confirm(`Really delete ${todo.task}?`)) {
                            setEditorVisible(false);
                            deleteTodo(todoId);
                        }
                    }}
                />
            )}
        </Container>
    );
};

export default Todo;
