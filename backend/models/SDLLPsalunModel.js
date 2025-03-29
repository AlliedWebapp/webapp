const mongoose = require("mongoose");

const sdllpSalunSchema = new mongoose.Schema({
  srNo: { type: Number, required: true }, // "SR. NO."
  nameOfMaterials: { type: String, required: true }, // "NAME OF MATERIALS"
  openingBalance: { type: String, required: true }, // "OPENING BALANCE"
  receivedDuringMonth: { type: String, default: "Nil" }, // "RECEIVED DURING THE MONTH"
  total: { type: [String], default: [] }, // "TOTAL" (Array with two values)
  issueDuringMonth: { type: String, default: "Nil" }, // "ISSUE DURING THE MONTH"
  issueDuringYear: { type: String, default: "Nil" }, // "ISSUE DURING THE YEAR (from 1st Jan 2025)"
  closingBalance: { type: String, required: true }, // "CLOSING BALANCE"
  specification: { type: String, default: "" }, // "SPECIFICATION"
  make: {
    manufacture: { type: String, default: "" }, // "MAKE" -> "MANUFACTURE"
  },
  types: { type: String, default: "" }, // "Types"
  spareCount: { type: Number, default: 0 }
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const SDLLPsalun = mongoose.model("SDLLPsalun", sdllpSalunSchema, "SDLLPsalun"); 
module.exports = SDLLPsalun;
