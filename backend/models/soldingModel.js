const mongoose = require("mongoose");

const soldingSchema = new mongoose.Schema({
  "S.No": { type: Number, immutable: true }, // "S.No."
  "Description of Material": { type: String, required: true }, // "Description of Material"
  Make: { type: String, required: true }, // "Make"
  Vendor: { type: String, required: true }, // "Vendor"
  "Opening Balance": { type: Number, required: true }, // "Opening Balance"
  "Received during Month": { type: Number, default: 0 }, // "Received during Month"
  "Issued during Month": { type: Number, default: 0 }, // "Issued during Month"
  "Issued during Year": { type: Number, default: 0 }, // "Issued during Year"
  "Closing Balance": { type: Number, required: true }, // "Closing Balance
  Code: {
    Specification: { type: String, default: "" } // "Code" -> "Specification"
  },
  Place: { type: String, required: true }, // "Place"
  Rate: { type: Number, default: null }, // "Rate"
 "In Stock": { type: Number, required: true }, // "In Stock"
  Remarks: { type: String, default: "" }, // "Remarks"
  TYPES: { type: String, default: "" }, // "TYPES"
  spareCount: { type: Number, default: 0 },
 picture: { data: Buffer, contentType: String },
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

// 🚀 Pre-validate hook to auto-increment sNo
soldingSchema.pre("validate", async function(next) {
  if (this.isNew) {
    const last = await this.constructor
      .findOne({}, { sNo: 1 })
      .sort({ sNo: -1 })
      .lean();
    this.sNo = last && typeof last.sNo === "number"
      ? last.sNo + 1
      : 1;
  }
  next();
});

const solding = mongoose.model("solding", soldingSchema, "solding");
module.exports = solding;
