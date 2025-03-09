const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.CONNECTION_STRING || !process.env.JWT_SECRET) {
  console.error("❌ Missing required environment variables in .env file!");
  process.exit(1); // Exit if required variables are missing
}

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration - Allow Any Localhost Port
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || origin.startsWith("http://localhost:")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies and authorization headers
  })
);

// Force CORS Headers for Preflight Requests (Fixes Issues on Render)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json()); // Middleware to parse JSON bodies

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Debugging: Log registered routes
console.log("🔹 Registered routes:");
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(
      `✅ ${Object.keys(layer.route.methods).join(", ").toUpperCase()} ${
        layer.route.path
      }`
    );
  } else if (layer.name === "router") {
    layer.handle.stack.forEach((subLayer) => {
      if (subLayer.route) {
        console.log(
          `✅ ${Object.keys(subLayer.route.methods).join(", ").toUpperCase()} ${
            subLayer.route.path
          }`
        );
      }
    });
  }
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
