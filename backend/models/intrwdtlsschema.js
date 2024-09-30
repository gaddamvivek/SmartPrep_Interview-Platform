const mongoose = require('mongoose');

const InterviewDetailsSchema = new mongoose.Schema({
    username: {type: String, required: true},
    prepname: {type: String, required: true},
    diffLvl: {type: String, required: true},
    slctround: { type: String, required: true },
});

module.exports = mongoose.model('IDS', InterviewDetailsSchema);