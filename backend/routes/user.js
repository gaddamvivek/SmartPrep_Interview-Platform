const express = require("express");
const router = express.Router();
const { interviewlogs, stats, streak } = require("../controllers/user");
router.get("/interviewlogs", interviewlogs);
router.get("/stats", stats);
router.get("/streak", streak);
module.exports = router;
