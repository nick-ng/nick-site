export const isCurrentlyWorkHours = () => {
    const now = new Date();
    if (now.getDay() === 0 || now.getDay() === 6 || now.getHours() < 9 || now.getHours() > 5) {
        return false;
    }
    return true;
};

export const filterTodos = (todos, workOnly) =>
    todos.filter(todo => !workOnly || todo.category === 'work');
