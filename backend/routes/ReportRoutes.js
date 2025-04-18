const express = require("express");
const router = express.Router();
const multer = require("multer");
const ReportController = require("../controllers/ReportController");


const storage = multer.memoryStorage();  // Store file as buffer in memory
const upload = multer({ storage: storage });

// Import the controller functions
const { submitFSR, getAllFSRs, getFSRByMongoId, getFSRById,  submitImprovementReport } = require("../controllers/ReportController");

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

router.get("/fsr/:id", getFSRByMongoId); // 👈 GET FSR by _id

// 🚨 Improvement Report Route (New)
router.post(
  "/submit-improvement-report",
  upload.fields([
    { name: "hodSign", maxCount: 1 },
    { name: "plantSign", maxCount: 1 },
  ]),
  submitImprovementReport
);

module.exports = router;
