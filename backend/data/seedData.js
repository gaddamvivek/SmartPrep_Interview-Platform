const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Question = require('../models/Question');

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Questions = [
  {
    title: "Sum of Two Numbers",
    description: "Write a Python function that returns the sum of two numbers.",
    testCases: [
      { input: "1 2", output: "3" },
      { input: "10 15", output: "25" }
    ],
    solution: `def sum_two_numbers(a, b):\n    return a + b\n`,
  },
  {
    title: "Find Factorial",
    description: "Write a Python function that returns the factorial of a number.",
    testCases: [
      { input: "5", output: "120" },
      { input: "0", output: "1" }
    ],
    solution: `def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n`,
  },
  {
    title: "Fibonacci Sequence",
    description: "Write a Python function to return the nth Fibonacci number.",
    testCases: [
      { input: "6", output: "8" },
      { input: "10", output: "55" }
    ],
    solution: `def fibonacci(n):\n    if n <= 0:\n        return 0\n    elif n == 1:\n        return 1\n    else:\n        return fibonacci(n - 1) + fibonacci(n - 2)\n`,
  }
  // Add as many Questions possible to Mongo DB
];

async function seedDatabase() {
  await Question.deleteMany({});
  await Question.insertMany(Questions);
  console.log("-- MongoDB Database seeded with Questions. --");
  process.exit();
}

seedDatabase();
