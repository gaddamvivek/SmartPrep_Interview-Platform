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
    difficulty: "medium"
  },
  {
    title: "Fibonacci Sequence",
    description: "Write a Python function to return the nth Fibonacci number.",
    testCases: [
      { input: "6", output: "8" },
      { input: "10", output: "55" }
    ],
    solution: `def fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fibonacci(n - 1) + fibonacci(n - 2)\n`,
    difficulty: "hard"
  }
];

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
      return {
        title,
        description,
        testCases: formattedTestCases,
        solution,
        difficulty
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
    "Generate 3 easy level coding questions in Python with title, description, test cases (including arrays) and solution in JSON format",
    "Generate 3 medium level coding questions in Python with title, description, test cases (including arrays) and solution in JSON format",
    "Generate 3 hard level coding questions in Python with title, description, test cases (including arrays) and solution in JSON format"
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
          difficulty: questionText.difficulty
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

