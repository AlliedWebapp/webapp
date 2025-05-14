const express = require("express");
const router = express.Router();
const multer = require("multer");
const ReportController = require("../controllers/ReportController");
const { protect, blockInventoryOnly } = require("../middleware/authMiddleware");
const FSR = require("../models/FSRModel");

const storage = multer.memoryStorage();  // Store file as buffer in memory
const upload = multer({ storage: storage });
router.use(protect, blockInventoryOnly);
// Import the controller functions
const { submitFSR, getAllFSRs, getFSRByMongoId, getFSRById, submitImprovementReport, getAllImprovementReports, getImprovementReportByMongoId, submitMaintenanceReport, getAllMaintenanceReports, getMaintenanceReportByMongoId  } = require("../controllers/ReportController");

// ------FSR------

// Route to check if FSR exists for a ticket
router.get("/fsr-by-ticket/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;
    const fsr = await FSR.findOne({ ticketId });
    
    if (!fsr) {
      return res.status(404).json({ message: "No FSR found for this ticket" });
    }
    
    res.json({ exists: true, fsrId: fsr.fsrId });
  } catch (err) {
    console.error("Error checking FSR:", err);
    res.status(500).json({ message: "Error checking FSR" });
  }
});

// Route to fetch all FSR reports
router.get("/fsrs", getAllFSRs);

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

// -------IMPROVEMENT REPORTS-----
// 🚨 Improvement Report Route (New)
router.post(
  "/submit-improvement-report",
  upload.fields([
    { name: "hodSign", maxCount: 1 },
    { name: "plantSign", maxCount: 1 },
  ]),
  submitImprovementReport
);

// ✅ New GET route for improvement reports
router.get("/view-improvement-reports", getAllImprovementReports);
//get improvement report by id
router.get("/improvement-report-details/:id", getImprovementReportByMongoId); // ✅ Correct handler

// ------------MAINTENANCE REPORTS------------
// 🚧 Maintenance Report Route
router.post(
  "/submit-maintenance-report",
  upload.fields([
    { name: "hodSignature", maxCount: 1 },
    { name: "plantInchargeSignature", maxCount: 1 },
  ]),
  submitMaintenanceReport
);

router.get("/view-maintenance-reports", getAllMaintenanceReports); //list
router.get("/maintenance-report-details/:id", getMaintenanceReportByMongoId); //detailed

module.exports = router;
