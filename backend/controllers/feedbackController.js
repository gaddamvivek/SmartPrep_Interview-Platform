const Session = require('../models/sessionTable');
const Question = require('../models/Question');
const Feedback = require('../models/Feedback'); // Import the Feedback model

// Function to retrieve session details along with question information
const getSessionDetailsWithQuestionInfo = async (req, res) => {
  const { userId, prName } = req.params;

  try {
    console.log("Fetching sessions for userId:", userId, "and preparation name:", prName);

    // Retrieve sessions by userEmail
    const sessions = await Session.find({ userEmail: userId, preparationName: prName });
    console.log("Sessions found:", sessions);

    if (!sessions || sessions.length === 0) {
      console.log("No sessions found for this preparation name");
      return res.status(404).json({ message: "No sessions found for this user." });
    }

    // Retrieve question details for each session
    const sessionDetails = await Promise.all(
      sessions.flatMap((session) =>
        session.questions.map(async (questionEntry) => {
          try {
            const questionData = await Question.findById(questionEntry.questionID);
            console.log("Question data for questionID:", questionEntry.questionID, questionData);

            return {
              title: questionData?.title || 'No title available',
              description: questionData?.description || 'No description available',
              correctSolution: questionData?.solution || 'No solution available',
              userSolution: questionEntry.userSolution,
            };
          } catch (error) {
            console.error("Error fetching question details for questionID:", questionEntry.questionID, error);
            return null; // Handle missing or invalid question
          }
        })
      )
    );

    // Filter out any null entries in case of individual errors in question retrieval
    const validSessionDetails = sessionDetails.filter(detail => detail);
    console.log("Final session details compiled:", validSessionDetails);
    res.status(200).json(validSessionDetails);

  } catch (error) {
    console.error("Error fetching session details:", error);
    res.status(500).json({ message: "Error fetching session details", error: error.message });
  }
};

const submitFeedback = async (req, res) => {
  const { userId, questionId, passedTestCases, totalTestCases, review, feedback, solution } = req.body;

  try {
    console.log("Attempting to save feedback with data:", {
      userId,
      questionId,
      passedTestCases,
      totalTestCases,
      review,
      feedback,
      solution
    });

    // Create a new feedback document
    const newFeedback = new Feedback({
      userId,
      questionId,
      passedTestCases,
      totalTestCases,
      review,
      feedback,
      solution
    });

    // Save feedback to the database
    await newFeedback.save();
    console.log("Feedback saved successfully");
    res.status(201).json({ message: "Feedback saved successfully" });

  } catch (error) {
    console.error("Error saving feedback:", error);

    // Additional logging of error details
    if (error.name === 'ValidationError') {
      console.error("Validation Error:", error.errors);
    } else if (error.name === 'MongoError') {
      console.error("MongoDB Error:", error.message);
    } else {
      console.error("Unexpected Error:", error.message);
    }

    res.status(500).json({ message: "Error saving feedback", error: error.message });
  }
};


// Export the functions
module.exports = { getSessionDetailsWithQuestionInfo, submitFeedback };
