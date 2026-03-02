'use strict';
let todos = [];
function writeTodos() {
  const todosJSON = JSON.stringify(todos);
  localStorage.setItem('todos-storage', todosJSON);
}
function readTodos() {
  const todosJSON = localStorage.getItem('todos-storage');
  if (todosJSON) {
    return JSON.parse(todosJSON);
  }
  return [];
}
todos = readTodos();
