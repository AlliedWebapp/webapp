const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const adminEmails = ["bhaskarudit02@gmail.com", "ss@gmail.com"];

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        return res.status(401).json({ message: "Not authorized, token missing" });
    }
});

const optionalAuth = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
        } catch (error) {
            console.warn("Optional authentication failed, proceeding without user.");
        }
    }

    next();
});

// Middleware to allow only users with role 'inventoryOnly'
const inventoryAccess = (req, res, next) => {
    if (
        req.user &&
        (req.user.role === 'user' ||
         req.user.role === 'admin' ||
         req.user.role === 'inventoryOnly')
    ) {
        return next();
    }
    return res.status(403).json({ message: "Access denied: This user has inventory access only." });
};
// Block 'inventoryOnly' from non-inventory routes
const blockInventoryOnly = (req, res, next) => {
    if (req.user && req.user.role === 'inventoryOnly') {
        return res.status(403).json({ message: "Access denied: This user has inventory access only." });
    }
    next();
};



// ✅ Export after defining functions
module.exports = { protect, optionalAuth, inventoryAccess, blockInventoryOnly };
