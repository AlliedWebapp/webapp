const mongoose = require("mongoose");

const soldingSchema = new mongoose.Schema({
  sNo: { type: Number, required: true }, // "S.No."
  descriptionOfMaterial: { type: String, required: true }, // "Description of Material"
  make: { type: String, required: true }, // "Make"
  vendor: { type: String, required: true }, // "Vendor"
  code: {
    specification: { type: String, default: "" } // "Code" -> "Specification"
  },
  place: { type: String, required: true }, // "Place"
  rate: { type: Number, default: null }, // "Rate"
  qty: { type: String, default: "No." }, // "Qty."
  inStock: { type: Number, required: true }, // "In Stock"
  remarks: { type: String, default: "" }, // "Remarks"
  types: { type: String, default: "" }, // "TYPES"
  spareCount: { type: Number, default: 0 }
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const solding = mongoose.model("solding", soldingSchema, "solding");
module.exports = solding;
