const mongoose = require("mongoose");

const consumableSchema = new mongoose.Schema({
 
  sr_no: { type: Number, unique: true }, 
  date: { type: Date, required: true },
  item_name: { type: String, required: true },
  specification: { type: String },
  opening_stock: { type: String },
  received_qty: { type: String },
  issued_qty: { type: String },
  balance_stock: { type: String },
  issued_to: { type: String },
  cost: { type: Number },
  vendor: { type: String },
  remarks: { type: String },
   createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

// Auto-generate sr_no before saving
consumableSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastRecord = await this.constructor.findOne().sort({ sr_no: -1 });
    this.sr_no = lastRecord ? lastRecord.sr_no + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Consumable", consumableSchema);
