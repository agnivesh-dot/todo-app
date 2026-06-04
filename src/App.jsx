import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  const API_URL = "https://todo-app-eqzp.onrender.com/todos";

  // GET todos
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => setTodos(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ADD todo
  const addTodo = () => {
    if (!input) return;

    axios.post(API_URL, { task: input })
      .then((res) => {
        setTodos([...todos, res.data]);
        setInput("");
      })
      .catch((err) => console.log(err));
  };

  // DELETE todo
  const deleteTodo = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTodos(todos.filter((t) => t._id !== id));
      })
      .catch((err) => console.log(err));
  };

  // UPDATE todo
  const updateTodo = (id) => {
    axios.put(`${API_URL}/${id}`, { task: editTask })
      .then((res) => {
        setTodos(
          todos.map((t) => (t._id === id ? res.data : t))
        );
        setEditId(null);
        setEditTask("");
      })
      .catch((err) => console.log(err));
  };

  // TOGGLE completed
  const toggleTodo = (id) => {
    axios.put(`${API_URL}/toggle/${id}`)
      .then((res) => {
        setTodos(
          todos.map((t) => (t._id === id ? res.data : t))
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="app-container">

      <h1 className="main-title">Todo App</h1>

      <div className="todo-wrapper">

        <h2 className="side-title">To Do List</h2>

        {/* Input */}
        <div className="input-box">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter task"
          />
          <button onClick={addTodo}>Add</button>
        </div>

        {/* Todo List */}
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className="todo-item">

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id)}
              />

              {/* Task */}
              {editId === todo._id ? (
                <>
                  <input
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                  />
                  <button onClick={() => updateTodo(todo._id)}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="task-text"
                    style={{
                      textDecoration: todo.completed
                        ? "line-through"
                        : "none"
                    }}
                  >
                    {todo.task}
                  </span>

                  <div className="btn-group">
                    <button
                      onClick={() => {
                        setEditId(todo._id);
                        setEditTask(todo.task);
                      }}
                    >
                      Edit
                    </button>

                    <button onClick={() => deleteTodo(todo._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}

            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;