const mongoose = require("mongoose");

const joginiSchema = new mongoose.Schema({
    sNo: { type: Number, required: true },
    spareDescription: { type: String, required: true, trim: true },
    make: {
        vendor: { type: String, required: true, trim: true },
    },
    month: { type: String, required: true, trim: true },
    openingStock: { type: Number, default: 0 },
    receivedQty: { type: Number, default: 0 },
    monthlyConsumption: { type: Number, default: 0 },
    closingStock: { type: Number, default: 0 },
    msl: { type: Number, default: 0 },
    sign: { type: String, trim: true },
    spareCount: { type: Number, default: 0 } // ✅ Added Spareount field
}, { timestamps: true, collection: "Jogini" });

const Jogini = mongoose.model("Jogini", joginiSchema);
module.exports = Jogini;
