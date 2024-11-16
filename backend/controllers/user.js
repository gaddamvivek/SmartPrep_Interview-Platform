const sessionTableSchema = require("../models/sessionTable");
const technicaltableschema = require("../models/Answer");
const interviewlogs= async (req, res) => {
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

const stats=async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send({ error: "Username parameter is required" });
  }

  try {
    const codingLogsCount = await sessionTableSchema.countDocuments({
      userEmail: email,
    });
    const technicalLogsCount =
      await technicaltableschema.countDocuments({
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

module.exports ={stats,interviewlogs};
