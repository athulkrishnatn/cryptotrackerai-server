const express = require("express");
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require("../controllers/watchlistController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

console.log("✅ Watchlist routes loaded");

// Routes
router.get("/", protect, getWatchlist);
router.post("/add", protect, addToWatchlist);
router.delete("/remove/:coinId", protect, removeFromWatchlist); // Using params instead of body

  
module.exports = router;
