const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Note = require('../models/noteModel')
const Ticket = require('../models/ticketModel')

// Define admin emails (always lowercase for comparison)
const adminEmails = ["bhaskarudit02@gmail.com", "ss@gmail.com"].map(e => e.toLowerCase());

// Helper to compare ObjectId or string
function isTicketOwner(ticketUser, reqUserId) {
  return ticketUser.toString() === reqUserId.toString();
}

// @desc    Get notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.ticketId)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  const userEmail = (req.user.email || "").toLowerCase();

  // Admin can view any ticket's notes; user only their own
  if (
    !adminEmails.includes(userEmail) &&
    !isTicketOwner(ticket.user, req.user.id)
  ) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const notes = await Note.find({ ticket: req.params.ticketId })

  res.status(200).json(notes)
})

// @desc    Create ticket note
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
const addNote = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(401)
    throw new Error('User not found')
  }

  const ticket = await Ticket.findById(req.params.ticketId)
  if (!ticket) {
    res.status(404)
    throw new Error('Ticket not found')
  }

  const userEmail = (req.user.email || "").toLowerCase();

  // Admin can add notes to any ticket; user only their own
  if (
    !adminEmails.includes(userEmail) &&
    !isTicketOwner(ticket.user, req.user.id)
  ) {
    res.status(401)
    throw new Error('User not authorized')
  }

  const note = await Note.create({
    ticket: req.params.ticketId,
    text: req.body.text,
    isStaff: false,
    user: req.user.id
  })

  res.status(200).json(note)
})

module.exports = {
  getNotes,
  addNote
}
