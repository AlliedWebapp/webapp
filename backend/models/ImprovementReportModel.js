const mongoose = require('mongoose');

const improvementReportSchema = new mongoose.Schema({
irId: Number, // 👈 Add this in schema
  number: String,
  department: String,
  equipment_no: String,
  equipment_system: String,
  location: String,
  objectives: String,
  concept_date: Date,
  implementation_date: Date,
  present_condition: String,
  modification: String,
  resources: String,
  mandays: String,
  cost: String,
  payback: String,
  end_result: String,
  additional_info: String,
  hod_sign: {
    data: Buffer,
    contentType: String,
  },
  plant_incharge_sign: {
    data: Buffer,
    contentType: String,
  }
}, { timestamps: true });

const ImprovementReport = mongoose.model('ImprovementReport', improvementReportSchema);

module.exports = ImprovementReport;
