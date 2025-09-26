
const mongoose = require('mongoose');

const fsrDraftSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    ticketId: { type: String },
    srNo: { type: String },
    customerName: { type: String },
    commissioningDate: { type: Date },
    instanceId: { type: String },
    state: { type: String },
    rating: { type: String },
    engineModel: { type: String },
    engineSerial: { type: String },
    gensetSerial: { type: String },
    runningHours: { type: String },
    taskStart: { type: Date },
    taskEnd: { type: Date },
    problemSummary: { type: String },
    natureOfFailure: { type: String },
    checklist: { type: String },
    engineerRemarks: { type: String },
    customerRemarks: { type: String },
    recommendations: { type: String },
    engineerName: { type: String },
    customerContact: { type: String },
    customerEmail: { type: String },
    customerSignature: { data: Buffer, contentType: String },
    engineerSignature: { data: Buffer, contentType: String },
    workPhotos: [{ data: Buffer, contentType: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FsrDraft', fsrDraftSchema);
