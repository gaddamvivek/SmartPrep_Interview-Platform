const dotenv = require('dotenv');
const mongoose = require('mongoose');
const TechnicalQuestion = require('../models/technicalQuestion'); // Update the path as needed
const { GoogleGenerativeAI } = require("@google/generative-ai");




dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });




// Static technical questions with difficulty levels and solutions
const staticQuestions = [


// React Questions
 {
   "title": "What are React hooks?",
   "description": "Explain the concept of hooks in React and their purpose.",
   "solution": "Hooks are special functions in React that allow developers to use state and other React features without writing a class. Examples include 'useState' for managing state and 'useEffect' for side effects. Hooks enable functional components to manage state and lifecycle events, promoting code reuse and simplifying component logic.",
   "difficulty": "easy"
 },
 {
   "title": "What is the purpose of the 'componentDidMount' lifecycle method in React?",
   "description": "Explain when and why to use the 'componentDidMount' lifecycle method.",
   "solution": "The 'componentDidMount' lifecycle method is invoked immediately after a component is mounted in the DOM. It's commonly used for initializing data, such as making API calls or setting up subscriptions. Using this method ensures that necessary setup occurs right after the component is added to the page.",
   "difficulty": "medium"
 },
 {
   "title": "How do you optimize performance in a React application?",
   "description": "Discuss techniques for optimizing performance in a React application.",
   "solution": "Performance optimization techniques in React include code splitting with React.lazy and Suspense, memoizing components with React.memo or useMemo, implementing pagination or infinite scrolling for large lists, using the useCallback hook to avoid unnecessary re-renders, and optimizing images and assets. Profiling components with React Developer Tools can also identify performance bottlenecks.",
   "difficulty": "hard"
 },
// AWS Questions
 {
   "title": "What is AWS Lambda, and how does it differ from EC2?",
   "description": "Explain the concept of AWS Lambda. How is it different from using EC2 for running applications?",
   "solution": "AWS Lambda is a serverless compute service that automatically executes code in response to events and scales as needed. Unlike EC2, where users need to provision and manage servers, Lambda abstracts the infrastructure management away, allowing developers to focus on writing code. This model is ideal for event-driven architectures and microservices, offering cost savings as you only pay for execution time.",
   "difficulty": "easy"
 },
 {
   "title": "What is AWS Elastic Beanstalk and how does it simplify application deployment?",
   "description": "Explain the function of AWS Elastic Beanstalk and its benefits for developers.",
   "solution": "AWS Elastic Beanstalk is a Platform as a Service (PaaS) that simplifies the deployment, management, and scaling of applications. Developers can simply upload their code, and Elastic Beanstalk automatically handles the deployment details, including infrastructure provisioning, load balancing, and scaling. This allows developers to focus on writing code without worrying about the underlying infrastructure.",
   "difficulty": "medium"
 },
 {
   "title": "How do you manage secrets in AWS?",
   "description": "Explain best practices for managing secrets in AWS.",
   "solution": "Secrets in AWS can be managed using AWS Secrets Manager or AWS Systems Manager Parameter Store. These services allow you to securely store, manage, and retrieve sensitive information such as API keys, passwords, and database credentials. Best practices include using IAM policies to restrict access, enabling automatic rotation of secrets, and ensuring that secrets are encrypted both in transit and at rest.",
   "difficulty": "hard"
 },
// GitHub Questions
 {
   "title": "What is the difference between Git pull and Git fetch?",
   "description": "Describe the difference between the 'git pull' and 'git fetch' commands.",
   "solution": "'Git pull' is a command that fetches changes from a remote repository and merges them into the local branch, effectively updating it with the latest code. In contrast, 'git fetch' only downloads the updates without merging them, allowing developers to review changes before deciding to integrate them. This distinction helps in managing code updates more cautiously.",
   "difficulty": "easy"
 },
 {
   "title": "How do you resolve merge conflicts in Git?",
   "description": "What steps should you take to resolve a merge conflict in Git?",
   "solution": "To resolve a merge conflict in Git, start by identifying the conflicting files using 'git status'. Open each conflicting file, locate the conflict markers, and manually edit the sections to resolve the differences. After making the necessary adjustments, stage the resolved files using 'git add' and commit the changes with 'git commit'. It's crucial to test the code to ensure it functions correctly after the merge.",
   "difficulty": "medium"
 },
 {
   "title": "What is a Git stash?",
   "description": "Explain what a Git stash is and when to use it.",
   "solution": "A Git stash is a temporary storage area that allows developers to save changes that are not yet ready to be committed. This is useful when you need to switch branches or pull updates from a remote repository without committing unfinished work. You can later apply the stashed changes back to your working directory.",
   "difficulty": "hard"
 },


//Jest Questions
 {
 "title": "What is snapshot testing in Jest?",
 "description": "Describe snapshot testing in Jest and when it is useful.",
 "solution": "Snapshot testing in Jest captures the output of a component and saves it in a file. During future test runs, the output is compared to the saved snapshot to detect changes. Snapshot testing is useful for ensuring that UI components render consistently over time.",
 "difficulty": "easy"
 },
 {
   "title": "How do you handle asynchronous code in Jest?",
   "description": "Explain how to test asynchronous code using Jest.",
   "solution": "To test asynchronous code in Jest, you can return a promise from the test or use async/await syntax. For promises, ensure you return the promise in the test function. For async/await, mark the test function as 'async' and use 'await' before the asynchronous function call. Jest will wait for the promise to resolve before completing the test.",
   "difficulty": "medium"
 },
 {
   "title": "How do you create a mock module in Jest?",
   "description": "Explain the steps to create a mock module in Jest.",
   "solution": "To create a mock module in Jest, use 'jest.mock()' with the module name. Inside the mock function, you can specify how the module should behave, including return values and implementation details. This allows you to isolate the unit being tested and control the behavior of dependencies, improving test reliability.",
   "difficulty": "hard"
 },
 //Mongo DB Questions
 {
   "title": "How do you implement schema validation in MongoDB?",
   "description": "Explain how to enforce schema validation in MongoDB collections.",
   "solution": "MongoDB implements schema validation using the 'validator' option when creating collections. By defining validation rules with JSON Schema, you can enforce specific structures and data types for documents. This capability enhances data integrity and ensures that stored documents conform to expected formats, reducing errors in application logic.",
   "difficulty": "easy"
 },
 {
   "title": "How do you connect to a MongoDB database using Mongoose?",
   "description": "Explain the process of connecting to a MongoDB database using Mongoose.",
   "solution": "To connect to a MongoDB database using Mongoose, first, install Mongoose via npm. Then, use 'mongoose.connect()' with the database URI, specifying options for connection. Once connected, you can define models and interact with the database using Mongoose's schema-based structure.",
   "difficulty": "medium"
 },
 {
   "title": "How do you optimize queries in MongoDB?",
   "description": "Explain how to improve the performance of queries in MongoDB.",
   "solution": "To optimize queries in MongoDB, use indexes to speed up data retrieval. Analyze query performance with the 'explain()' method to understand how queries are executed. Additionally, consider using aggregation pipelines for complex data processing and limit the amount of data retrieved by using projections to only return necessary fields.",
   "difficulty": "hard"
 },
]




