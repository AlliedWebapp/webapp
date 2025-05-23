const express = require("express");
const router = express.Router();
const {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket
} = require("../controllers/ticketController");

const { protect, blockInventoryOnly } = require("../middleware/authMiddleware");
const upload = require('../middleware/uploadMiddleware');

router.use(protect, blockInventoryOnly);

const noteRouter = require("./noteRoutes");
router.use("/:ticketId/notes", noteRouter);

// Main ticket routes
router.route("/")
  .get( getTickets)
  .post( upload.array('images', 4), createTicket); // ✅ only one post route here

router.route("/:id")
  .get( getTicket)
  .put( updateTicket)
  .delete( deleteTicket);

  
// Serve individual images for a ticket
router.get("/:ticketId/images/:index", async (req, res) => {
  try {
    const ticket = await require("../models/ticketModel").findById(req.params.ticketId);
    const index = parseInt(req.params.index);

    if (!ticket || !ticket.images || index >= ticket.images.length) {
      return res.status(404).send("Image not found");
    }

    const image = ticket.images[index];

    // Set appropriate headers
    res.set({
      "Content-Type": image.contentType || "image/jpeg",
      "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      "Access-Control-Allow-Origin": "*" // Allow cross-origin requests
    });

    // Send the image buffer
    res.send(Buffer.from(image.data));
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).send("Server Error");
  }
});


module.exports = router;
