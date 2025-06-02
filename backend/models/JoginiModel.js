const mongoose = require("mongoose");

const joginiSchema = new mongoose.Schema({
    "S.No": { type: Number, immutable: true },
    "Spare Discription" : { type: String, required: true},
Make: {
        Vendor: { type: String, required: true, trim: true },
    },
    Month: { type: String, required: true, trim: true },
    "OPENING STOCK ( NOS )": { type: Number, default: 0 },
    "RECEIVED QTY ( NOS )": { type: Number, default: 0 },
    "Monthly Consumption ( NOS )": { type: Number, default: 0 },
    "CLOSING STOCK ( NOS )": { type: Number, default: 0 },
    "MSL (Maximum Stock Level - To be required always at site as per urgency) ( QTY )": { type: Number, default: 0 },
    SIGN: { type: String, trim: true },
    spareCount: { type: Number, default: 0 },
    picture: { data: Buffer, contentType: String },
}, { timestamps: true, collection: "Jogini" });

joginiSchema.pre("validate", async function(next) {
  if (this.isNew) {
    // Find the doc with the highest "S.No"
    const last = await this.constructor
      .findOne({}, { "S.No": 1 })
      .sort({ "S.No": -1 })
      .lean();

    // If we got one back, bump it; otherwise start at 1
    this["S.No"] = last && typeof last["S.No"] === "number"
      ? last["S.No"] + 1
      : 1;
  }
  next();
});


const Jogini = mongoose.model("Jogini", joginiSchema);
module.exports = Jogini;
