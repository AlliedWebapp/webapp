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
    // Validate ticketId format
    if (!ticketId || !/^[0-9a-fA-F]{24}$/.test(ticketId)) {
      return res.status(400).json({ 
        msg: "Invalid ticket ID format",
        error: "Ticket ID must be a valid MongoDB ObjectId"
      });
    }

    const ticket = await require("../models/ticketModel").findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ 
        msg: "Ticket not found",
        error: `No ticket found with ID: ${ticketId}`
      });
    }

    if (!ticket.projectname) {
      return res.status(400).json({ 
        msg: "Invalid ticket data",
        error: "Ticket does not have a project name"
      });
    }

    // Mapping of collections to their models and field names
    const collectionMapping = {
      'jogini': { 
        model: require("../models/Jogini"),
        field: 'spareDescription'
      },
      'jogini-ii': { 
        model: require("../models/Jogini"),
        field: 'spareDescription'
      },
      'kuwarsi': { 
        model: require("../models/Kuwarsi"),
        field: 'nameOfMaterials'
      },
      'kuwarsi-ii': { 
        model: require("../models/Kuwarsi"),
        field: 'nameOfMaterials'
      },
      'jhp kuwarsi-ii': { 
        model: require("../models/Kuwarsi"),
        field: 'nameOfMaterials'
      },
      'sdllp salun': { 
        model: require("../models/SDLLPsalun"),
        field: 'nameOfMaterials'
      },
      'sdllpsalun': { 
        model: require("../models/SDLLPsalun"),
        field: 'nameOfMaterials'
      },
      'shong': { 
        model: require("../models/Shong"),
        field: 'descriptionOfMaterial'
      },
      'solding': { 
        model: require("../models/Solding"),
        field: 'descriptionOfMaterial'
      }
    };

    const project = ticket.projectname.toLowerCase();
    const collectionInfo = collectionMapping[project];

    if (!collectionInfo) {
      return res.status(400).json({ 
        msg: "Invalid project",
        error: `Project '${project}' is not supported. Valid projects are: ${Object.keys(collectionMapping).join(', ')}`
      });
    }

    // Fetch spares directly from the collection
    const spares = await collectionInfo.model.find({}, `${collectionInfo.field} _id quantity`);
    
    if (!spares || spares.length === 0) {
      return res.status(404).json({ 
        msg: "No spares found",
        error: `No spares found for project ${project}`
      });
    }

    // Map the response to a consistent format
    const mappedDescriptions = spares.map(spare => ({
      id: spare._id,
      description: spare[collectionInfo.field] || 'Unknown',
      quantity: spare.quantity || 0
    }));

    return res.status(200).json(mappedDescriptions);
  } catch (err) {
    console.error("Error in spare-description route:", err);
    return res.status(500).json({ 
      msg: "Server Error", 
      error: err.message 
    });
  }
});

module.exports = router;

