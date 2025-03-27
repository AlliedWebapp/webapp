const mongoose = require("mongoose");

const kuwarsiSchema = new mongoose.Schema({
  srNo: { type: Number, required: true }, // "SR. NO."
  nameOfMaterials: { type: String, required: true }, // "NAME OF MATERIALS"
  openingBalance: { type: String, required: true }, // "OPENING BALANCE"
  receivedDuringMonth: { type: String, default: "Nil" }, // "RECEIVED DURING THE MONTH"
  total: { type: [String], default: [] }, // "TOTAL" (Array with two values)
  issueDuringMonth: { type: String, default: "Nil" }, // "ISSUE DURING THE MONTH"
  issueDuringYear: { type: String, default: "Nil" }, // "ISSUE DURING THE YEAR (from 1 Jan 2025)"
  closingBalance: { type: String, required: true }, // "CLOSING BALANCE"
  specification: { type: String, default: "" }, // "SPECIFICATION"
  make: {
    manufacture: { type: String, default: "" }, // "MAKE" -> "MANUFACTURE"
  },
  remarks: { type: String, default: "" }, // "REMARKS"
  sparesCount: { type: Number, default: 0 } 
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const Kuwarsi = mongoose.model("Kuwarsi", kuwarsiSchema, "Kuwarsi"); 
module.exports = Kuwarsi;
