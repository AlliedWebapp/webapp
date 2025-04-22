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
router.get("/:ticketId/images/:index", protect, async (req, res) => {
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
// **New Route** to fetch spare descriptions (based on collection)
router.get("/:ticketId/spare-description", protect, async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await require("../models/ticketModel").findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    const project = ticket.projectname.toLowerCase();  // Get the project name (e.g., 'jogini')

    // Fetch spare descriptions from the spares route (using the project/collection name)
    const response = await fetch(`https://backend-services-theta.vercel.app/api/spares/spares/${project}`);
    const spareDescriptions = await response.json();

    if (response.ok) {
      return res.status(200).json(spareDescriptions);  // Send the spare descriptions back to frontend
    } else {
      return res.status(400).json({ msg: `Error fetching spare descriptions for ${project}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

module.exports = router;

