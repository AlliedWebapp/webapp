const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')

const adminEmails = ["bhaskarudit02@gmail.com", "ss@gmail.com"].map(e => e.toLowerCase());

// Helper to compare ObjectId or string
function isTicketOwner(ticketUser, reqUserId) {
  return ticketUser.toString() === reqUserId.toString();
}

// @desc    Get user tickets (admin: all, user: own)
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const userEmail = (req.user.email || "").toLowerCase();

  let tickets;
  if (adminEmails.includes(userEmail)) {
    tickets = await Ticket.find({});
  } else {
    tickets = await Ticket.find({ user: new mongoose.Types.ObjectId(req.user.id) });
  }

  res.status(200).json(tickets);
});

// @desc    Get user ticket (admin: any, user: own)
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const userEmail = (req.user.email || "").toLowerCase();

  // Admin can view any ticket; user only their own
  if (
    !adminEmails.includes(userEmail) &&
    !isTicketOwner(ticket.user, req.user.id)
  ) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(ticket);
});

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  try {
    const { 
      projectname, 
      sitelocation, 
      projectlocation, 
      fault, 
      issue, 
      description, 
      date, 
      spare, 
      rating,
    } = req.body

   // Get uploaded files from multer
  const imageFiles = req.files;
  const imagePaths = imageFiles.map((file) => file.path); // save path to DB

    if (!projectname || !sitelocation || !projectlocation || !fault || !issue || !description || !date || !spare || !rating) {
      res.status(400)
      throw new Error('Please provide all required fields')
    }

    // Get user using the id and JWT
    const user = await User.findById(req.user.id)

    if (!user) {
      res.status(401)
      throw new Error('User not found')
    }

    const images = req.files?.map(file => ({
      data: file.buffer,
      contentType: file.mimetype,
    })) || [];

    console.log('Creating new ticket...');
    const ticket = await Ticket.create({
      projectname,
      sitelocation,
      projectlocation,
      fault,
      issue,
      description,
      date,
      spare,
      rating,
      images,
      user: req.user.id,
      status: 'new'
      // ❌ DO NOT pass `ticket_id` here manually!
    });
    
    
    await ticket.save(); // ✅ triggers the pre('save') hook and sets ticket_id
    
    console.log('Ticket created successfully:', ticket);
    res.status(201).json(ticket)
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      message: 'Error creating ticket',
      error: error.message
    });
  }
})

// @desc    Delete ticket (admin: any, user: own)
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const userEmail = (req.user.email || "").toLowerCase();

  // Admin can delete any ticket; user only their own
  if (
    !adminEmails.includes(userEmail) &&
    !isTicketOwner(ticket.user, req.user.id)
  ) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await ticket.remove();

  res.status(200).json({ success: true });
});

// @desc    Update ticket (admin: any, user: own)
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const userEmail = (req.user.email || "").toLowerCase();

  // Admin can update any ticket; user only their own
  if (
    !adminEmails.includes(userEmail) &&
    !isTicketOwner(ticket.user, req.user.id)
  ) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedTicket);
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
};
