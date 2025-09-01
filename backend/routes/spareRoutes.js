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
    searchJogini,
    searchShong,
    searchSolding,
    searchSDLLPsalun,
    searchKuwarsi
} = require("../controllers/sparesController");
const { protect,inventoryAccess } = require("../middleware/authMiddleware");

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



// Data routes (protected)
router.get("/jogini", protect, inventoryAccess, getAllJogini);
router.get("/solding", protect, inventoryAccess, getAllSolding);
router.get("/shong", protect, inventoryAccess, getAllShong);
router.get("/sdllpsalun", protect, inventoryAccess, getAllSDLLPsalun);
router.get("/kuwarsi", protect, inventoryAccess, getAllKuwarsi);
router.get("/inventory", protect, inventoryAccess, getSpareInventory);

// --- SEARCH ENDPOINTS FOR AUTOCOMPLETE ---
router.get("/jogini/search", protect, inventoryAccess, searchJogini);
router.get("/shong/search", protect, inventoryAccess, searchShong);
router.get("/solding/search", protect, inventoryAccess, searchSolding);
router.get("/sdllpsalun/search", protect, inventoryAccess, searchSDLLPsalun);
router.get("/kuwarsi/search", protect, inventoryAccess, searchKuwarsi);

module.exports = router;
