const express = require("express");
const router = express.Router();
const { 
    getSpareInventory,
    getAllSolding,
    getAllShong,
    getAllJogini,
    getAllSDLLPsalun,
    getAllKuwarsi,
    updatespareCount,
    getUserSpareCounts
} = require("../controllers/sparesController");
const { protect } = require("../middleware/authMiddleware");

// Mapping of collections to the field name for spare description
const collectionToFieldMapping = {
    jogini: "spareDescription",   // Field name for Jogini collection
    solding: "descriptionOfMaterial",         // Field name for Solding collection
    shong: "descriptionOfMaterial",       // Field name for Shong collection
    sdllpsalun: "nameOfMaterials",      // Field name for SDLLPsalun collection
    kuwarsi: "nameOfMaterials"         // Field name for Kuwarsi collection
};

// **New Route**: Fetch spare descriptions based on the selected project/collection
router.get("/spares/:collectionName", protect, async (req, res) => {
    try {
      const { collectionName } = req.params;  // The collection name (e.g., 'jogini')
      const normalizedCollectionName = collectionName.toLowerCase(); // Normalize to lowercase
  
      // Get the correct spare description field name from the mapping
      const spareDescriptionField = collectionToFieldMapping[normalizedCollectionName];
      
      if (!spareDescriptionField) {
        return res.status(400).json({ msg: "Invalid collection name" });
      }
  
      // Dynamically get the appropriate collection model
      let collection;
      switch (normalizedCollectionName) {
        case 'jogini':
          collection = require("../models/JoginiModel");
          break;
        case 'solding':
          collection = require("../models/soldingModel");
          break;
        case 'shong':
          collection = require("../models/ShongModel");
          break;
        case 'sdllpsalun':
          collection = require("../models/SDLLPsalunModel");
          break;
        case 'kuwarsi':
          collection = require("../models/KuwarsiModel");
          break;
        default:
          return res.status(400).json({ msg: "Invalid collection name" });
      }
  
      // Fetch the spare descriptions from the correct collection using the field name from the mapping
      const spares = await collection.find({}, spareDescriptionField);
  
      if (spares.length === 0) {
        return res.status(404).json({ msg: `No spares found for ${collectionName}` });
      }
  
      res.json(spares);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });


// Debug route to test API
router.get("/debug", (req, res) => {
    res.json({
        message: "API is working in development mode",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        routes: {
            jogini: '/api/jogini',
            solding: '/api/solding',
            shong: '/api/shong',
            sdllpsalun: '/api/sdllpsalun',
            kuwarsi: '/api/kuwarsi'
        }
    });
});

// Update spares count (protected route)
router.patch("/update-spare-count", protect, updatespareCount);


// Data routes (protected)
router.get("/jogini", protect, getAllJogini);
router.get("/solding", protect, getAllSolding);
router.get("/shong", protect, getAllShong);
router.get("/sdllpsalun", protect, getAllSDLLPsalun);
router.get("/kuwarsi", protect, getAllKuwarsi);
router.get("/inventory", protect, getSpareInventory);

// **NEW ROUTE**: Fetch spare descriptions based on the selected project/collection
router.get("/spares/:collectionName", protect, async (req, res) => {
    try {
        const { collectionName } = req.params;  // The collection name (e.g., 'jogini')
        const normalizedCollectionName = collectionName.toLowerCase(); // Normalize to lowercase

        // Get the correct spare description field name from the mapping
        const spareDescriptionField = collectionToFieldMapping[normalizedCollectionName];
        
        if (!spareDescriptionField) {
            return res.status(400).json({ msg: "Invalid collection name" });
        }

        // Dynamically get the appropriate collection model
        let collection;
        switch (normalizedCollectionName) {
            case 'jogini':
                collection = require("../models/Jogini");
                break;
            case 'solding':
                collection = require("../models/Solding");
                break;
            case 'shong':
                collection = require("../models/Shong");
                break;
            case 'sdllpsalun':
                collection = require("../models/SDLLPsalun");
                break;
            case 'kuwarsi':
                collection = require("../models/Kuwarsi");
                break;
            default:
                return res.status(400).json({ msg: "Invalid collection name" });
        }

        // Fetch the spare descriptions from the correct collection using the field name from the mapping
        const spares = await collection.find({}, spareDescriptionField);

        if (spares.length === 0) {
            return res.status(404).json({ msg: `No spares found for ${collectionName}` });
        }

        res.json(spares);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});


module.exports = router;