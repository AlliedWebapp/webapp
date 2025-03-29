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
router.put("/update-spare", protect, updatespareCount);

// Get user-specific SpareCounts for a collection (protected route)
router.get("/spare-counts/:collectionName", protect, getUserSpareCounts);

// Data routes (protected)
router.get("/jogini", protect, getAllJogini);
router.get("/solding", protect, getAllSolding);
router.get("/shong", protect, getAllShong);
router.get("/sdllpsalun", protect, getAllSDLLPsalun);
router.get("/kuwarsi", protect, getAllKuwarsi);
router.get("/inventory", protect, getSpareInventory);

module.exports = router;
