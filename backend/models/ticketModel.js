const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      unique: true,
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
    spare: {
      type: String,
      required: [true, 'Please enter spare details']
    },
    rating: {
      type: String,
      required: [true, 'Please enter DG rating']
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
    }
  },
  {
    timestamps: true
  }
)

// Generate 4-digit unique ticket_id before saving
ticketSchema.pre('save', async function (next) {
  if (this.ticket_id) return next(); // already exists

  let unique = false;
  let attempts = 0;

  while (!unique && attempts < 10) {
    const candidate = Math.floor(1000 + Math.random() * 9000).toString();
    const exists = await mongoose.models.Ticket.findOne({ ticket_id: candidate });
    if (!exists) {
      this.ticket_id = candidate;
      unique = true;
    }
    attempts++;
  }

  if (!unique) {
    return next(new Error('Failed to generate unique 4-digit ticket_id'));
  }

  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);