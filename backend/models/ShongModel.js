const mongoose = require("mongoose");

const shongSchema = new mongoose.Schema({
  "S.No": { type: String, immutable: true }, // "S.No."
 "Description of Material": { type: String, required: true }, // "Description of Material"
  Make: { type: String, required: true }, // "Make"
  Vendor: { type: String, required: true }, // "Vendor"
  Code: {
    Specification: { type: String, default: "" } // "Code" -> "Specification"
  },
  Place: { type: String, required: true }, // "Place"
  Rate: { type: String, default: "" }, // "Rate"
  Qty: { type: String, default: "No." }, // "Qty."
  "In Stock": { type: String, required: true }, // "In Stock"
  Remarks: { type: String, default: "" }, // "Remarks"
  Types: { type: String, default: "" }, // "Types"
  spareCount: { type: Number, default: 0 }
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

// 🚀 Pre-validate hook to auto-increment sNo
shongSchema.pre("validate", async function(next) {
  if (this.isNew) {
    // find the Shong doc with the highest sNo
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

const Shong = mongoose.model("Shong", shongSchema, "Shong");
module.exports = Shong;