async function generateTechnicalQuestions(prompt) {
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




  // Remove Markdown formatting and clean the response
  const jsonString = text.replace(/```json|```/g, '').trim();




  // Parse the cleaned JSON response
  const jsonResponse = JSON.parse(jsonString);




  // Validate that the essential fields are present
  const title = jsonResponse.title;
  const description = jsonResponse.description;
  const solution = jsonResponse.solution?.theory || jsonResponse.solution;  // Ensure the solution field is captured




  if (!title || !description || !solution) {
    throw new Error("Generated question is missing required fields.");
  }


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
    solution: typeof solution === 'object' ? JSON.stringify(solution, null, 2) : solution, // Ensure solution is a string
    difficulty
  };




} catch (error) {
  console.error("Error generating content:", error);
  return null;
}
}




async function seedDatabase() {
 await TechnicalQuestion.deleteMany({});
 await TechnicalQuestion.insertMany(staticQuestions);
 console.log("-- MongoDB Database seeded with Static Technical Questions. --");


 // Define prompts for different topics and difficulties
 const prompts = [
   "Generate an easy level theoretical AWS question with title, description, and detailed theoretical solution in JSON format",
   "Generate a medium level theoretical AWS question with title, description, and detailed theoretical solution in JSON format",
   "Generate a hard level theoretical AWS question with title, description, and detailed theoretical solution in JSON format",
  
   "Generate an easy level theoretical React question with title, description, and detailed theoretical solution in JSON format",
   "Generate a medium level theoretical React question with title, description, and detailed theoretical solution in JSON format",
   "Generate a hard level theoretical React question with title, description, and detailed theoretical solution in JSON format",
  
   "Generate an easy level theoretical MongoDB question with title, description, and detailed theoretical solution in JSON format",
   "Generate a medium level theoretical MongoDB question with title, description, and detailed theoretical solution in JSON format",
   "Generate a hard level theoretical MongoDB question with title, description, and detailed theoretical solution in JSON format",
  
   "Generate an easy level theoretical Jest question with title, description, and detailed theoretical solution in JSON format",
   "Generate a medium level theoretical Jest question with title, description, and detailed theoretical solution in JSON format",
   "Generate a hard level theoretical Jest question with title, description, and detailed theoretical solution in JSON format",
  
   "Generate an easy level theoretical GitHub question with title, description, and detailed theoretical solution in JSON format",
   "Generate a medium level theoretical GitHub question with title, description, and detailed theoretical solution in JSON format",
   "Generate a hard level theoretical GitHub question with title, description, and detailed theoretical solution in JSON format",
 ];


 for (const prompt of prompts) {
   const questionText = await generateTechnicalQuestions(prompt);


   if (questionText) {
     try {
       // Store the generated question in the database
       const createdQuestion = await TechnicalQuestion.create({
         title: questionText.title,
         description: questionText.description,
         solution: typeof questionText.solution === 'object' ? JSON.stringify(questionText.solution, null, 2) : questionText.solution,
         difficulty: questionText.difficulty
       });


       // Print only the question title if successfully added
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

