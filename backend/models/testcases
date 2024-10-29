const mongoose = require('mongoose');

// Schema for individual coding solutions
const CodingSolutionsSchema = new mongoose.Schema({
    questionID: { type: String, required: true },
    questiontitle: { type: String, required: true },
    questiondescription:{ type: String, required: true },
    aisolution:{ type: String, required: true },
    userSolution: { type: String, required: true },
    testCases: [
        {
            input: { type: String, required: true },
            output: { type: String, default: null }
        }
    ] // Array of test case objects
});

// Schema for test cases collection
const testcaseSchema = new mongoose.Schema({
    solutions: [CodingSolutionsSchema]
});

module.exports = mongoose.model('for-testcases', testcaseSchema);