const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let todos = [
  { id: 1, task: "Learn EJS", priority: "High" },
  { id: 2, task: "Build Todo app", priority: "Medium" },
];

app.get("/", (req, res) => {
  const filter = req.query.filter;
  const filteredTodos = filter && filter !== "All"
    ? todos.filter(t => t.priority === filter)
    : todos;
  res.render("index", { todos: filteredTodos, editTodo: null, filter: filter || "All" });
});

app.post("/todos", (req, res) => {
  const { task, priority } = req.body;
  if (task && priority) {
    const id = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    todos.push({ id, task, priority });
  }
  res.redirect("/");
});

app.get("/todos/:id/edit", (req, res) => {
  const id = Number(req.params.id);
  const editTodo = todos.find(t => t.id === id);
  res.render("index", { todos, editTodo, filter: "All" });
});

app.put("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const { task, priority } = req.body;
  const todo = todos.find(t => t.id === id);
  if (todo && task && priority) {
    todo.task = task;
    todo.priority = priority;
  }
  res.redirect("/");
});

app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
