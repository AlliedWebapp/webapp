const express = require("express");
const router = express.Router();
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket
} = require("../controllers/ticketController");

const { protect } = require("../middleware/authMiddleware");
const upload = require('../middleware/uploadMiddleware');

// Re-route into note router for ticket-related notes
const noteRouter = require("./noteRoutes");
router.use("/:ticketId/notes", noteRouter);

// Ticket Routes (Protected)
router.route("/")
  .get(protect, getTickets)   // Get all tickets
  .post(protect, createTicket); // Create a new ticket

router.route("/:id")
  .get(protect, getTicket)   // Get a single ticket
  .put(protect, updateTicket) // Update ticket details
  .delete(protect, deleteTicket); // Delete a ticket

  // For ticket creation with images
router.post('/', protect, upload.array('images', 4), createTicket);

module.exports = router;
