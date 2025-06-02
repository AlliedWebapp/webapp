const mongoose = require("mongoose");

const kuwarsiSchema = new mongoose.Schema({
  "SR. NO.": { type: Number, immutable: true }, // "SR. NO."
  "NAME OF MATERIALS": { type: String, required: true }, // "NAME OF MATERIALS"
  "OPENING BALANCE": { type: String, required: true }, // "OPENING BALANCE"
  "RECEIVED DURING THE MONTH": { type: String, default: "Nil" }, // "RECEIVED DURING THE MONTH"
  TOTAL: { type: [String], default: [] }, // "TOTAL" (Array with two values)
  "ISSUE DURING THE MONTH": { type: String, default: "Nil" }, // "ISSUE DURING THE MONTH"
  "ISSUE DURING THE YEAR ( from 1 jan 2025)": { type: String, default: "Nil" }, // "ISSUE DURING THE YEAR (from 1 Jan 2025)"
  "CLOSING BALANCE": { type: String, required: true }, // "CLOSING BALANCE"
  SPECIFICATION: { type: String, default: "" }, // "SPECIFICATION"
  MAKE: {
    MANUFACTURE: { type: String, default: "" }, // "MAKE" -> "MANUFACTURE"
  },
  vendor: { type: String, default: "" }, // "vendor"
  REMARKS: { type: String, default: "" }, // "REMARKS"
  spareCount: { type: Number, default: 0 },
 picture: { data: Buffer, contentType: String },
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

// 🚀 Auto-increment srNo on new docs
kuwarsiSchema.pre("validate", async function(next) {
  if (this.isNew) {
    const last = await this.constructor
      .findOne({}, { srNo: 1 })
      .sort({ srNo: -1 })
      .lean();
    this.srNo = last && typeof last.srNo === "number"
      ? last.srNo + 1
      : 1;
  }
  next();
});

const Kuwarsi = mongoose.model("Kuwarsi", kuwarsiSchema, "Kuwarsi"); 
module.exports = Kuwarsi;
