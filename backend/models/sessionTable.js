const mongoose = require('mongoose');

const sessionTableSchema= new mongoose.Schema({
    userEmail: { type: String, required: true },
    //timeRemaining: { type: Number, required: true },
    //userSolution: { type: String, required: true },
    //questionTitle: { type: String, required: true },
});

module.exports = mongoose.model('sessionTable', sessionTableSchema);
