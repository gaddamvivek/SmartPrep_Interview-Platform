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
   "title": "Merge Two Sorted Lists",
   "description": "Write a Python function `merge_sorted_lists(list1, list2)` that merges two sorted lists into one sorted list.",
   "testCases": [
     { "input": "[[1, 3, 5], [2, 4, 6]]", "output": "[1, 2, 3, 4, 5, 6]" },
     { "input": "[[1, 4, 7], [2, 5, 8]]", "output": "[1, 2, 4, 5, 7, 8]" }
   ],
   "solution": "def merge_sorted_lists(list1, list2):\n    return sorted(list1 + list2)",
   "difficulty": "easy"
   },
   {
     "title": "Count Vowels",
     "description": "Write a Python function `count_vowels(s)` that takes a string `s` and returns the number of vowels in it.",
     "testCases": [
       { "input": "hello", "output": 2 },
       { "input": "world", "output": 1 }
     ],
     "solution": "def count_vowels(s):\n    return sum(1 for c in s if c in 'aeiouAEIOU')",
     "difficulty": "easy"
   },
   {
     "title": "Reverse a String",
     "description": "Write a Python function `reverse_string(s)` that takes a string `s` and returns it in reverse order.",
     "testCases": [
       { "input": "hello", "output": "olleh" },
       { "input": "Python", "output": "nohtyP" }
     ],
     "solution": "def reverse_string(s):\n    return s[::-1]",
     "difficulty": "easy"
   },
   {
     "title": "Find Second Largest",
     "description": "Write a Python function `second_largest(arr)` that takes a list of integers and returns the second largest element.",
     "testCases": [
       { "input": "[1, 3, 4, 5]", "output": 4 },
       { "input": "[10, 20, 4, 4]", "output": 10 }
     ],
     "solution": "def second_largest(arr):\n    unique_numbers = list(set(arr))\n    unique_numbers.sort()\n    return unique_numbers[-2]",
     "difficulty": "medium"
   },
   {
     "title": "Product of All Elements Except Self",
     "description": "Write a Python function `product_except_self(nums)` that takes a list of integers and returns a list where each element is the product of all elements in the input list except for the one at that index.",
     "testCases": [
       { "input": "[1, 2, 3, 4]", "output": "[24, 12, 8, 6]" },
       { "input": "[5, 3, 2]", "output": "[6, 10, 15]" }
     ],
     "solution": "def product_except_self(nums):\n    length = len(nums)\n    left_products, right_products, output = [1] * length, [1] * length, [1] * length\n    for i in range(1, length):\n        left_products[i] = left_products[i - 1] * nums[i - 1]\n    for i in range(length - 2, -1, -1):\n        right_products[i] = right_products[i + 1] * nums[i + 1]\n    for i in range(length):\n        output[i] = left_products[i] * right_products[i]\n    return output",
     "difficulty": "medium"
   },
   {
     "title": "Longest Substring Without Repeating Characters",
     "description": "Write a Python function `longest_substring(s)` that takes a string `s` and returns the length of the longest substring without repeating characters.",
     "testCases": [
       { "input": "abcabcbb", "output": 3 },
       { "input": "bbbbb", "output": 1 },
       { "input": "pwwkew", "output": 3 }
     ],
     "solution": "def longest_substring(s):\n    char_set = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len",
     "difficulty": "medium"
   },
   {
     "title": "Longest Consecutive Sequence",
     "description": "Write a Python function `longest_consecutive(nums)` that takes a list of integers `nums` and returns the length of the longest consecutive elements sequence.",
     "testCases": [
       { "input": "[100, 4, 200, 1, 3, 2]", "output": "4" },
       { "input": "[0, -1, -2, 2, 1, 3, 4]", "output": "5" }
     ],
     "solution": "def longest_consecutive(nums):\n    num_set = set(nums)\n    longest_streak = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            current_num = num\n            current_streak = 1\n            while current_num + 1 in num_set:\n                current_num += 1\n                current_streak += 1\n            longest_streak = max(longest_streak, current_streak)\n    return longest_streak",
     "difficulty": "hard"
   },
   {
     "title": "Trapping Rain Water",
     "description": "Write a Python function `trap(height)` that takes a list representing heights of columns and returns the amount of rainwater trapped after it rains.",
     "testCases": [
       { "input": "[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]", "output": 6 },
       { "input": "[4, 2, 0, 3, 2, 5]", "output": 9 }
     ],
     "solution": "def trap(height):\n    left, right = 0, len(height) - 1\n    left_max, right_max = 0, 0\n    water_trapped = 0\n    while left < right:\n        if height[left] < height[right]:\n            if height[left] >= left_max:\n                left_max = height[left]\n            else:\n                water_trapped += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max:\n                right_max = height[right]\n            else:\n                water_trapped += right_max - height[right]\n            right -= 1\n    return water_trapped",
     "difficulty": "hard"
   },
   {
     "title": "Kth Largest Element",
     "description": "Write a Python function `kth_largest(nums, k)` that returns the `k`th largest element in a list of integers.",
     "testCases": [
       { "input": "[[3, 2, 1, 5, 6, 4], 2]", "output": 5 },
       { "input": "[[7, 6, 5, 4, 3, 2, 1], 3]", "output": 5 }
     ],
     "solution": "import heapq\n\ndef kth_largest(nums, k):\n    return heapq.nlargest(k, nums)[-1]",
     "difficulty": "hard"
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




