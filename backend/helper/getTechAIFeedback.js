// helpers/getAIFeedback.js
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Sends the code and question description to Google Generative AI to get feedback.
 * @param {string} questionDescription - The description of the question.
 * @param {string} userCode - The code written by the user.
 * @returns {Promise<string>} - AI feedback on the code.
 */
async function getAIFeedback(questionDescription, answer) {
    const prompt = `
    Question Description:
    ${questionDescription}
    
    Candidate's Answer:
    ${answer}
    
    Please provide rating and feedback for the candidate's response including the correctness, communication clarity 
    mentioning the issues and suggest any improvements, if possible, in the candidate solution.
    Please don't provide the exact question solution. 
    
    Conceptual Accuracy: Correctness and alignment with theoretical principles.
    Clarity of Communication: Ability to articulate ideas clearly and logically.
    Depth and Insight: Demonstration of a thorough understanding and ability to provide meaningful insights or examples.
    Brief Feedback:
    Provide professional, constructive feedback in 2-3 sentences summarizing strengths and suggest areas of improvement in the candidate response.`;
    `;

  try {
    const result = await model.generateContent(prompt);
    const feedback = result.response.text();
    if (!feedback) {
      throw new Error("Received empty feedback from the model.");
    }
    return feedback;
  } catch (error) {
    console.error("Error getting AI feedback:", error);
    return "An error occurred while generating feedback.";
  }
}

module.exports = getAIFeedback;
