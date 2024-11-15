const mongoose = require('mongoose');

const TechnicalQnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  solution: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard']  },
  company : { type: String, required: true,  enum: ['Amazon', 'Google']},
  position : { type: String, required: true,  enum: ['Frontend Technical', 'Backend Technical',
                                                    'DevOps Technical', 'Software Testing Technical']}
});

module.exports = mongoose.model('TechnicalQuestion', TechnicalQnSchema);
