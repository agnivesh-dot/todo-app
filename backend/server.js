const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://agniveshwebyfy_db_user:Todo%4012345@ac-bvwtvr8-shard-00-00.nabwld3.mongodb.net:27017,ac-bvwtvr8-shard-00-01.nabwld3.mongodb.net:27017,ac-bvwtvr8-shard-00-02.nabwld3.mongodb.net:27017/?ssl=true&replicaSet=atlas-33zhtn-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema
const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  }
});

// Model
const Todo = mongoose.model("Todo", todoSchema);

//
// GET - Read all todos
//
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// POST - Create todo
//
app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// PUT - Update todo
//
app.put("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// DELETE - Delete todo
//
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});