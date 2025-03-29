const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "SPARES",  // ✅ Explicitly set the database name
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`🗂️ Using Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;
