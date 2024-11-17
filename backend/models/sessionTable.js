const mongoose = require('mongoose');

const CodingSolutionsSchema = new mongoose.Schema({
    questionID: {type: String},
    userSolution: {type: String},
});
const sessionTableSchema= new mongoose.Schema({
    userEmail: { type: String, required: true },
    preparationName: { type: String, required: true },
    positionName: { type: String, required: true },
    prepDiff: { type: String, required: true },
    sessionStartDate:{ type: String, required: true },
    sessionEndDate:{ type: String, required: true },
    sessionStartTime:{ type: String, required: true },
    sessionEndTime:{ type: String, required: true },
    timeTaken: { type: String, required: true },
    questions: [CodingSolutionsSchema]
});

module.exports = mongoose.model('Codingsession', sessionTableSchema);

