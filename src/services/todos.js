import { getItem, setItem } from './foreignStorage';

const STORE_PREFIX = 'DIONE';
const TODOS_STORE = `${STORE_PREFIX}-TODOS`;

const todoSortFunction = (a, b) => {
    const importanceDifference = b.importance - a.importance;
    return importanceDifference === 0 ? a.timestamp - b.timestamp : importanceDifference;
};

export const listTodos = async () => {
    const [todos] = await Promise.all([getItem(TODOS_STORE)]);
    return JSON.parse(todos || '[]').sort(todoSortFunction);
};

export const deleteTodo = (todoList, todoId) => {
    const newTodoList = todoList.filter(todo => todo.id !== todoId);

    setItem(TODOS_STORE, JSON.stringify(newTodoList));

    return newTodoList.sort(todoSortFunction);
};

export const updateTodo = (todoList, newTodo) => {
    const newTodoList = todoList.filter(todo => todo.id !== newTodo.id).concat([newTodo]);

    setItem(TODOS_STORE, JSON.stringify(newTodoList));

    return newTodoList.sort(todoSortFunction);
};

export const createTodo = updateTodo;
