const sessionTableSchema = require("../models/sessionTable");
const technicaltableschema = require("../models/Answer");
const interviewlogs = async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send({ error: "Email parameter is required" });
  }
  try {
    const codingSessionlogs = await sessionTableSchema.find({
      userEmail: email,
    });
    const technicalSessionlogs = await technicaltableschema.find({
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
};

const stats = async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send({ error: "Username parameter is required" });
  }

  try {
    const codingLogsCount = await sessionTableSchema.countDocuments({
      userEmail: email,
    });
    const technicalLogsCount = await technicaltableschema.countDocuments({
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
};

const streak = async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send({ error: "Username parameter is required" });
  }

  try {
    const codingLogs = await sessionTableSchema.find(
      {
        userEmail: email,
      },
      { sessionStartDate: 1, _id: 0 }
    );
    const technicalLogs = await technicaltableschema.find(
      {
        userEmail: email,
      },
      { sessionStartDate: 1, _id: 0 }
    );
    // listing out the dates of the sessions attended
    const codingDates = codingLogs.map((log) => log.sessionStartDate);
    const technicalDates = technicalLogs.map((log) => log.sessionStartDate);
    // merging the dates of both coding and technical sessions into a set and sorting them in ascending order
    const allDates = new Set([...codingDates, ...technicalDates]);
    const sortedDates = Array.from(allDates).sort();
    // calculating the streak
    let streak = 1;
    // getting the longest streak
    let longestStreak = 0;
    let currentStreak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentDate = new Date(sortedDates[i]);
      const nextDate = new Date(sortedDates[i + 1]);
      const diff = nextDate - currentDate;
      const diffInDays = diff / (1000 * 60 * 60 * 24);
      if (diffInDays === 1) {
        streak++;
      } else {
        console.log("streak", streak);
        if (streak > longestStreak) {
          longestStreak = streak;
        }
        streak = 1;
      }
    }
    if (streak > longestStreak) {
      longestStreak = streak;
    }
    // getting the current streak
    for (let i = sortedDates.length - 1; i > 0; i--) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = new Date(sortedDates[i - 1]);
      const diff = currentDate - prevDate;
      const diffInDays = diff / (1000 * 60 * 60 * 24);
      if (diffInDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
    res.status(200).send([
      { title: "Longest Streak", value: longestStreak },
      { title: "Current Streak", value: currentStreak },
    ]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "An error occurred while fetching the stats" });
  }
};

module.exports = { stats, interviewlogs, streak };
