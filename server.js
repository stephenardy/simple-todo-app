const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db/database");
const port = 3000;

// Middleware
app.use(cors()); // supaya frontend bisa akses api backend
app.use(express.json()); // untuk parsing request body

app.get("/todos", (req, res) => {
  const stmt = db.prepare("SELECT * FROM todos");
  const todos = stmt.all();

  if (!todos) {
    return res.status(400).json({ message: "fail to fetch todos" });
  }

  res.status(200).json({
    message: "success fetch all todos data",
    data: todos,
  });
});

app.post("/todos", (req, res) => {
  const { title } = req.body;

  const stmt = db.prepare("INSERT INTO todos (title) VALUES (?)");
  const info = stmt.run(title);

  res.status(200).json({
    message: "success add new todo",
    data: {
      id: info.lastInsertRowid,
      title,
      done: 0,
    },
  });
});

app.get("/todos/:id", (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare("SELECT * FROM todos WHERE id=(?)");
  const todo = stmt.get(id);

  if (!todo) {
    return res.status(400).json({ message: `fail to fetch todo: ${id}` });
  }

  res.status(200).json({
    message: `success fetch todo: ${id}`,
    data: todo,
  });
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  const stmt = db.prepare("UPDATE todos SET title=(?), done=(?) WHERE id=(?)");
  stmt.run(title, done, id);

  res.status(200).json({
    message: `success update todo: ${id}`,
  });
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM todos WHERE id=(?)");
  stmt.run(id);

  res.status(200).json({
    message: `success delete todo: ${id}`,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
