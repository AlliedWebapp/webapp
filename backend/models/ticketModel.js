const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema(
  {
    ticket_id: {
      type: Number,
      unique: true,
      required: true
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

// Pre-save hook to generate a unique 6-digit ticket_id
ticketSchema.pre('save', async function (next) {
  if (!this.ticket_id) {
    let isUnique = false
    while (!isUnique) {
      const randomId = Math.floor(100000 + Math.random() * 900000) // 6-digit number
      const existing = await mongoose.models.Ticket.findOne({ ticket_id: randomId })
      if (!existing) {
        this.ticket_id = randomId
        isUnique = true
      }
    }
  }
  next()
})

module.exports = mongoose.model('Ticket', ticketSchema)
