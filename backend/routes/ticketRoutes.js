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

// Re-route into note router for ticket-related notes
const noteRouter = require("./noteRoutes");
router.use("/:ticketId/notes", noteRouter);

// Ticket Routes (Protected)
router.route("/")
  .get(protect, getTickets)   // Get all tickets with route /api/tickets
  .post(protect, createTicket); // Create a new ticket  /api/tickets

router.route("/:id")
  .get(protect, getTicket)   // Get a single ticket /api/tickets/:id
  .put(protect, updateTicket) // Update ticket details
  .delete(protect, deleteTicket); // Delete a ticket

module.exports = router;
