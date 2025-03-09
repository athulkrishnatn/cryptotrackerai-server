const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Allow frontend access
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Debugging: Log registered routes
console.log("Gemini API Key:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("Gemini API URL: Using Google Gemini API");

console.log("🔹 Registered routes:");
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(`✅ ${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`);
  } else if (layer.name === 'router') {
    layer.handle.stack.forEach((subLayer) => {
      if (subLayer.route) {
        console.log(`✅ ${Object.keys(subLayer.route.methods).join(', ').toUpperCase()} ${subLayer.route.path}`);
      }
    });
  }
});

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
