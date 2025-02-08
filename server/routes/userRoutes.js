import express from 'express'
const router = express.Router();
import User from '../models/User'; // Import User model
import Tracking from '../models/Tracking' // Import Tracking model

// GET all users with their tracking information
router.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find().populate("tracking"); // Ensure tracking field is populated

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
