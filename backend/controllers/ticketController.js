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


function isTicketOwner(ticketUser, reqUserId) {
  return ticketUser.toString() === reqUserId.toString();
}


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

 
  if (
    !adminEmails.includes(userEmail) &&
    !isTicketOwner(ticket.user, req.user.id)
  ) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(ticket);
});


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
      spareQuantity,
      consumable,
      fuel_consumed,
      total_km_driven
    } = req.body

    const imageFiles = req.files;
    const images = imageFiles?.map(file => ({
      data: file.buffer,
      contentType: file.mimetype,
    })) || [];

    const quantity = parseInt(spareQuantity) > 0 ? parseInt(spareQuantity) : 1;

    if (!projectname || !sitelocation || !projectlocation || !fault || !issue || !description || !date)  {
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

    const ticket = await Ticket.create({
      projectname,
      sitelocation,
      projectlocation,
      fault,
      issue,
      description,
      date,
      images,
      user: req.user.id,
      createdBy: user.email,
      status: 'new',
      ...(spare && { spare }),
      ...(rating && { rating }),
      ...(spareQuantity && { spareQuantity: quantity }),
      ...(consumable && { consumable }),
      ...(fuel_consumed && { fuel_consumed: Number(fuel_consumed) }),
      ...(total_km_driven && { total_km: Number(total_km_driven) })
    });

    try {
      // Only decrement spare if spare is provided
      if (spare) {
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
        const updateResult = await collectionModel.updateOne(
          { _id: spare },
          { $inc: { spareCount: -quantity } }
        );
        console.log("Direct $inc update result:", updateResult);

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
            userId: req.user.id, 
            collectionName,
            itemId: spare
          },
          { $inc: { spareCount: -quantity } },
          { upsert: true, new: true }
        );
        const userSpare = await UserSpareCount.findOne({ userId: req.user.id, collectionName, itemId: spare });
        console.log("UserSpareCount after decrement:", userSpare);
      }
    } catch (err) {
      console.error("Error decrementing spare count:", err);
    }

    try {
      if (consumable && fuel_consumed) {
        const Consumable = require('../models/ConsumableModel');
        const consumableDoc = await Consumable.findById(consumable);
        if (consumableDoc) {
          let currentStorage = Number(consumableDoc.fuel_storage);
          let toSubtract = Number(fuel_consumed);
          let prevConsumed = Number(consumableDoc.fuel_consumed) || 0;
          let prevKm = Number(consumableDoc.total_km_driven) || 0;
          let addKm = Number(req.body.total_km_driven) || 0;
          if (!isNaN(currentStorage) && !isNaN(toSubtract)) {
            const newStorage = currentStorage - toSubtract;
            console.log(`[CONSUMABLE] Fuel storage before: ${currentStorage}, to subtract: ${toSubtract}, after: ${newStorage}`);
            consumableDoc.fuel_storage = newStorage.toString();
            // Increment total fuel_consumed
            consumableDoc.fuel_consumed = prevConsumed + toSubtract;
            // Increment total_km_driven
            consumableDoc.total_km_driven = prevKm + addKm;
            // Update avg
            if ((prevKm + addKm) > 0 && (prevConsumed + toSubtract) > 0) {
              consumableDoc.avg = ((prevKm + addKm) / (prevConsumed + toSubtract)).toFixed(2);
            }
            await consumableDoc.save();
          } else {
            console.warn('[CONSUMABLE] fuel_storage or fuel_consumed is not a number');
          }
        } else {
          console.warn('[CONSUMABLE] Consumable not found for ID', consumable);
        }
      }
    } catch (err) {
      console.error('Error decrementing consumable fuel_storage:', err);
    }


    res.status(201).json(ticket)
  } catch (error) {
    console.error('[TICKET] Error creating ticket:', error);
    res.status(500).json({
      message: 'Error creating ticket',
      error: error.message
    });
  }
});





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
