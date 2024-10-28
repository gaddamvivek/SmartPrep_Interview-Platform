

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
 {
   title: "What is JSX in React?",
   description: "Explain what JSX is and why it is used in React.",
   solution: "JSX stands for JavaScript XML. It allows developers to write HTML in React using JavaScript. JSX makes the code easier to understand and allows for writing components in a way that looks similar to HTML. When JSX is compiled, it is converted into React.createElement calls, which is how React understands what to render in the DOM.",
   difficulty: "easy"
 },
 {
   title: "Explain the Virtual DOM in React",
   description: "What is the Virtual DOM and how does React use it to improve performance?",
   solution: "The Virtual DOM is an abstraction of the actual DOM. React uses the Virtual DOM to keep track of changes in the state of a component. When a change occurs, React first updates the Virtual DOM, and then it compares the new Virtual DOM with the previous version using a process called reconciliation. This allows React to efficiently update the real DOM by only applying the minimal set of changes, improving performance.",
   difficulty: "medium"
 },
 {
   title: "What is the difference between controlled and uncontrolled components in React?",
   description: "Describe the differences between controlled and uncontrolled components in React. Provide examples of when you would use each.",
   solution: "Controlled components in React have their form data controlled by the state. For example, an input field whose value is set via the state is a controlled component. Uncontrolled components, on the other hand, maintain their own internal state (like traditional HTML elements). Controlled components are generally preferred as they provide a single source of truth. Uncontrolled components are easier to set up but harder to manage as the application grows in complexity.",
   difficulty: "hard"
 }
];


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
        await TechnicalQuestion.create({
          title: questionText.title,
          description: questionText.description,
          solution: typeof questionText.solution === 'object' ? JSON.stringify(questionText.solution, null, 2) : questionText.solution,
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

  console.log("-- MongoDB Database seeded with Generated Technical Questions. --");
  process.exit();
}



seedDatabase();

