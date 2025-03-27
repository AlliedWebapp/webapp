const Jogini = require("../models/JoginiModel");
const Shong = require("../models/ShongModel");
const solding = require("../models/soldingModel");
const SDLLPsalun = require("../models/SDLLPsalunModel");
const Kuwarsi = require("../models/KuwarsiModel");
const mongoose = require("mongoose");
const getSpareInventory = async (req, res) => {
    try {
        res.status(200).json({ message: 'Spare inventory endpoint' });
    } catch (error) {
        console.error("Error in getSpareInventory:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching spare inventory",
            error: error.message,
            stack: error.stack
        });
    }
};

// Get all Solding data
const getAllSolding = async (req, res) => {
    console.log("Getting Solding data...");
    try {
        const data = await solding.find();
        console.log("Solding Data Found:", data);
        res.status(200).json({
            success: true,
            data: data,
            count: data.length,
            message: "Data fetched successfully"
        });
    } catch (error) {
        console.error("Error in getAllSolding:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching Solding data",
            error: error.message,
            stack: error.stack,
            details: error
        });
    }
};

// Get all Shong data
const getAllShong = async (req, res) => {
    console.log("Getting Shong data...");
    try {
        const data = await Shong.find();
        console.log("Shong Data Found:", data);
        res.status(200).json({
            success: true,
            data: data,
            count: data.length,
            message: "Data fetched successfully"
        });
    } catch (error) {
        console.error("Error in getAllShong:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching Shong data",
            error: error.message,
            stack: error.stack,
            details: error
        });
    }
};

// Get all Jogini dataconst
    const getAllJogini = async (req, res) => {
    console.log("🔍 Fetching Jogini data...");
    try {
        const data = await Jogini.find();
        if (!data.length) {
            console.log("⚠️ No Jogini data found in DB.");
        }
        console.log("✅ Jogini Data Found:", data);
        res.status(200).json({ success: true, data, count: data.length });
    } catch (error) {
        console.error("❌ Error in getAllJogini:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching Jogini data",
            error: error.message,
            stack: error.stack
        });
    }
};


// Get all SDLLPsalun data
const getAllSDLLPsalun = async (req, res) => {
    console.log("Getting SDLLPsalun data...");
    try {
        const data = await SDLLPsalun.find();
        console.log("SDLLPsalun Data Found:", data);
        res.status(200).json({
            success: true,
            data: data,
            count: data.length,
            message: "Data fetched successfully"
        });
    } catch (error) {
        console.error("Error in getAllSDLLPsalun:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching SDLLPsalun data",
            error: error.message,
            stack: error.stack,
            details: error
        });
    }
};

// Get all Kuwarsi data
const getAllKuwarsi = async (req, res) => {
    console.log("Getting Kuwarsi data...");
    try {
        const data = await Kuwarsi.find();
        console.log("Kuwarsi Data Found:", data);
        res.status(200).json({
            success: true,
            data: data,
            count: data.length,
            message: "Data fetched successfully"
        });
    } catch (error) {
        console.error("Error in getAllKuwarsi:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching Kuwarsi data",
            error: error.message,
            stack: error.stack,
            details: error
        });
    }
};

// Function to update SparesCount
const updatesparesCount = async (req, res) => {
    try {
        const { collectionName, id, increment } = req.body;

        const collections = {
            jogini: Jogini,
            shong: Shong,
            solding: solding,
            sdllpsalun: SDLLPsalun,
            kuwarsi: Kuwarsi
        };

        const Model = collections[collectionName.toLowerCase()];
        if (!Model) {
            return res.status(400).json({ message: "Invalid collection name" });
        }

        // Find the document and update SparesCount
        const updatedDoc = await Model.findByIdAndUpdate(
            id,
            { $inc: { sparesCount: increment } },
            { new: true }
        );

        if (!updatedDoc) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ success: true, updatedDoc });
    } catch (error) {
        console.error("Error updating SparesCount:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


module.exports = {
    getSpareInventory,
    getAllSolding,
    getAllShong,
    getAllJogini,
    getAllSDLLPsalun,
    getAllKuwarsi, 
    updatesparesCount
};
