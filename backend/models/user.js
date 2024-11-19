const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
    googleId: { type: String, required: false, unique: true, },
    fname: { type: String, required: false },
    lname: { type: String, required: false },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', UserDetailsSchema);
