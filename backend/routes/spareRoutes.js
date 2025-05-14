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
const { protect,inventoryAccess } = require("../middleware/authMiddleware");

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
router.put("/update-spare", protect, inventoryAccess, updatespareCount);

// Get user-specific SpareCounts for a collection (protected route)
router.get("/spare-counts/:collectionName", protect, inventoryAccess, getUserSpareCounts);

// Data routes (protected)
router.get("/jogini", protect, inventoryAccess, getAllJogini);
router.get("/solding", protect, inventoryAccess, getAllSolding);
router.get("/shong", protect, inventoryAccess, getAllShong);
router.get("/sdllpsalun", protect, inventoryAccess, getAllSDLLPsalun);
router.get("/kuwarsi", protect, inventoryAccess, getAllKuwarsi);
router.get("/inventory", protect, inventoryAccess, getSpareInventory);

module.exports = router;
