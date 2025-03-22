const express = require('express'); // CommonJS module syntax
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors'); // ✅ Import CORS
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const path = require('path');
const mongoose = require('mongoose');
const spareRoutes = require('./routes/spareRoutes');
const PORT = process.env.PORT || 5000;
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const noteRoutes = require("./routes/noteRoutes");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// ✅ Import Mongoose Models
const solding = require("./models/soldingModel");
const Shong = require("./models/ShongModel");
const Jogini = require("./models/JoginiModel");
const SDLLPsalun = require("./models/SDLLPsalunModel");
const Kuwarsi = require("./models/KuwarsiModel");

console.log("MongoDB URI:", process.env.MONGODB_URI);

// ✅ Connect to database
connectDB().then(() => {
    console.log("✅ Database Connection Initialized");
    console.log("🗂️ Using Database:", mongoose.connection.name);

    // List collections after successful connection
    mongoose.connection.db.listCollections().toArray()
        .then(collections => {
            console.log("🗂️ Available Collections:", collections.map(col => col.name));
        })
        .catch(err => console.error("❌ Error Fetching Collections:", err));
});

mongoose.connection.once("open", () => {
    console.log("✅ MongoDB connection established!");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
});

// MongoDB Connection Event Logging
mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB Connected successfully');
    console.log({
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
    });
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', {
        error: err,
        message: err.message,
        code: err.code,
        connectionString: 'MongoDB URI is ' + (process.env.MONGODB_URI ? 'set' : 'not set')
    });
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", userRoutes);
app.use(cors({ origin: "http://localhost:3000" })); // Change to your frontend URL


// API Routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/spares", spareRoutes);
app.use("/api/users", userRoutes);

// CORS Configuration
const corsOptions = {
    origin: ['https://alliedwebapp.vercel.app', 'https://backend-services-theta.vercel.app'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Detailed request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}]`);
    console.log(`📍 Route accessed: ${req.method} ${req.url}`);
    console.log('📦 Request Body:', req.body);
    console.log('🔍 Query Params:', req.query);
    console.log('🎯 Headers:', req.headers);
    next();
});

// Mount routes - IMPORTANT: Order matters!
app.use('/api', spareRoutes);  // This will handle all /api routes

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Support Desk API',
        environment: process.env.NODE_ENV,
        endpoints: {
            jogini: '/api/jogini',
            solding: '/api/solding',
            shong: '/api/shong',
            sdllpsalun: '/api/sdllpsalun',
            kuwarsi: '/api/kuwarsi'
        }
    });
});

// Define the API route for fetching inventory data
app.get('/api/inventory', async (req, res) => {
    try {
        const collection = db.collection("Jogini"); // Use correct collection name
        const inventory = await collection.find({ Month: "MAY" }).toArray();
        res.json(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/:collection", async (req, res) => {
    const { collection } = req.params;

    try {
        const validCollections = ["Jogini", "Shong", "solding", "SDLLPsalun", "Kuwarsi"];
        if (!validCollections.includes(collection)) {
            return res.status(400).json({ error: "Invalid collection name" });
        }

        const dbCollection = db.collection(collection);
        const inventory = await dbCollection.find({}).toArray(); // Fetch all documents

        res.json(inventory);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ error: "Server error" });
    }
});


// 404 handler - must be after all valid routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Route not found',
        availableEndpoints: {
            root: '/',
            jogini: '/api/jogini',
            solding: '/api/solding',
            shong: '/api/shong',
            sdllpsalun: '/api/sdllpsalun',
            kuwarsi: '/api/kuwarsi'
        }
    });
});

// Error handling with full details
app.use((err, req, res, next) => {
    console.error('🔴 Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message,
        stack: err.stack,
        error: err,
        route: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

/**
 * ✅ Start Server
 */
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
