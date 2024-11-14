const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Question = require('../models/Question');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Load static questions from JSON file
const staticQuestionsPath = './data/codingQuestions.json';
let staticQuestions;
try {
    const data = fs.readFileSync(staticQuestionsPath, 'utf8');
    staticQuestions = JSON.parse(data);
    console.log("-- Loaded static questions from JSON file. --");
} catch (error) {
    console.error("Error loading static questions JSON file:", error);
    process.exit(1);
}

async function generateCodingQuestions(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (!text) {
            throw new Error("Received empty text from the model.");
        }

        const jsonString = text.replace(/```json|```/g, '').trim();
        const formattedJsonString = jsonString.replace(/True/g, 'true').replace(/False/g, 'false');

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(formattedJsonString);
        } catch (parseError) {
            console.error("Failed to parse JSON:", formattedJsonString);
            throw parseError;
        }

        if (!Array.isArray(jsonResponse)) {
            throw new Error("Expected an array of questions.");
        }

        return jsonResponse.map((question) => {
            const { title, description, test_cases: testCases } = question;
            const solution = question.solution?.code || question.solution;

            if (!title || !description || !solution || !Array.isArray(testCases)) {
                throw new Error("Generated question is missing required fields.");
            }

            const formattedTestCases = testCases.map(tc => ({
                input: JSON.stringify(tc.input),
                output: tc.expected_output
            }));

            const difficulty = prompt.toLowerCase().match(/(easy|medium|hard)/)?.[0];
            const company = "Amazon"; // Default or change as required
            const position = difficulty === "easy" ? "Python Developer I" : "Python Developer II"; // Adjust logic as needed

            return {
                title,
                description,
                testCases: formattedTestCases,
                solution,
                difficulty,
                company,
                position
            };
        });
    } catch (error) {
        console.error("Error generating content:", error);
        return [];
    }
}

async function seedDatabase() {
    await Question.deleteMany({});
    await Question.insertMany(staticQuestions);
    console.log("-- MongoDB Database seeded with Static Questions. --");

    const prompts = [
        "Generate 2 easy level coding questions in Python with title, description, test cases and solution in JSON format",
        "Generate 2 medium level coding questions in Python with title, description, test cases and solution in JSON format",
        "Generate 2 hard level coding questions in Python with title, description, test cases and solution in JSON format"
    ];

    for (const prompt of prompts) {
        const questions = await generateCodingQuestions(prompt);

        for (const questionText of questions) {
            try {
                await Question.create({
                    title: questionText.title,
                    description: questionText.description,
                    testCases: questionText.testCases,
                    solution: questionText.solution,
                    difficulty: questionText.difficulty,
                    company: questionText.company,
                    position: questionText.position
                });
                console.log(`Successfully added question: ${questionText.title}`);
            } catch (insertError) {
                console.error("Error inserting question into database:", insertError);
            }
        }
    }

    console.log("-- MongoDB Database seeded with Generated Questions. --");
    process.exit();
}

seedDatabase();
