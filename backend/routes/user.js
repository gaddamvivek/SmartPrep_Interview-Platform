const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const IDSchema = require("../models/intrwdtlsschema");

// Assuming you have a model named InterviewLog
// const InterviewLog = mongoose.model('InterviewLog');

// GET /interviewlogs?email=<email>
router.get("/interviewlogs", async (req, res) => {
  const email = req.query.email;
  const type = req.query.type;
  console.log(email);
  if (!email) {
    return res.status(400).send({ error: "Email parameter is required" });
  }
  if (!type) {
    return res.status(400).send({ error: "Type parameter is required" });
  }
  try {
    const logs = await IDSchema.find({ username: email, slctround: type });
    res.status(200).send(logs);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the logs" });
  }
});

router.get("/stats", async (req, res) => {
  const email = req.query.email;
  console.log(email, "in user stats");
  if (!email) {
    return res.status(400).send({ error: "Username parameter is required" });
  }

  try {
    const codingLogsCount = await IDSchema.countDocuments({
      username: email,
      slctround: "Coding",
    });
    const technicalLogsCount = await IDSchema.countDocuments({
      username: email,
      slctround: "Technical Questions",
    });
    console.log(codingLogsCount, technicalLogsCount);
    res.status(200).send([
      { title: "Coding Interviews Attended", value: codingLogsCount },
      { title: "Technical Interviews Attended", value: technicalLogsCount },
    ]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the stats" });
  }
});

module.exports = router;
