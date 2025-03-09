const User = require("../models/User");

// Add Coin to Watchlist
exports.addToWatchlist = async (req, res) => {
  const { coinId } = req.body;
  const userId = req.user.id; // Extracted from JWT

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.watchlist.includes(coinId)) {
      user.watchlist.push(coinId);
      await user.save();
    }

    res.json({ message: "Coin added to watchlist", watchlist: user.watchlist });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove Coin from Watchlist
exports.removeFromWatchlist = async (req, res) => {
  const { coinId } = req.params; // 🔥 FIXED: Using params instead of body
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.watchlist = user.watchlist.filter(id => id.toString() !== coinId); // 🔥 FIXED: Convert ObjectId to string
    await user.save();

    res.json({ message: "Coin removed from watchlist", watchlist: user.watchlist });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get User Watchlist
exports.getWatchlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ watchlist: user.watchlist });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
