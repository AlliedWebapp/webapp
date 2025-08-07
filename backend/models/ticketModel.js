const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    projectname: {
      type: String,
      required: [true, 'Please select a project'],
      enum: ['Shong', 'Solding', 'Jogini-II', 'JHP Kuwarsi-II', 'SDLLP Salun']
    },
    sitelocation: {
      type: String,
      required: [true, 'Please enter site location']
    },
    projectlocation: {
      type: String,
      required: [true, 'Please enter project location']
    },
    fault: {
      type: String,
      required: [true, 'Please enter fault details']
    },
    issue: {
      type: String,
      required: [true, 'Please enter issue details']
    },
    description: {
      type: String,
      required: [true, 'Please enter a description']
    },
    date: {
      type: Date,
      required: [true, 'Please select a date']
    },
    // Optional fields
    spare: {
      type: String,
      required: false
    },
    spareQuantity: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Spare quantity must be at least 1']
    },
    consumable: {
      type: String,
      required: false
    },
    fuel_consumed: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Fuel consumed cannot be negative']
    },
    total_km: {
      type: Number,
      required: false,
      default: 0,
      min: [0, 'Total KM cannot be negative']
    },
    rating: {
      type: String,
      required: false
    },
    images: [
      {
        data: Buffer,
        contentType: String
      }
    ],
    status: {
      type: String,
      required: true,
      enum: ['new', 'open', 'close'],
      default: 'new'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    createdBy: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);


ticketSchema.pre('validate', async function (next) {
  if (!this.ticket_id) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      attempts++;
      const randomId = Math.floor(1000 + Math.random() * 9000).toString();

      const existing = await mongoose.models.Ticket.findOne({ ticket_id: randomId });
      if (!existing) {
        this.ticket_id = randomId;
        isUnique = true;
      }
    }

    if (!isUnique) {
      return next(new Error('Failed to generate unique ticket ID'));
    }
  }

  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
