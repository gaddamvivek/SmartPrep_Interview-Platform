const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Question = require('../models/Question');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Static questions with difficulty levels
const staticQuestions = [
  {
    title: "Check if a number is even",
    description: "Write a Python function `is_even(num)` that takes an integer `num` as input and returns `True` if the number is even, `False` otherwise.",
    testCases: [
      { input: 4, output: true },
      { input: 7, output: false }
    ],
    solution: `def is_even(num):\n  return num % 2 == 0`,
    difficulty: "easy"
  },
  {
    title: "Find Factorial",
    description: "Write a Python function that returns the factorial of a number.",
    testCases: [
      { input: "5", output: "120" },
      { input: "0", output: "1" }
    ],
    solution: `def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n`,
    difficulty: "medium"  // Added difficulty level
  },
  {
    title: "Fibonacci Sequence",
    description: "Write a Python function to return the nth Fibonacci number.",
    testCases: [
      { input: "6", output: "8" },
      { input: "10", output: "55" }
    ],
    solution: `def fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fibonacci(n - 1) + fibonacci(n - 2)\n`,
    difficulty: "hard"  // Added difficulty level
  }
];

async function generateCodingQuestions(prompt) {
  try {
    const result = await model.generateContent(prompt);
    
    // Log the full response to see its structure
    console.log("Full response from GPT model:", result);

    // Extract the text from the response
    const text = result.response.text();
    console.log("Response text:", text);  // Log the raw text

    if (!text) {
      throw new Error("Received empty text from the model.");
    }

    // Remove Markdown formatting
    const jsonString = text.replace(/```json|```/g, '').trim();

    // Replace Python boolean keywords with JSON compliant ones
    const formattedJsonString = jsonString.replace(/True/g, 'true').replace(/False/g, 'false');

    // Parse the cleaned JSON response
    const jsonResponse = JSON.parse(formattedJsonString);

    // Validate that the essential fields are present
    const title = jsonResponse.title;
    const description = jsonResponse.description;
    const solution = jsonResponse.solution?.code || jsonResponse.solution;  // Accessing the 'code' property or fallback
    const testCases = jsonResponse.test_cases || jsonResponse.test_cases;  // Directly access test_cases

    if (!title || !description || !solution || !Array.isArray(testCases) || testCases.length === 0) {
      throw new Error("Generated question is missing required fields.");
    }

    // Transform test cases to match expected structure
    const formattedTestCases = testCases.map(tc => ({
      input: JSON.stringify(tc.input),  // Convert input to string
      output: tc.expected_output  // Use expected_output directly
    }));

    // Determine difficulty based on the prompt
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
      testCases: formattedTestCases,
      solution,
      difficulty  // Add the difficulty field here
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}


// For Hard Questions String in JSON should be managed in python solution. 
async function seedDatabase() {
  await Question.deleteMany({});
  await Question.insertMany(staticQuestions);
  console.log("-- MongoDB Database seeded with Static Questions. --");

  const prompts = [
    "Generate an easy level coding question in Python with title, description, test cases, and solution in JSON format",
    "Generate a medium level coding question in Python with title, description, test cases, and solution in JSON format",
    "Generate a hard level coding question in Python with title, description, test cases, and solution in JSON format"
  ];

  for (const prompt of prompts) {
    const questionText = await generateCodingQuestions(prompt);

    if (questionText) {
      try {
        // Store the generated question in the database
        await Question.create({
          title: questionText.title,
          description: questionText.description,
          testCases: questionText.testCases,
          solution: questionText.solution,
          difficulty: questionText.difficulty
        });
        console.log(`Successfully added question: ${questionText.title}`);
      } catch (insertError) {
        console.error("Error inserting question into database:", insertError);
      }
    } else {
      console.error("Failed to generate question for prompt:", prompt);
    }
  }

  console.log("-- MongoDB Database seeded with Generated Questions. --");
  process.exit();
}

seedDatabase();
