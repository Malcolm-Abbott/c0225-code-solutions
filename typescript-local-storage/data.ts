/* exported todos, writeTodos */
interface Todo {
  todoId: string;
  task: string;
  isCompleted: boolean;
}

let todos: Todo[] = [];

function writeTodos(): void {
  const todosJSON = JSON.stringify(todos);
  localStorage.setItem('todos-storage', todosJSON);
}

function readTodos(): Todo[] {
  const todosJSON = localStorage.getItem('todos-storage');
  if (todosJSON) {
    return JSON.parse(todosJSON);
  }
  return [];
}

todos = readTodos();
