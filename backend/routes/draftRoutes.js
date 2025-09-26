
const express = require('express');
const router = express.Router();
const {
  createOrUpdateTicketDraft,
  getTicketDraft,
  getTicketDrafts,
  deleteTicketDraft,
  createOrUpdateFsrDraft,
  getFsrDraft,
  getFsrDrafts,
  deleteFsrDraft,
} = require('../controllers/draftController');
const { protect } = require('../middleware/authMiddleware');

// Ticket Draft Routes
router.route('/tickets').post(protect, createOrUpdateTicketDraft).get(protect, getTicketDrafts);
router.route('/tickets/:id').get(protect, getTicketDraft).delete(protect, deleteTicketDraft);

// FSR Draft Routes
router.route('/fsrs').post(protect, createOrUpdateFsrDraft).get(protect, getFsrDrafts);
router.route('/fsrs/:id').get(protect, getFsrDraft).delete(protect, deleteFsrDraft);

module.exports = router;
