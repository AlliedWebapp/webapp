const express = require("express");
const router = express.Router();
const { 
    getSpareInventory,
    getAllSolding,
    getAllShong,
    getAllJogini,
    getAllSDLLPsalun,
    getAllKuwarsi
} = require("../controllers/sparesController");

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

// Data routes
router.get("/jogini", getAllJogini);
router.get("/solding", getAllSolding);
router.get("/shong", getAllShong);
router.get("/sdllpsalun", getAllSDLLPsalun);
router.get("/kuwarsi", getAllKuwarsi);
router.get("/inventory", getSpareInventory);

module.exports = router;
