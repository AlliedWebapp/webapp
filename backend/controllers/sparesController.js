const Jogini = require("../models/JoginiModel");
const Shong = require("../models/ShongModel");
const solding = require("../models/soldingModel");
const SDLLPsalun = require("../models/SDLLPsalunModel");
const Kuwarsi = require("../models/KuwarsiModel");
const UserSpareCount = require("../models/UserSpareCount");
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
        const userId = req.user._id;
        const data = await solding.find();
        
        // Get user-specific spare counts
        const userSpareCounts = await UserSpareCount.find({
            userId,
            collectionName: 'solding'
        });

        // Create a map of itemId to spareCount
        const spareCountMap = userSpareCounts.reduce((map, item) => {
            map[item.itemId.toString()] = item.spareCount;
            return map;
        }, {});

        // Update spareCount in data with user-specific counts
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: spareCountMap[item._id.toString()] || 0
        }));

        console.log("Solding Data Found:", updatedData);
        res.status(200).json({
            success: true,
            data: updatedData,
            count: updatedData.length,
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
        const userId = req.user._id;
        const data = await Shong.find();
        
        // Get user-specific spare counts
        const userSpareCounts = await UserSpareCount.find({
            userId,
            collectionName: 'shong'
        });

        // Create a map of itemId to spareCount
        const spareCountMap = userSpareCounts.reduce((map, item) => {
            map[item.itemId.toString()] = item.spareCount;
            return map;
        }, {});

        // Update spareCount in data with user-specific counts
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: spareCountMap[item._id.toString()] || 0
        }));

        console.log("Shong Data Found:", updatedData);
        res.status(200).json({
            success: true,
            data: updatedData,
            count: updatedData.length,
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

// Get all Jogini data
const getAllJogini = async (req, res) => {
    console.log("🔍 Fetching Jogini data...");
    try {
        const userId = req.user._id;
        const data = await Jogini.find();
        
        // Get user-specific spare counts
        const userSpareCounts = await UserSpareCount.find({
            userId,
            collectionName: 'jogini'
        });

        // Create a map of itemId to spareCount
        const spareCountMap = userSpareCounts.reduce((map, item) => {
            map[item.itemId.toString()] = item.spareCount;
            return map;
        }, {});

        // Update spareCount in data with user-specific counts
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: spareCountMap[item._id.toString()] || 0
        }));

        if (!updatedData.length) {
            console.log("⚠️ No Jogini data found in DB.");
        }
        console.log("✅ Jogini Data Found:", updatedData);
        res.status(200).json({ success: true, data: updatedData, count: updatedData.length });
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
        const userId = req.user._id;
        const data = await SDLLPsalun.find();
        
        // Get user-specific spare counts
        const userSpareCounts = await UserSpareCount.find({
            userId,
            collectionName: 'sdllpsalun'
        });

        // Create a map of itemId to spareCount
        const spareCountMap = userSpareCounts.reduce((map, item) => {
            map[item.itemId.toString()] = item.spareCount;
            return map;
        }, {});

        // Update spareCount in data with user-specific counts
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: spareCountMap[item._id.toString()] || 0
        }));

        console.log("SDLLPsalun Data Found:", updatedData);
        res.status(200).json({
            success: true,
            data: updatedData,
            count: updatedData.length,
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
        const userId = req.user._id;
        const data = await Kuwarsi.find();
        
        // Get user-specific spare counts
        const userSpareCounts = await UserSpareCount.find({
            userId,
            collectionName: 'kuwarsi'
        });

        // Create a map of itemId to spareCount
        const spareCountMap = userSpareCounts.reduce((map, item) => {
            map[item.itemId.toString()] = item.spareCount;
            return map;
        }, {});

        // Update spareCount in data with user-specific counts
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: spareCountMap[item._id.toString()] || 0
        }));

        console.log("Kuwarsi Data Found:", updatedData);
        res.status(200).json({
            success: true,
            data: updatedData,
            count: updatedData.length,
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

// Function to update SpareCount
const updatespareCount = async (req, res) => {
    try {
        const { projectName, descriptionField, spareName, action } = req.body;
        const userId = req.user._id;
        const userName = req.user.name;
        const userEmail = req.user.email;

        // Debug logging
        console.log("Update spare count request:", {
            projectName,
            descriptionField,
            spareName,
            action,
            userId,
            userName,
            userEmail
        });

        // Get the appropriate collection model based on projectName
        let collection;
        switch (projectName.toLowerCase()) {
            case 'jogini':
                collection = Jogini;
                break;
            case 'solding':
                collection = solding;
                break;
            case 'shong':
                collection = Shong;
                break;
            case 'sdllpsalun':
                collection = SDLLPsalun;
                break;
            case 'kuwarsi':
                collection = Kuwarsi;
                break;
            default:
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid project name" 
                });
        }

        // Find the spare item by its description
        const spareItem = await collection.findOne({ [descriptionField]: spareName });
        if (!spareItem) {
            return res.status(404).json({ 
                success: false, 
                message: "Spare item not found" 
            });
        }

        // Find or create user-specific SpareCount
        let userSpareCount = await UserSpareCount.findOne({
            userId,
            collectionName: projectName.toLowerCase(),
            itemId: spareItem._id
        });

        if (!userSpareCount) {
            userSpareCount = await UserSpareCount.create({
                userId,
                userName,
                userEmail,
                collectionName: projectName.toLowerCase(),
                itemId: spareItem._id,
                spareCount: 0
            });
        }

        // Update the spareCount based on the action
        const increment = action === "increment" ? 1 : -1;
        userSpareCount.spareCount = Math.max(0, userSpareCount.spareCount + increment);
        await userSpareCount.save();

        res.json({ 
            success: true, 
            spareCount: userSpareCount.spareCount,
            userDetails: {
                name: userSpareCount.userName,
                email: userSpareCount.userEmail
            }
        });
    } catch (error) {
        console.error("Error updating SpareCount:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error", 
            error: error.message 
        });
    }
};

// Function to get user-specific SpareCounts for a collection
const getUserSpareCounts = async (req, res) => {
    try {
        const { collectionName } = req.params;
        const userId = req.user._id;

        const userSpareCounts = await UserSpareCount.find({
            userId,
            collectionName: collectionName.toLowerCase()
        });

        // Convert to a map for easier lookup
        const spareCountMap = userSpareCounts.reduce((map, item) => {
            map[item.itemId.toString()] = {
                spareCount: item.spareCount,
                userName: item.userName,
                userEmail: item.userEmail
            };
            return map;
        }, {});

        res.json({ 
            success: true, 
            spareCounts: spareCountMap,
            userDetails: {
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (error) {
        console.error("Error fetching user SpareCounts:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getSpareInventory,
    getAllSolding,
    getAllShong,
    getAllJogini,
    getAllSDLLPsalun,
    getAllKuwarsi,
    updatespareCount,
    getUserSpareCounts
};
