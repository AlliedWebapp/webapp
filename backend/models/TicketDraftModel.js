
const mongoose = require('mongoose');

const ticketDraftSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    projectname: { type: String },
    sitelocation: { type: String },
    projectlocation: { type: String },
    fault: { type: String },
    issue: { type: String },
    description: { type: String },
    date: { type: Date },
    spare: { type: String },
    spareQuantity: { type: Number },
    consumable: { type: String },
    fuel_consumed: { type: Number },
    total_km_driven: { type: Number },
    rating: { type: String },
    images: [{ data: Buffer, contentType: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TicketDraft', ticketDraftSchema);
