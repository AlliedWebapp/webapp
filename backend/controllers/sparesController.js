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
        // Restrict access for inventoryOnly users
        if (req.user.role === 'inventoryOnly' && req.user.allowedProject.toLowerCase() !== 'solding') {
            return res.status(403).json({ message: 'Access denied: Not authorized for this project.' });
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;

        // Exclude picture field for list
        const [data, total] = await Promise.all([
            solding.find({}, { picture: 0 }).skip(skip).limit(limit),
            solding.countDocuments()
        ]);
        
        // Use the spareCount directly from the inventory item (no user-specific lookup)
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));

        console.log("Solding Data Found:", updatedData.length);
        res.status(200).json({
            success: true,
            data: updatedData,
            count: updatedData.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
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
        // Restrict access for inventoryOnly users
        if (req.user.role === 'inventoryOnly' && req.user.allowedProject.toLowerCase() !== 'shong') {
            return res.status(403).json({ message: 'Access denied: Not authorized for this project.' });
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;
        // Exclude picture field for list
        const [data, total] = await Promise.all([
            Shong.find({}, { picture: 0 }).skip(skip).limit(limit),
            Shong.countDocuments()
        ]);
        
        // Use the spareCount directly from the inventory item (no user-specific lookup)
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));

        console.log("Shong Data Found:", updatedData.length);
        res.status(200).json({
            success: true,
            data: updatedData,
            count: updatedData.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
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
         // Restrict access for inventoryOnly users
        if (req.user.role === 'inventoryOnly' && req.user.allowedProject.toLowerCase() !== 'jogini') {
            console.log(`Access denied for inventory-only user in Jogini:`, {
                userAllowedProject: req.user.allowedProject,
                userAllowedProjectLower: req.user.allowedProject.toLowerCase(),
                expected: 'jogini',
                match: req.user.allowedProject.toLowerCase() === 'jogini'
            });
            return res.status(403).json({ message: 'Access denied: Not authorized for this project.' });
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;
        // Exclude picture field for list
        const [data, total] = await Promise.all([
            Jogini.find({}, { picture: 0 }).skip(skip).limit(limit),
            Jogini.countDocuments()
        ]);
        
        // Use the spareCount directly from the inventory item (no user-specific lookup)
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));

        if (!updatedData.length) {
            console.log("⚠️ No Jogini data found in DB.");
        }
        console.log("✅ Jogini Data Found:", updatedData.length);
        res.status(200).json({
            success: true,
            data: updatedData,
            count: updatedData.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            message: "Data fetched successfully"
        });
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
        // Restrict access for inventoryOnly users
        if (req.user.role === 'inventoryOnly' && req.user.allowedProject.toLowerCase() !== 'sdllpsalun') {
            return res.status(403).json({ message: 'Access denied: Not authorized for this project.' });
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;
        // Exclude picture field for list
        const [data, total] = await Promise.all([
            SDLLPsalun.find({}, { picture: 0 }).skip(skip).limit(limit),
            SDLLPsalun.countDocuments()
        ]);
        
        // Use the spareCount directly from the inventory item (no user-specific lookup)
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));

        console.log("SDLLPsalun Data Found:", updatedData.length);
        res.status(200).json({
            success: true,
            data: updatedData,
            count: updatedData.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
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
        // Restrict access for inventoryOnly users
        if (req.user.role === 'inventoryOnly' && req.user.allowedProject.toLowerCase() !== 'kuwarsi') {
            return res.status(403).json({ message: 'Access denied: Not authorized for this project.' });
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;
        // Exclude picture field for list
        const [data, total] = await Promise.all([
            Kuwarsi.find({}, { picture: 0 }).skip(skip).limit(limit),
            Kuwarsi.countDocuments()
        ]);
        
        // Use the spareCount directly from the inventory item (no user-specific lookup)
        const updatedData = data.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));

        console.log("Kuwarsi Data Found:", updatedData.length);
        res.status(200).json({
            success: true,
            data: updatedData,
            count: updatedData.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
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
        const userName = req.user.name; // Get user name
        const userEmail = req.user.email; // Get user email
        const userRole = req.user.role; // Get user role
        const userAllowedProject = req.user.allowedProject; // Get user's allowed project

        // Debug logging for request body
        console.log("Request body:", {
            collectionName,
            id,
            increment,
            collectionNameType: typeof collectionName,
            idType: typeof id,
            incrementType: typeof increment
        });

        // Debug logging
        console.log("User details from request:", {
            userId: req.user._id,
            userName,
            userEmail,
            userRole,
            userAllowedProject,
            user: req.user
        });

        // Authorization check
        if (userRole === 'user') {
            return res.status(403).json({ 
                message: 'Access denied: Normal users cannot update spare counts' 
            });
        }

        // Convert collectionName to lowercase for consistency
        const normalizedCollectionName = collectionName.toLowerCase();
        
        // Check if inventoryOnly user is trying to update a different project
        if (userRole === 'inventoryOnly' && userAllowedProject.toLowerCase() !== normalizedCollectionName) {
            console.log(`Access denied for inventory-only user:`, {
                userAllowedProject: userAllowedProject,
                userAllowedProjectLower: userAllowedProject.toLowerCase(),
                normalizedCollectionName: normalizedCollectionName,
                match: userAllowedProject.toLowerCase() === normalizedCollectionName
            });
            return res.status(403).json({ 
                message: `Access denied: Inventory-only users can only update spare counts for their assigned project (${userAllowedProject})` 
            });
        }

        console.log(`Updating spare count for user ${userName} (${userEmail}) in collection ${normalizedCollectionName} for item ${id}`);

        // Find the inventory item to update its spareCount directly
        let inventoryItem;
        let Model;
        
        console.log(`Looking for model for collection: ${normalizedCollectionName}`);
        
        // Create a model mapping for more robust selection
        const modelMap = {
            'jogini': Jogini,
            'shong': Shong,
            'solding': solding,
            'sdllpsalun': SDLLPsalun,
            'kuwarsi': Kuwarsi
        };
        
        Model = modelMap[normalizedCollectionName];
        
        if (!Model) {
            console.log(`Invalid collection name: ${normalizedCollectionName}`);
            console.log(`Available models:`, Object.keys(modelMap));
            return res.status(400).json({ message: `Invalid collection name: ${normalizedCollectionName}` });
        }
        
        console.log(`Selected model: ${Model.modelName} for collection: ${normalizedCollectionName}`);

        if (!Model) {
            console.error(`Model is undefined for collection: ${normalizedCollectionName}`);
            return res.status(500).json({ message: `Model not found for collection: ${normalizedCollectionName}` });
        }

        console.log(`Attempting to find item with ID: ${id} in model: ${Model.modelName}`);
        
        try {
            inventoryItem = await Model.findById(id);
            console.log(`FindById result:`, inventoryItem ? 'Item found' : 'Item not found');
        } catch (findError) {
            console.error(`Error finding item:`, findError);
            return res.status(500).json({ message: `Database error: ${findError.message}` });
        }
        
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }

        // Update the spareCount directly in the inventory item using updateOne to avoid validation issues
        const oldCount = inventoryItem.spareCount || 0;
        const newCount = Math.max(0, oldCount + increment);
        console.log(`Updating spareCount: ${oldCount} + ${increment} = ${newCount}`);
        
        try {
            // Use updateOne to avoid triggering validation on other fields
            const updateResult = await Model.updateOne(
                { _id: id },
                { $set: { spareCount: newCount } }
            );
            
            if (updateResult.modifiedCount === 1) {
                console.log(`Successfully updated spareCount to: ${newCount}`);
                // Update the local object for response
                inventoryItem.spareCount = newCount;
            } else {
                console.error(`Update failed: modifiedCount = ${updateResult.modifiedCount}`);
                return res.status(500).json({ message: 'Failed to update spareCount - no documents were modified' });
            }
        } catch (updateError) {
            console.error(`Error updating spareCount:`, updateError);
            return res.status(500).json({ message: `Failed to update spareCount: ${updateError.message}` });
        }

        console.log(`Updated spare count for user ${userName} (${userEmail}): ${oldCount} -> ${inventoryItem.spareCount}`);
        console.log("Final inventory item:", inventoryItem);

        
        const updatedAt = new Date(inventoryItem.updatedAt);
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
            spareCount: inventoryItem.spareCount,
            userDetails: {
                name: userName,
                email: userEmail
            },
            updatedAt: formattedDate
        });
    } catch (error) {
        console.error("Error updating SpareCount:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// --- SEARCH ENDPOINTS FOR AUTOCOMPLETE ---

// Helper: build regex for case-insensitive starts-with match
const buildStartsWithRegex = (q) => new RegExp('^' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

// Jogini search
const searchJogini = async (req, res) => {
    try {
        const q = req.query.query || '';
        if (!q) return res.json([]);
        const results = await Jogini.find({
            $or: [
                { "Spare Discription": buildStartsWithRegex(q) },
                { specification: buildStartsWithRegex(q) },
                { manufacture: buildStartsWithRegex(q) },
                { type: buildStartsWithRegex(q) },
                { place: buildStartsWithRegex(q) }
            ]
        }, { picture: 0 })
        .sort({ "Spare Discription": 1 })
        .limit(50);
        
        // Use spareCount directly from inventory items
        const updatedResults = results.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));
        res.json(updatedResults);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


const searchShong = async (req, res) => {
    try {
        const q = req.query.query || '';
        if (!q) return res.json([]);
        
        const results = await Shong.find({
            $or: [
                { "Description of Material": buildStartsWithRegex(q) },
                { "Code.Specification": buildStartsWithRegex(q) },
                { Make: buildStartsWithRegex(q) },
                { Vendor: buildStartsWithRegex(q) },
                { Place: buildStartsWithRegex(q) }
            ]
        }, { picture: 0 })
        .sort({ "Description of Material": 1 })
        .limit(50);
        
        // Use spareCount directly from inventory items
        const updatedResults = results.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));
        res.json(updatedResults);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Solding search
const searchSolding = async (req, res) => {
    try {
        const q = req.query.query || '';
        if (!q) return res.json([]);
        
        const results = await solding.find({
            $or: [
                { "Description of Material": buildStartsWithRegex(q) },
                { "Code.Specification": buildStartsWithRegex(q) },
                { Make: buildStartsWithRegex(q) },
                { Vendor: buildStartsWithRegex(q) },
                { Place: buildStartsWithRegex(q) }
            ]
        }, { picture: 0 })
        .sort({ "Description of Material": 1 })
        .limit(50);
        
        // Use spareCount directly from inventory items
        const updatedResults = results.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));
        res.json(updatedResults);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// SDLLPsalun search
const searchSDLLPsalun = async (req, res) => {
    try {
        const q = req.query.query || '';
        if (!q) return res.json([]);
        
        const results = await SDLLPsalun.find({
            $or: [
                { "NAME OF MATERIALS": buildStartsWithRegex(q) },
                { SPECIFICATION: buildStartsWithRegex(q) },
                { "MAKE.MANUFACTURE": buildStartsWithRegex(q) },
                { vendor: buildStartsWithRegex(q) },
                { Place: buildStartsWithRegex(q) }
            ]
        }, { picture: 0 })
        .sort({ "NAME OF MATERIALS": 1 })
        .limit(50);
        
        // Use spareCount directly from inventory items
        const updatedResults = results.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));
        res.json(updatedResults);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// Kuwarsi search
const searchKuwarsi = async (req, res) => {
    try {
        const q = req.query.query || '';
        if (!q) return res.json([]);
        
        const results = await Kuwarsi.find({
            $or: [
                { "NAME OF MATERIALS": buildStartsWithRegex(q) },
                { SPECIFICATION: buildStartsWithRegex(q) },
                { "MAKE.MANUFACTURE": buildStartsWithRegex(q) },
                { vendor: buildStartsWithRegex(q) },
                { Place: buildStartsWithRegex(q) }
            ]
        }, { picture: 0 })
        .sort({ "NAME OF MATERIALS": 1 })
        .limit(50);
        
        // Use spareCount directly from inventory items
        const updatedResults = results.map(item => ({
            ...item.toObject(),
            spareCount: item.spareCount || 0
        }));
        res.json(updatedResults);
    } catch (e) {
        res.status(500).json({ error: e.message });
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
    searchJogini,
    searchShong,
    searchSolding,
    searchSDLLPsalun,
    searchKuwarsi
};
