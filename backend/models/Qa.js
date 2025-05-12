const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  answeredBy: { type: String, required: true }, // e.g., "Chirantan"
  createdAt: { type: Date, default: Date.now }
});

const QASchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [answerSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('QA', QASchema);
