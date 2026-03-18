console.log("Server file running...");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Debug middleware (AFTER app creation)
app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

// ✅ SIMPLE CORS (BEST)
app.use(cors());

// Middleware
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
  console.log("Root hit");
  res.send("Server is working ✅");
});

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/notesApp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

// Start Server
app.listen(5001, () => {
  console.log("Server running on port 5001");
});

const notesRoutes = require("./routes/notes");
app.use("/api/notes", notesRoutes);