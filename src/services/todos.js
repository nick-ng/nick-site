import { getItem, setItem } from './foreignStorage';

const STORE_PREFIX = 'DIONE';
const TODOS_STORE = `${STORE_PREFIX}-TODOS`;

export const listTodos = async () => {
    const [todos] = await Promise.all([getItem(TODOS_STORE)]);
    console.log('todos', todos);
    return JSON.parse(todos || '[]');
};

export const deleteTodo = async (todoList, todoId) => {
    const newTodoList = todoList.filter(todo => todo.id !== todoId);

    await setItem(TODOS_STORE, JSON.stringify(newTodoList));

    return newTodoList;
};

export const updateTodo = async (todoList, newTodo) => {
    const newTodoList = todoList.filter(todo => todo.id !== newTodo.id).concat([newTodo]);

    await setItem(TODOS_STORE, JSON.stringify(newTodoList));

    return newTodoList;
};

export const createTodo = async (todoList, newTodo) => {
    return updateTodo(todoList, newTodo);
};
