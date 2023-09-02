const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { premium } = require("../middlewares/premiumMiddleware");
const { leaderboard } = require("../controllers/premiumController");

const router = express.Router();

router.get("/leaderboard", protect, premium, leaderboard);

module.exports = router;
