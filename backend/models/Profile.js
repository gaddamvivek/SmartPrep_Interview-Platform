const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  headline: String,
  location: String,
  about: String,
  experiences: [{
    role: { type: String },
    company: { type: String },
    duration: { type: String },
    description: { type: String }
  }],
  education: [{
    school: { type: String },
    degree: { type: String },
    year: { type: String }
  }],
  skills: [{
    name: { type: String }
  }],
  projects: [{
    name: { type: String },
    description: { type: String },
    technologies: { type: String }
  }]
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
