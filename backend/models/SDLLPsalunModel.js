const mongoose = require("mongoose");
const { Schema } = mongoose;
const sdllpSalunSchema = new mongoose.Schema({
  "SR. NO.": { type: Number, immutable: true }, // "SR. NO."
  "NAME OF MATERIALS": { type: String, required: true }, // "NAME OF MATERIALS"
  "OPENING BALANCE": { type: String, required: true }, // "OPENING BALANCE"
  "RECEIVED DURING THE MONTH": { type: String, default: "Nil" }, // "RECEIVED DURING THE MONTH"
   TOTAL: { type: [Schema.Types.Mixed], default: [] },
  "ISSUE DURING THE MONTH": { type: String, default: "Nil" }, // "ISSUE DURING THE MONTH"
  "ISSUE DURING THE YEAR (from 1st Jan 2025)": { type: String, default: "Nil" }, // "ISSUE DURING THE YEAR (from 1st Jan 2025)"
  "CLOSING BALANCE": { type: String, required: true }, // "CLOSING BALANCE"
  SPECIFICATION: { type: String, default: "" }, // "SPECIFICATION"
  MAKE: {
    MANUFACTURE: { type: String, default: "" }, // "MAKE" -> "MANUFACTURE"
  },
  Types: { type: String, default: "" }, // "Types"
  spareCount: { type: Number, default: 0 }
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

// auto-increment srNo
sdllpSalunSchema.pre("validate", async function(next) {
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

const SDLLPsalun = mongoose.model("SDLLPsalun", sdllpSalunSchema, "SDLLPsalun"); 
module.exports = SDLLPsalun;
