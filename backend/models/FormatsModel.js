const mongoose = require('mongoose');

const FormatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  file: {
    data: Buffer,
    contentType: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Formats', FormatSchema);

