// 📌 Import Dependencies
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors'); 
const path = require('path');
const mongoose = require('mongoose');
const qaRoutes = require('./routes/qaRoutes');
const inventorActions = require('./routes/InventoryActions')

// 📌 Import Local Modules
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const spareRoutes = require('./routes/spareRoutes');
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const noteRoutes = require("./routes/noteRoutes");
const reportRoutes = require("./routes/ReportRoutes"); 
const FormatsRoutes = require('./routes/FormatsRoutes');
const inventoryActions = require('./routes/InventoryActions');

// 📌 Load Environment Variables
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const PORT = process.env.PORT || 5001;

// ✅ Debugging Environment Variables
console.log("🔑 JWT_SECRET:", process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌");
console.log("📦 MONGODB_URI:", process.env.MONGODB_URI ? "Loaded ✅" : "Missing ❌");

// ✅ Initialize Express App
const app = express();

// ✅ CORS Configuration
app.use(cors({
    // origin:["https://alliedwebapp.vercel.app", "https://backend-services-theta.vercel.app"],
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Optional but helpful
app.options('*', cors());

// 📌 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Detailed request logging middleware
app.use((req, res, next) => {
    console.log('🔍 Request Details:');
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Headers:`, req.headers);
    console.log(`Body:`, req.body);
    console.log('-------------------');
    next();
});

// 📌 Connect to MongoDB
connectDB();

// 📌 API Routes
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api', spareRoutes);
app.use('/api/formats', FormatsRoutes);
app.use('/api/qa', qaRoutes);
app.use('/api/inventory', inventoryActions);


// 📌 Default Root Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Support Desk API',
        environment: process.env.NODE_ENV,
        endpoints: {
            login: '/api/users/login',
            register: '/api/users',
            jogini: '/api/jogini',
            solding: '/api/solding',
            shong: '/api/shong',
            sdllpsalun: '/api/sdllpsalun',
            kuwarsi: '/api/kuwarsi'
        }
    });
});

// 📌 Test Route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// 📌 Serve static files in production
if (process.env.NODE_ENV === "production") {
    // Serve static files from the React app
    const buildPath = path.join(__dirname, 'frontend', 'build');
    app.use(express.static(buildPath));

  // 2) for any other GET, send back React's index.html
  app.get('/*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});
} else {
    // In development, just log that we're in dev mode
    console.log('🛠️ Running in development mode - static files not served');
}

// 📌 Error Handling Middleware
app.use(errorHandler);

// 📌 404 Handler - Moved to the very end
app.use('*', (req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        message: 'Route not found',
        availableEndpoints: {
            root: '/',
            login: '/api/users/login',
            register: '/api/users',
            jogini: '/api/jogini',
            solding: '/api/solding',
            shong: '/api/shong',
            sdllpsalun: '/api/sdllpsalun',
            kuwarsi: '/api/kuwarsi'
        }
    });
});

// 📌 Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📝 API available at http://localhost:${PORT}`);
    console.log(`🔑 Login endpoint: http://localhost:${PORT}/api/users/login`);
});

// Export app for Vercel
module.exports = app;

const express = require("express");
const joginiRoutes = require("./routes/joginiRoutes");

app.use(express.json());

app.use("/api", joginiRoutes);

module.exports = app;
