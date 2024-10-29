const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const sessionTableSchema = require("../models/sessionTable");
const technicalQuestionsTableSchema = require("../models/technicalQuestion");

// Assuming you have a model named InterviewLog
// const InterviewLog = mongoose.model('InterviewLog');

// GET /interviewlogs?email=<email>
router.get("/interviewlogs", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send({ error: "Email parameter is required" });
  }
  try {
    const codingSessionlogs = await sessionTableSchema.find({
      userEmail: email,
    });
    const technicalSessionlogs = await technicalQuestionsTableSchema.find({
      userEmail: email,
    });
    res.status(200).send(
      JSON.stringify([
        {
          title: "Technical",
          data: technicalSessionlogs,
        },
        { title: "Coding", data: codingSessionlogs },
      ])
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the logs" });
  }
});

router.get("/stats", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send({ error: "Username parameter is required" });
  }

  try {
    const codingLogsCount = await sessionTableSchema.countDocuments({
      userEmail: email,
    });
    const technicalLogsCount =
      await technicalQuestionsTableSchema.countDocuments({
        userEmail: email,
      });
    res.status(200).send([
      { title: "Technical Interviews Attended", value: technicalLogsCount },
      { title: "Coding Interviews Attended", value: codingLogsCount },
    ]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the stats" });
  }
});

module.exports = router;
