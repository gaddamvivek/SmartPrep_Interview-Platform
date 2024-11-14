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
async function getAIFeedback(questionDescription, userCode) {
  const prompt = `
    Question Description:
    ${questionDescription}
    
    User's Code:
    ${userCode}
    
    Please provide feedback on the code above. Mention if there are any issues, improvements, or edge cases that may not be covered.
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
