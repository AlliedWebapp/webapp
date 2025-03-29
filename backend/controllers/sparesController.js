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
        const { collectionName, id, increment } = req.body;
        const userId = req.user._id; // Get user ID from authenticated request
        const userName = req.user.name; // Get user name
        const userEmail = req.user.email; // Get user email

        // Debug logging
        console.log("User details from request:", {
            userId,
            userName,
            userEmail,
            user: req.user
        });

        // Convert collectionName to lowercase for consistency
        const normalizedCollectionName = collectionName.toLowerCase();
        console.log(`Updating spare count for user ${userName} (${userEmail}) in collection ${normalizedCollectionName} for item ${id}`);

        // Find or create user-specific SpareCount
        let userSpareCount = await UserSpareCount.findOne({
            userId,
            collectionName: normalizedCollectionName,
            itemId: id
        });

        if (!userSpareCount) {
            console.log(`Creating new user-specific spare count for user ${userName} (${userEmail})`);
            // Create new user-specific SpareCount starting at 0
            userSpareCount = await UserSpareCount.create({
                userId,
                userName,
                userEmail,
                collectionName: normalizedCollectionName,
                itemId: id,
                spareCount: 0
            });
            console.log("Created new spare count:", userSpareCount);
        } else {
            // Update user info in case it has changed
            userSpareCount.userName = userName;
            userSpareCount.userEmail = userEmail;
            await userSpareCount.save(); // Save the updated user info
            console.log("Updated existing spare count:", userSpareCount);
        }

        // Update the spareCount
        const oldCount = userSpareCount.spareCount;
        userSpareCount.spareCount = Math.max(0, userSpareCount.spareCount + increment);
        await userSpareCount.save();

        console.log(`Updated spare count for user ${userName} (${userEmail}): ${oldCount} -> ${userSpareCount.spareCount}`);
        console.log("Final spare count document:", userSpareCount);

        // Format the date and time
        const updatedAt = new Date(userSpareCount.updatedAt);
        const formattedDate = updatedAt.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        res.json({ 
            success: true, 
            spareCount: userSpareCount.spareCount,
            userDetails: {
                name: userSpareCount.userName,
                email: userSpareCount.userEmail
            },
            updatedAt: formattedDate
        });
    } catch (error) {
        console.error("Error updating SpareCount:", error);
        res.status(500).json({ message: "Server error", error: error.message });
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
