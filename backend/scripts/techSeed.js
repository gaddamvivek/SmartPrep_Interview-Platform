const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const TechnicalQuestion = require('../models/technicalQuestion'); // Update path as needed
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Load static technical questions from JSON file
const staticQuestionsPath = './data/technicalQuestions.json';
let staticQuestions;
try {
    const data = fs.readFileSync(staticQuestionsPath, 'utf8');
    staticQuestions = JSON.parse(data);
    console.log("-- Loaded static technical questions from JSON file. --");
} catch (error) {
    console.error("Error loading technical questions JSON file:", error);
    process.exit(1);
}

// Function to generate technical questions using GPT
async function generateTechnicalQuestions(prompt, company, position) {
    try {
        const result = await model.generateContent(prompt);
        console.log("Full response from GPT model:", result);

        const text = result.response.text();
        console.log("Response text:", text);

        if (!text) {
            throw new Error("Received empty text from the model.");
        }

        const jsonString = text.replace(/```json|```/g, '').trim();
        const jsonResponse = JSON.parse(jsonString);

        const title = jsonResponse.title;
        const description = jsonResponse.description;
        const solution = jsonResponse.solution?.theory || jsonResponse.solution;

        if (!title || !description || !solution) {
            throw new Error("Generated question is missing required fields.");
        }

        let difficulty;
        if (prompt.toLowerCase().includes("easy")) {
            difficulty = "easy";
        } else if (prompt.toLowerCase().includes("medium")) {
            difficulty = "medium";
        } else if (prompt.toLowerCase().includes("hard")) {
            difficulty = "hard";
        } else {
            throw new Error("Difficulty level not specified in the prompt.");
        }

        return {
            title,
            description,
            solution: typeof solution === 'object' ? JSON.stringify(solution, null, 2) : solution,
            difficulty,
            company,
            position
        };

    } catch (error) {
        console.error("Error generating content:", error);
        return null;
    }
}

// Function to seed the database
async function seedDatabase() {
    await TechnicalQuestion.deleteMany({});
    await TechnicalQuestion.insertMany(staticQuestions);
    console.log("-- MongoDB Database seeded with Static Technical Questions. --");

    // Define prompts with companies, positions, and topics
    const prompts = [
        { prompt: "Generate an easy level theoretical AWS question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "DevOps Technical" },
        { prompt: "Generate a medium level theoretical AWS question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Backend Technical" },
        { prompt: "Generate a hard level theoretical AWS question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "DevOps Technical" },
        { prompt: "Generate an easy level theoretical AWS question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "DevOps Technical" },
        { prompt: "Generate a medium level theoretical AWS question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Backend Technical" },
        { prompt: "Generate a hard level theoretical AWS question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "DevOps Technical" },

        { prompt: "Generate an easy level theoretical React question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Frontend Technical" },
        { prompt: "Generate a medium level theoretical React question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Frontend Technical" },
        { prompt: "Generate a hard level theoretical React question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Frontend Technical" },
        { prompt: "Generate an easy level theoretical React question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Frontend Technical" },
        { prompt: "Generate a medium level theoretical React question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Frontend Technical" },
        { prompt: "Generate a hard level theoretical React question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Frontend Technical" },
        
        { prompt: "Generate an easy level theoretical MongoDB question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Backend Technical" },
        { prompt: "Generate a medium level theoretical MongoDB question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Backend Technical" },
        { prompt: "Generate a hard level theoretical MongoDB question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Backend Technical" },
        { prompt: "Generate an easy level theoretical MongoDB question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Backend Technical" },
        { prompt: "Generate a medium level theoretical MongoDB question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Backend Technical" },
        { prompt: "Generate a hard level theoretical MongoDB question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Backend Technical" },

        { prompt: "Generate an easy level theoretical Express JS question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Backend Technical" },
        { prompt: "Generate a medium level theoretical Express JS question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Backend Technical" },
        { prompt: "Generate a hard level theoretical Express JS question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Backend Technical" },
        { prompt: "Generate an easy level theoretical Express JS question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Backend Technical" },
        { prompt: "Generate a medium level theoretical Express JS question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Backend Technical" },
        { prompt: "Generate a hard level theoretical Express JS question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Backend Technical" },

        { prompt: "Generate an easy level theoretical Jest question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Software Testing Technical" },
        { prompt: "Generate a medium level theoretical Jest question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Software Testing Technical" },
        { prompt: "Generate a hard level theoretical Jest question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Software Testing Technical" },
        { prompt: "Generate an easy level theoretical Jest question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Software Testing Technical" },
        { prompt: "Generate a medium level theoretical Jest question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Software Testing Technical" },
        { prompt: "Generate a hard level theoretical Jest question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Software Testing Technical" },
        
        { prompt: "Generate an easy level theoretical Selenium question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Software Testing Technical" },
        { prompt: "Generate a medium level theoretical Selenium question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Software Testing Technical" },
        { prompt: "Generate a hard level theoretical Selenium question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "Software Testing Technical" },
        { prompt: "Generate an easy level theoretical Selenium question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Software Testing Technical" },
        { prompt: "Generate a medium level theoretical Selenium question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Software Testing Technical" },
        { prompt: "Generate a hard level theoretical Selenium question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "Software Testing Technical" },
        
        { prompt: "Generate an easy level theoretical GitHub question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "DevOps Technical" },
        { prompt: "Generate a medium level theoretical GitHub question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "DevOps Technical" },
        { prompt: "Generate a hard level theoretical GitHub question with title, description, and detailed theoretical solution in JSON format", company: "Amazon", position: "DevOps Technical" },
        { prompt: "Generate an easy level theoretical GitHub question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "DevOps Technical" },
        { prompt: "Generate a medium level theoretical GitHub question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "DevOps Technical" },
        { prompt: "Generate a hard level theoretical GitHub question with title, description, and detailed theoretical solution in JSON format", company: "Google", position: "DevOps Technical" },
    
      ];

    for (const { prompt, company, position } of prompts) {
        const questionText = await generateTechnicalQuestions(prompt, company, position);

        if (questionText) {
            try {
                const createdQuestion = await TechnicalQuestion.create({
                    title: questionText.title,
                    description: questionText.description,
                    solution: typeof questionText.solution === 'object' ? JSON.stringify(questionText.solution, null, 2) : questionText.solution,
                    difficulty: questionText.difficulty,
                    company: questionText.company,
                    position: questionText.position
                });

                console.log(`Successfully added question: ${createdQuestion.title}`);
            } catch (insertError) {
                console.error("Error inserting question into database:", insertError);
            }
        } else {
            console.error("Failed to generate question for prompt:", prompt);
        }
    }

    console.log("-- MongoDB Database seeded with Generated Technical Questions. --");
    process.exit();
}

seedDatabase();
