// models/FSR.js
const mongoose = require("mongoose");

const fsrSchema = new mongoose.Schema({
fsrId: { type: Number, required: true, unique: true }, 
 ticketId: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
  srNo: String,
  customerName: String,
  commissioningDate: Date,
  instanceId: String,
  state: String,
  rating: String,
  engineModel: String,
  engineSerial: String,
  gensetSerial: String,
  runningHours: String,
  taskStart: Date,
  taskEnd: Date,
  problemSummary: String,
  natureOfFailure: String,
  checklist: String,
  engineerRemarks: String,
  customerRemarks: String,
  recommendations: String,
  engineerName: String,
  customerContact: String,
  customerEmail: String,

  customerSignature: { data: Buffer, contentType: String },  // single image stored as binary
  engineerSignature: { data: Buffer, contentType: String },
  workPhotos: [{ data: Buffer, contentType: String }],      // array of images stored as binary

  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

// Add a compound index to ensure ticketId is unique
fsrSchema.index({ ticketId: 1 }, { unique: true });

const FSR = mongoose.model("FSR", fsrSchema, "fsrs");
module.exports = FSR;
