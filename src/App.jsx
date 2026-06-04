import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  const API_URL = "https://your-render-url.onrender.com/todos";

  // GET - Load todos
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => setTodos(res.data))
      .catch((err) => console.log(err));
  }, []);

  // POST - Add todo (NO reload, direct update)
  const addTodo = () => {
    if (!input) return;

    axios.post(API_URL, { task: input })
      .then((res) => {
        setTodos([...todos, res.data]); // direct update
        setInput("");
      })
      .catch((err) => console.log(err));
  };

  // DELETE - Remove todo (NO reload)
  const deleteTodo = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.log(err));
  };

  // PUT - Update todo (NO reload)
  const updateTodo = (id) => {
    axios.put(`${API_URL}/${id}`, { task: editTask })
      .then((res) => {
        setTodos(
          todos.map((todo) =>
            todo._id === id ? res.data : todo
          )
        );
        setEditId(null);
        setEditTask("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Todo App</h1>

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTodo}>Add</button>

      {/* Todo List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo._id} style={{ margin: "10px 0" }}>
            {editId === todo._id ? (
              <>
                <input
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                />
                <button onClick={() => updateTodo(todo._id)}>Save</button>
              </>
            ) : (
              <>
                <span>{todo.task}</span>
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
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;