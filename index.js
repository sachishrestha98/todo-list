require("dotenv").config();
const express = require("express");
const path = require("path"); // Core Node.js module for working with file paths
const app = express();

const mongoose = require("mongoose");
const cors = require("cors"); // Cross-Origin Resource Sharing (CORS) is a security feature that restricts cross-origin HTTP requests that are initiated from scripts running in the browser.
const Todo = require("./Models/Todo");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());
//write the schema for the todo

//connect to MongoDB
const mongoUri = process.env.MONGO_URI; //process.env.MONGODB_URI is the environment variable that we set in the .env file

//connect to MongoDB
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Log an error if the connection fails
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Serve the HTML file for the root route
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submission
app.post("/submit", async function (req, res) {
  try {
    const userInput = req.body.userInput; // Get the string value from the form
    const newTodo = new Todo({ title: userInput }); // Create a new Todo document
    await newTodo.save(); // Save it to the database
    console.log("Saved to database:", newTodo);
  } catch (err) {
    console.error("Error saving to database:", err);
    res.status(500).send("<h1>Failed to save to database</h1>");
  }
});

app.get("/name", function (req, res) {
  res.json({ message: "Hello Sachi" });
});
//above dummy APIs are just for testing purposes

// API route to add a todo item//post API (write)
app.post("/todos", async (req, res) => {
  try {
    const { title } = req.body;
    console.log(title); //log=print
    const newTodo = new Todo({ title });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo!" });
  }
});

// API route to get all todo items//get API (put/update)
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Find and update the todo item
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// delete API
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

//find/get API
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

//GET id API
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (err) {
    console.error("Error fetching todo by ID:", err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
