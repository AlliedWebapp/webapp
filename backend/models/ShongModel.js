const mongoose = require("mongoose");

const shongSchema = new mongoose.Schema({
  sNo: { type: String, required: true }, // "S.No."
  descriptionOfMaterial: { type: String, required: true }, // "Description of Material"
  make: { type: String, required: true }, // "Make"
  vendor: { type: String, required: true }, // "Vendor"
  code: {
    specification: { type: String, default: "" } // "Code" -> "Specification"
  },
  place: { type: String, required: true }, // "Place"
  rate: { type: String, default: "" }, // "Rate"
  qty: { type: String, default: "No." }, // "Qty."
  inStock: { type: String, required: true }, // "In Stock"
  remarks: { type: String, default: "" }, // "Remarks"
  types: { type: String, default: "" }, // "Types"
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

const Shong = mongoose.model("Shong", shongSchema, "Shong");
module.exports = Shong;
