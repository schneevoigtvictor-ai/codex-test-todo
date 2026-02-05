const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const prioritySelect = document.getElementById("todo-priority");
const addButton = document.getElementById("add-button");
const tutorialButton = document.getElementById("tutorial-button");
const list = document.getElementById("todo-list");

const STORAGE_KEY = "todos";

const formatDate = (value) => {
  if (!value) {
    return "Kein Datum";
  }
  const date = new Date(value);
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(date);
};

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
    if (todo.completed) {
      item.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      const updated = loadTodos().map((entry, i) =>
        i === index ? { ...entry, completed: checkbox.checked } : entry
      );
      saveTodos(updated);
      renderTodos(updated);
    });

    const content = document.createElement("div");
    content.className = "todo-content";

    const title = document.createElement("span");
    title.className = "todo-title";
    title.textContent = todo.text;

    const meta = document.createElement("div");
    meta.className = "todo-meta";

    const date = document.createElement("span");
    date.textContent = `Fällig: ${formatDate(todo.dueDate)}`;

    const priority = document.createElement("span");
    priority.className = `priority ${todo.priority}`;
    priority.textContent =
      todo.priority === "high"
        ? "Hoch"
        : todo.priority === "medium"
          ? "Mittel"
          : "Gering";

    meta.append(date, priority);
    content.append(title, meta);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Löschen";
    removeButton.addEventListener("click", () => {
      const updated = loadTodos().filter((_, i) => i !== index);
      saveTodos(updated);
      renderTodos(updated);
    });

    item.append(checkbox, content, removeButton);
    list.appendChild(item);
  });
};

const addTodo = () => {
  const value = input.value.trim();
  if (!value) {
    return;
  }

  const todos = loadTodos();
  todos.push({
    text: value,
    dueDate: dateInput.value,
    priority: prioritySelect.value,
    completed: false,
  });
  saveTodos(todos);
  renderTodos(todos);
  input.value = "";
  dateInput.value = "";
  prioritySelect.value = "low";
  input.focus();
};

const loadTutorial = () => {
  const sampleTodos = [
    {
      text: "Projektplan öffnen",
      dueDate: "",
      priority: "low",
      completed: false,
    },
    {
      text: "Einkaufsliste schreiben",
      dueDate: "",
      priority: "medium",
      completed: false,
    },
    {
      text: "Präsentation vorbereiten",
      dueDate: "",
      priority: "high",
      completed: false,
    },
  ];

  saveTodos(sampleTodos);
  renderTodos(sampleTodos);
};

addButton.addEventListener("click", addTodo);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

tutorialButton.addEventListener("click", loadTutorial);

renderTodos(loadTodos());
