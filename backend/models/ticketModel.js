const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return `TICKET-${Date.now()}`;
      }
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

// Generate 6-digit ticket_id before saving
ticketSchema.pre('save', async function (next) {
  try {
    if (!this.ticket_id) {
      console.log('Generating new ticket_id...');
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10; // Prevent infinite loops
      
      while (!isUnique && attempts < maxAttempts) {
        attempts++;
        // Generate a random 6-digit number between 100000 and 999999
        const randomId = Math.floor(100000 + Math.random() * 900000);
        console.log(`Attempt ${attempts}: Trying ticket_id ${randomId}`);
        
        const existing = await mongoose.models.Ticket.findOne({ ticket_id: randomId });
        if (!existing) {
          this.ticket_id = randomId;
          isUnique = true;
          console.log('✅ Successfully generated ticket_id:', randomId);
        }
      }
      
      if (!isUnique) {
        throw new Error('Could not generate a unique ticket_id after multiple attempts');
      }
    }
    next();
  } catch (error) {
    console.error('Error in ticket_id generation:', error);
    next(error);
  }
});

module.exports = mongoose.model('Ticket', ticketSchema)
