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
    
    Provide a detailed but concise evaluation of the candidate's response. Include the following:
    1. **understandability**: How well-structured and understandable is the user answer
    2. **Correctness**: Does the solution align with the requirements of the question description? Are there any logical errors considerations? is information correct
    4. **fluency**: how good the answer is , like not technical but how good the answer is in sense of english language
    
    Give a score out of 5 for:
    - understandability
    - Correctness
    - fluency

    give an ideal answer to the question with stressing main points to focus
    
    Keep the feedback professional, constructive, and focused. Summarize how user can improve in 2–3 sentences.
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
