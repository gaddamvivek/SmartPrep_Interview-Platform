const mongoose = require('mongoose');

const sessionTableSchema= new mongoose.Schema({
    userEmail: { type: String, required: true },
    timeTaken: { type: String, required: true },
});

module.exports = mongoose.model('sessionTable', sessionTableSchema);
