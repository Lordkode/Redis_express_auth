const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const sessionMiddleware = require('./utils/session');

// Middleware to parse JSON
const app = express();
app.use(express.json());

app.use(sessionMiddleware);
// Initialize port
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_DB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server after the databqse connection is established
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// Basic routing
app.get("/", (req, res) => {
  res.json({
    name: "Redis Cache",
    description: "I learn how to use Redis as a cache for test",
    version: "1.0.0",
    author: "LordCode",
    status: "Running",
  });
});
