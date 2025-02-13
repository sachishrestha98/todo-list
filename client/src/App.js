import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch existing todos from the backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:3000/todos");
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  // Function to add a new to-do
  const addTodo = async () => {
    if (!newTodo.trim()) return; // Prevent empty input

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTodo }),
      });

      const data = await response.json();
      setTodos([...todos, data]); // Add the new to-do to the list
      setNewTodo(""); // Clear input field
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <div>
      <h1>To-Do List</h1>
      
      {/* Input for adding new todo */}
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter a new task"
      />
      <button onClick={addTodo}>Add Todo</button>

      {/* Display list of todos */}
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
