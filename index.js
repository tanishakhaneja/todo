const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(require("method-override")("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

let todos = [
  { id: 1, task: "Learn EJS", priority: "High" },
  { id: 2, task: "Build Todo app", priority: "Medium" }
];

app.get("/", (req, res) => {
  let shown = todos;
  if (req.query.filter && req.query.filter !== "All") {
    shown = todos.filter(t => t.priority === req.query.filter);
  }
  res.render("index", { todos: shown, editTodo: null, filter: req.query.filter || "All" });
});

app.post("/todos", (req, res) => {
  if (req.body.task && req.body.priority) {
    todos.push({
      id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
      task: req.body.task,
      priority: req.body.priority
    });
  }
  res.redirect("/");
});

app.get("/todos/:id/edit", (req, res) => {
  const editTodo = todos.find(t => t.id == req.params.id);
  res.render("index", { todos, editTodo, filter: "All" });
});

app.put("/todos/:id", (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  if (todo && req.body.task && req.body.priority) {
    todo.task = req.body.task;
    todo.priority = req.body.priority;
  }
  res.redirect("/");
});

app.delete("/todos/:id", (req, res) => {
  todos = todos.filter(t => t.id != req.params.id);
  res.redirect("/");
});

app.listen(3001);
