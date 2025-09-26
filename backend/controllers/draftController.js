
const asyncHandler = require('express-async-handler');
const TicketDraft = require('../models/TicketDraftModel');
const FsrDraft = require('../models/FsrDraftModel');

// @desc    Create or update a ticket draft
// @route   POST /api/drafts/tickets
// @access  Private
const createOrUpdateTicketDraft = asyncHandler(async (req, res) => {
  const { id, ...draftData } = req.body;

  if (id) {
    const updatedDraft = await TicketDraft.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { ...draftData, user: req.user.id },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedDraft);
  } else {
    const newDraft = await TicketDraft.create({ ...draftData, user: req.user.id });
    res.status(201).json(newDraft);
  }
});

const getTicketDrafts = asyncHandler(async (req, res) => {
  const drafts = await TicketDraft.find({ user: req.user.id });
  res.status(200).json(drafts);
});

const getTicketDraft = asyncHandler(async (req, res) => {
  const draft = await TicketDraft.findOne({ _id: req.params.id, user: req.user.id });
  if (!draft) {
    res.status(404);
    throw new Error('Draft not found');
  }
  res.status(200).json(draft);
});

const deleteTicketDraft = asyncHandler(async (req, res) => {
  const draft = await TicketDraft.findOne({ _id: req.params.id, user: req.user.id });

  if (!draft) {
    res.status(404);
    throw new Error('Draft not found');
  }

  await draft.remove();

  res.status(200).json({ id: req.params.id });
});

// @desc    Create or update an FSR draft
// @route   POST /api/drafts/fsrs
// @access  Private
const createOrUpdateFsrDraft = asyncHandler(async (req, res) => {
  const { id, ...draftData } = req.body;

  if (id) {
    const updatedDraft = await FsrDraft.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { ...draftData, user: req.user.id },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedDraft);
  } else {
    const newDraft = await FsrDraft.create({ ...draftData, user: req.user.id });
    res.status(201).json(newDraft);
  }
});

const getFsrDrafts = asyncHandler(async (req, res) => {
  const drafts = await FsrDraft.find({ user: req.user.id });
  res.status(200).json(drafts);
});

const getFsrDraft = asyncHandler(async (req, res) => {
  const draft = await FsrDraft.findOne({ _id: req.params.id, user: req.user.id });
  if (!draft) {
    res.status(404);
    throw new Error('Draft not found');
  }
  res.status(200).json(draft);
});

const deleteFsrDraft = asyncHandler(async (req, res) => {
  const draft = await FsrDraft.findOne({ _id: req.params.id, user: req.user.id });

  if (!draft) {
    res.status(404);
    throw new Error('Draft not found');
  }

  await draft.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  createOrUpdateTicketDraft,
  getTicketDraft,
  getTicketDrafts,
  deleteTicketDraft,
  createOrUpdateFsrDraft,
  getFsrDraft,
  getFsrDrafts,
  deleteFsrDraft,
};
