const mongoose = require("mongoose");

const soldingSchema = new mongoose.Schema({
  "S.No": { type: Number, immutable: true }, // "S.No."
  "Description of Material": { type: String, required: true }, // "Description of Material"
  Make: { type: String, required: true }, // "Make"
  Vendor: { type: String, required: true }, // "Vendor"
  Code: {
    Specification: { type: String, default: "" } // "Code" -> "Specification"
  },
  Place: { type: String, required: true }, // "Place"
  Rate: { type: Number, default: null }, // "Rate"
  Qty: { type: String, default: "No." }, // "Qty."
 "In Stock": { type: Number, required: true }, // "In Stock"
  Remarks: { type: String, default: "" }, // "Remarks"
  TYPES: { type: String, default: "" }, // "TYPES"
  spareCount: { type: Number, default: 0 }
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
