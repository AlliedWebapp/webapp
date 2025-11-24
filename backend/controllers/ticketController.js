const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')

const adminEmailSet = new Set(["bhaskarudit02@gmail.com", "ss@gmail.com"].map((e) => e.toLowerCase()));

const toLower = (value = '') => value.toLowerCase();

const httpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const requireUser = async (req) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) {
    throw httpError(401, 'User not found');
  }
  return user;
};

const requireTicket = async (ticketId, { lean = false, select } = {}) => {
  let query = Ticket.findById(ticketId);
  if (select) {
    query = query.select(select);
  }
  if (lean) {
    query = query.lean();
  }
  const ticket = await query;
  if (!ticket) {
    throw httpError(404, 'Ticket not found');
  }
  return ticket;
};

const isAdminRequest = (req) => adminEmailSet.has(toLower(req.user.email));

const assertAuthorized = (ticketUser, req) => {
  if (!isAdminRequest(req) && !isTicketOwner(ticketUser, req.user.id)) {
    throw httpError(401, 'Not authorized');
  }
};

function getCollectionModel(projectname = '') {
  switch (projectname.toLowerCase()) {
    case 'jogini-ii':
    case 'jogini':
      return require('../models/JoginiModel');
    case 'shong':
      return require('../models/ShongModel');
    case 'solding':
      return require('../models/soldingModel');
    case 'sdllp salun':
    case 'sdllpsalun':
      return require('../models/SDLLPsalunModel');
    case 'jhp kuwarsi-ii':
      return require('../models/KuwarsiModel');
    default:
      throw new Error(`Unknown project/collection: ${projectname}`);
  }
}

const isTicketOwner = (ticketUser, reqUserId) => ticketUser.toString() === reqUserId.toString();

const parsePositiveInt = (value, fallback = 1) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseOptionalNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeImageFiles = (files) => {
  if (!files) return [];
  if (Array.isArray(files)) return files;
  if (Array.isArray(files.images)) return files.images;
  return [];
};

const normalizeAttachmentFiles = (files) => (Array.isArray(files?.attachments) ? files.attachments : []);

const mapFilesToPayload = (files = []) =>
  files.map(({ buffer, mimetype, originalname, size }) => ({
    data: buffer,
    contentType: mimetype,
    originalName: originalname,
    size,
  }));

const decrementSpareCount = async (projectname, spareId, quantity) => {
  if (!spareId) return;
  try {
    const collectionModel = getCollectionModel(projectname);
    await collectionModel.updateOne({ _id: spareId }, { $inc: { spareCount: -quantity } });
  } catch (err) {
    console.error('Error decrementing spare count:', err);
  }
};

const updateConsumableUsage = async (consumableId, fuelConsumed, distanceDriven) => {
  if (!consumableId || !Number.isFinite(fuelConsumed)) return;
  try {
    const Consumable = require('../models/ConsumableModel');
    const consumableDoc = await Consumable.findById(consumableId);
    if (!consumableDoc) {
      console.warn('[CONSUMABLE] Consumable not found for ID', consumableId);
      return;
    }

    const storageBefore = Number(consumableDoc.fuel_storage);
    if (!Number.isFinite(storageBefore)) {
      console.warn('[CONSUMABLE] fuel_storage is not a number');
      return;
    }

    const newStorage = storageBefore - fuelConsumed;
    const prevConsumed = Number(consumableDoc.fuel_consumed) || 0;
    const prevKm = Number(consumableDoc.total_km_driven) || 0;
    const kmToAdd = Number(distanceDriven) || 0;

    consumableDoc.fuel_storage = newStorage.toString();
    consumableDoc.fuel_consumed = prevConsumed + fuelConsumed;
    consumableDoc.total_km_driven = prevKm + kmToAdd;

    if (consumableDoc.total_km_driven > 0 && consumableDoc.fuel_consumed > 0) {
      consumableDoc.avg = (consumableDoc.total_km_driven / consumableDoc.fuel_consumed).toFixed(2);
    }

    await consumableDoc.save();
  } catch (err) {
    console.error('Error updating consumable usage:', err);
  }
};

const stripFilePayload = (records = []) =>
  records.map(({ contentType, originalName, size }) => ({
    contentType,
    originalName,
    size,
  }));

const sanitizeTicket = (ticketDoc) => {
  if (!ticketDoc) return ticketDoc;
  const ticket = ticketDoc.toObject ? ticketDoc.toObject() : { ...ticketDoc };
  ticket.ticket_id = ticket.ticket_id || ticket._id;
  if (Array.isArray(ticket.images)) {
    ticket.images = stripFilePayload(ticket.images);
  }
  if (Array.isArray(ticket.attachments)) {
    ticket.attachments = stripFilePayload(ticket.attachments);
  }
  return ticket;
};

const getTickets = asyncHandler(async (req, res) => {
  await requireUser(req);
  const query = isAdminRequest(req)
    ? {}
    : { user: new mongoose.Types.ObjectId(req.user.id) };

  const tickets = await Ticket.find(query)
    .sort({ createdAt: -1 })
    .select('ticket_id projectname status createdAt user')
    .lean();

  res.status(200).json(tickets.map(sanitizeTicket));
});

const getTicket = asyncHandler(async (req, res) => {
  await requireUser(req);
  const ticket = await requireTicket(req.params.id, {
    lean: true,
    select: '-images.data -attachments.data',
  });
  assertAuthorized(ticket.user, req);
  res.status(200).json(sanitizeTicket(ticket));
});

const createTicket = asyncHandler(async (req, res) => {
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
    total_km_driven,
  } = req.body;

  const missingField = [projectname, sitelocation, projectlocation, fault, issue, description, date].some(
    (field) => !field
  );
  if (missingField) {
    throw httpError(400, 'Please provide all required fields');
  }

  const user = await requireUser(req);

  const imageFiles = normalizeImageFiles(req.files);
  const attachmentFiles = normalizeAttachmentFiles(req.files);
  const images = mapFilesToPayload(imageFiles);
  const attachments = mapFilesToPayload(attachmentFiles);

  const quantity = parsePositiveInt(spareQuantity);
  const fuelConsumed = parseOptionalNumber(fuel_consumed);
  const totalKm = parseOptionalNumber(total_km_driven);

  const ticketPayload = {
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
    ...(attachments.length ? { attachments } : {}),
    ...(spare && { spare, spareQuantity: quantity }),
    ...(rating && { rating }),
    ...(consumable && { consumable }),
    ...(Number.isFinite(fuelConsumed) && { fuel_consumed: fuelConsumed }),
    ...(Number.isFinite(totalKm) && { total_km: totalKm }),
  };

  const ticket = await Ticket.create(ticketPayload);

  await decrementSpareCount(projectname, spare, quantity);
  await updateConsumableUsage(consumable, fuelConsumed, totalKm);

  const serializedTicket = sanitizeTicket(ticket);
  res.status(201).json({
    ...serializedTicket,
    uploadReport: {
      images: { saved: images.length, skipped: [] },
      attachments: { saved: attachments.length, skipped: [] },
    },
  });
});

const deleteTicket = asyncHandler(async (req, res) => {
  await requireUser(req);
  const ticket = await requireTicket(req.params.id);
  assertAuthorized(ticket.user, req);
  await ticket.deleteOne();
  res.status(200).json({ success: true });
});

const updateTicket = asyncHandler(async (req, res) => {
  await requireUser(req);
  const ticket = await requireTicket(req.params.id);
  assertAuthorized(ticket.user, req);

  const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).lean();

  res.status(200).json(sanitizeTicket(updatedTicket));
});

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket,
};
