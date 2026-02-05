const input = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const list = document.getElementById("todo-list");

const STORAGE_KEY = "todos";

const loadTodos = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const saveTodos = (todos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

const renderTodos = (todos) => {
  list.innerHTML = "";
  todos.forEach((todo, index) => {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = todo;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Löschen";
    removeButton.addEventListener("click", () => {
      const updated = loadTodos().filter((_, i) => i !== index);
      saveTodos(updated);
      renderTodos(updated);
    });

    item.append(text, removeButton);
    list.appendChild(item);
  });
};

const addTodo = () => {
  const value = input.value.trim();
  if (!value) {
    return;
  }

  const todos = loadTodos();
  todos.push(value);
  saveTodos(todos);
  renderTodos(todos);
  input.value = "";
  input.focus();
};

addButton.addEventListener("click", addTodo);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

renderTodos(loadTodos());
