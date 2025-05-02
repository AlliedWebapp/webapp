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

// Main ticket routes
router.route("/")
  .get(protect, getTickets)
  .post(protect, upload.array('images', 4), createTicket); // ✅ only one post route here

router.route("/:id")
  .get(protect, getTicket)
  .put(protect, updateTicket)
  .delete(protect, deleteTicket);

  
// Serve individual images for a ticket
router.get("/:ticketId/images/:index", async (req, res) => {
  try {
    const ticket = await require("../models/ticketModel").findById(req.params.ticketId);
    const index = parseInt(req.params.index);

    if (!ticket || !ticket.images || index >= ticket.images.length) {
      return res.status(404).send("Image not found");
    }

    const image = ticket.images[index];

    // If image is stored as plain Buffer (which multer does), no .data needed
    res.set("Content-Type", image.contentType || "image/jpeg");
    res.send(Buffer.from(image.data)); // Force sending raw binary    
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
