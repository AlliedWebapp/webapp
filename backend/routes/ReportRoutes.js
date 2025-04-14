const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();  // Store file as buffer in memory
const upload = multer({ storage: storage });

// Import the controller functions
const { submitFSR, getAllFSRs, getFSRById } = require("../controllers/ReportController");

// Route to fetch all FSR reports
router.get("/fsrs", getAllFSRs); // 👈 GET route to fetch all reports

// Route to submit a new FSR report (with image uploads)
router.post(
  "/submit-fsr",
  upload.fields([ 
    { name: "customerSignature", maxCount: 1 },   // Upload 1 customer signature image
    { name: "engineerSignature", maxCount: 1 },    // Upload 1 engineer signature image
    { name: "workPhotos", maxCount: 4 },           // Upload up to 4 work photos
  ]),
  submitFSR // Call submitFSR function from the controller to handle submission
);

// Route to fetch a specific FSR report by fsrId
router.get("/fsr/:fsrId", getFSRById); // 👈 GET route to fetch a specific report by fsrId

module.exports = router;
