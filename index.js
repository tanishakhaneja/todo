const express = require("express");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Setup view engine and views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// In-memory todo array with some sample data
let todos = [
  { id: 1, task: "Learn EJS", priority: "High" },
  { id: 2, task: "Build Todo app", priority: "Medium" },
];

// Helper to generate new IDs
function nextId() {
  return todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
}

// Home route with optional filter and no edit mode
app.get("/", (req, res) => {
  const filter = req.query.filter || "All";
  let filteredTodos = todos;
  if (filter !== "All") {
    filteredTodos = todos.filter((t) => t.priority === filter);
  }
  res.render("index", { todos: filteredTodos, editTodo: null, filter });
});

// Add new todo
app.post("/todos", (req, res) => {
  const { task, priority } = req.body;
  if (!task || !priority) {
    // Could handle alert here, but keep simple
    return res.redirect("/");
  }
  todos.push({ id: nextId(), task, priority });
  res.redirect("/");
});

// Show edit form for a todo
app.get("/todos/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const editTodo = todos.find((t) => t.id === id) || null;
  res.render("index", { todos, editTodo, filter: "All" });
});

// Update todo (PUT)
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { task, priority } = req.body;
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.task = task;
    todo.priority = priority;
  }
  res.redirect("/");
});

// Delete todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter((t) => t.id !== id);
  res.redirect("/");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
