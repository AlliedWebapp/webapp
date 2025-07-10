const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')


const adminEmails = ["bhaskarudit02@gmail.com", "ss@gmail.com"].map(e => e.toLowerCase());

function getCollectionModel(projectname) {
  console.log("getCollectionModel called with:", projectname);
  switch (projectname.toLowerCase()) {
    case "jogini-ii":
    case "jogini":
      return require("../models/JoginiModel");
    case "shong":
      return require("../models/ShongModel");
    case "solding":
      return require("../models/soldingModel");
    case "sdllp salun":
    case "sdllpsalun":
      return require("../models/SDLLPsalunModel");
    case "jhp kuwarsi-ii":
      return require("../models/KuwarsiModel");
    default:
      throw new Error("Unknown project/collection: " + projectname);
  }
}

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
  console.log("[TICKET] Ticket creation attempt received at", new Date().toISOString());
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

    const imageFiles = req.files;
    const images = imageFiles?.map(file => ({
      data: file.buffer,
      contentType: file.mimetype,
    })) || [];

    if (!projectname || !sitelocation || !projectlocation || !fault || !issue || !description || !date || !spare || !rating || !imageFiles)  {
      console.log("Missing required fields", req.body, req.files);
      res.status(400)
      throw new Error('Please provide all required fields')
    }

    const user = await User.findById(req.user.id)
    if (!user) {
      console.log("User not found", req.user.id);
      res.status(401)
      throw new Error('User not found')
    }

    // Create the ticket
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
      createdBy: user.email,
      status: 'new'
    });

    // --- Decrement spare count logic ---
    try {
      const collectionModel = getCollectionModel(projectname);

      
      const spareDocBefore = await collectionModel.findById(spare);
      console.log("================ SPARE DECREMENT LOG ================");
      if (spareDocBefore) {
        console.log(`SPARE ID: ${spare}`);
        console.log(`SPARE NAME: ${spareDocBefore.name || 'N/A'}`);
        console.log(`COUNT BEFORE DECREMENT: ${spareDocBefore.spareCount}`);
      } else {
        console.log(`SPARE ID: ${spare}`);
        console.log("SPARE NOT FOUND BEFORE DECREMENT");
      }

      // 1. Decrement in the project inventory using direct $inc
      const updateResult = await collectionModel.updateOne(
        { _id: spare },
        { $inc: { spareCount: -1 } }
      );
      console.log("Direct $inc update result:", updateResult);

      // Fetch the spare document again to log count after decrement
      const spareDocAfter = await collectionModel.findById(spare);
      if (spareDocAfter) {
        console.log(`COUNT AFTER DECREMENT: ${spareDocAfter.spareCount}`);
      } else {
        console.log("SPARE NOT FOUND AFTER DECREMENT");
      }
      console.log("======================================================");

      
      const UserSpareCount = require('../models/UserSpareCount');
      const collectionName = collectionModel.collection.collectionName.toLowerCase();
      await UserSpareCount.findOneAndUpdate(
        {
          userId: req.user.id, // or req.user._id, ensure consistency
          collectionName,
          itemId: spare
        },
        { $inc: { spareCount: -1 } },
        { upsert: true, new: true }
      );
      const userSpare = await UserSpareCount.findOne({ userId: req.user.id, collectionName, itemId: spare });
      console.log("UserSpareCount after decrement:", userSpare);
    } catch (err) {
      console.error("Error decrementing spare count:", err);
    }
    // --- End decrement logic ---

    res.status(201).json(ticket)
  } catch (error) {
    console.error('[TICKET] Error creating ticket:', error);
    res.status(500).json({
      message: 'Error creating ticket',
      error: error.message
    });
  }
});




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
