const mongoose = require("mongoose");

const joginiSchema = new mongoose.Schema({
    "S.No": { type: Number, immutable: true },
    "Spare Discription" : { type: String, required: true},
Make: {
        Vendor: { type: String, required: true, trim: true },
    },
    "OPENING STOCK ( NOS )": { type: String, default: "" },
    "RECEIVED QTY ( NOS )": { type: String, default: "" },
    "Monthly Consumption ( NOS )": { type: String, default: "" },
    "issued during year": { type: String, default: "" },
    "CLOSING STOCK ( NOS )": { type: String, default: "" },
    "specification": { type: String, default: "" },
    "manufacture" : { type: String, default: "" },
    "type" : { type: String, default: "" },
    "place" : { type: String, default: "" },
    "rate" : { type: String, default: "" },
    "instock" : { type: String, default: "" },
    "remarks" : { type: String, default: "" },
    "MSL (Maximum Stock Level - To be required always at site as per urgency) ( QTY )": { type: Number, default: 0 },
    SIGN: { type: String, trim: true },
    spareCount: { type: Number, default: 0 },
    picture: { data: Buffer, contentType: String },
}, { timestamps: true, collection: "Jogini" });

joginiSchema.pre("validate", async function(next) {
  if (this.isNew) {
  
    const last = await this.constructor
      .findOne({}, { "S.No": 1 })
      .sort({ "S.No": -1 })
      .lean();

  
    this["S.No"] = last && typeof last["S.No"] === "number"
      ? last["S.No"] + 1
      : 1;
  }
  next();
});


const Jogini = mongoose.model("Jogini", joginiSchema);
module.exports = Jogini;
