const mongoose = require('mongoose');

const CodingSolutionsSchema = new mongoose.Schema({
    questionID: {type: String},
    userSolution: {type: String},
});
const sessionTableSchema= new mongoose.Schema({
    userEmail: { type: String, required: true },
    timeTaken: { type: String, required: true },
    questions: [CodingSolutionsSchema]
});

module.exports = mongoose.model('sessionTable', sessionTableSchema);

