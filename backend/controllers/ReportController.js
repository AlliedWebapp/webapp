const FSR = require("../models/FSRModel"); // Your mongoose model
const { ErrorHandler } = require("../middleware/errorMiddleware");
const ImprovementReport = require("../models/ImprovementReportModel"); // Import your model
const MaintenanceReport = require("../models/MaintenanceReportModel");
const mongoose = require("mongoose");

const adminEmails = ["bhaskarudit02@gmail.com", "ss@gmail.com"];


// Helper to compare ObjectId or string
function isOwner(docUser, reqUserId) {
  return docUser.toString() === reqUserId.toString();
}

// Helper to convert buffer to base64 Data URL
const bufferToDataUrl = (imgObj) => {
  if (!imgObj || !imgObj.data) return null;
  return `data:${imgObj.contentType || 'image/jpeg'};base64,${Buffer.from(imgObj.data).toString('base64')}`;
};

// Function to generate a 4-digit unique fsr_id
function generateFSRId() {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number between 1000 and 9999
}

// Generate a 4-digit unique irId
function generateIRId() {
  return Math.floor(1000 + Math.random() * 9000); // 1000–9999
}

// Generate a 4-digit unique mrId
function generateMRId() {
  return Math.floor(1000 + Math.random() * 9000);
}

//fsr
exports.submitFSR = async (req, res, next) => {
  try {
    console.log("Submitting FSR for user:", req.user._id);
    console.log("Request body:", req.body);
    console.log("Files:", req.files);

    const { ticketId } = req.body;

    // Check if FSR already exists for this ticket
    const existingFSR = await FSR.findOne({ ticketId });
    if (existingFSR) {
      console.log("FSR already exists for ticket:", ticketId);
      return res.status(400).json({ 
        message: "A Service Report already exists for this ticket ID" 
      });
    }

    const {
      srNo,
      customerName,
      commissioningDate,
      instanceId,
      state,
      rating,
      engineModel,
      engineSerial,
      gensetSerial,
      runningHours,
      taskStart,
      taskEnd,
      problemSummary,
      natureOfFailure,
      checklist,
      engineerRemarks,
      customerRemarks,
      recommendations,
      engineerName,
      customerContact,
      customerEmail,
    } = req.body;

    // Validate required fields
    if (!customerName || !engineerName) {
      console.error("Missing required fields:", { customerName, installationAddress, siteId, engineerName });
      throw new ErrorHandler(400, "Missing required fields");
    }

    // Retrieve image buffers and content types for signatures and work photos
const customerSignature = req.files["customerSignature"]?.[0]
  ? {
      data: req.files["customerSignature"][0].buffer,
      contentType: req.files["customerSignature"][0].mimetype,
    }
  : null;

const engineerSignature = req.files["engineerSignature"]?.[0]
  ? {
      data: req.files["engineerSignature"][0].buffer,
      contentType: req.files["engineerSignature"][0].mimetype,
    }
  : null;

const workPhotos = req.files["workPhotos"]
  ? req.files["workPhotos"].map(file => ({
      data: file.buffer,
      contentType: file.mimetype,
    }))
  : [];

    console.log("Files processed:", {
      hasCustomerSignature: !!customerSignature,
      hasEngineerSignature: !!engineerSignature,
      workPhotosCount: workPhotos.length
    });

    // Generate a 4-digit fsr_id for each report
    const fsrId = generateFSRId();
    console.log("Generated FSR ID:", fsrId);

    // Create new FSR report with generated fsr_id
    const newReport = new FSR({
      fsrId,
      ticketId,
      srNo,
      customerName,
      commissioningDate,
      instanceId,
      state,
      rating,
      engineModel,
      engineSerial,
      gensetSerial,
      runningHours,
      taskStart,
      taskEnd,
      problemSummary,
      natureOfFailure,
      checklist,
      engineerRemarks,
      customerRemarks,
      recommendations,
      engineerName,
      customerContact,
      customerEmail,
      customerSignature,
      engineerSignature,
      workPhotos,
      user: req.user._id,
      createdBy: req.user.email,
    });

    console.log("New FSR report object created:", {
      fsrId: newReport.fsrId,
      ticketId: newReport.ticketId,
      user: newReport.user
    });

    // Save the new report to the database
    const savedReport = await newReport.save();
    console.log("FSR report saved successfully:", {
      id: savedReport._id,
      fsrId: savedReport.fsrId
    });

    res.status(201).json({ 
      message: "FSR submitted successfully!",
      fsrId: savedReport.fsrId
    });
  } catch (err) {
    console.error("Error in submitFSR:", err);
    next(err);
  }
};

// Get all FSRs (admin: all, user: own)
exports.getAllFSRs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (!adminEmails.includes(req.user.email)) {
      query.user = req.user._id;
    }

    const reports = await FSR.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FSR.countDocuments(query);

    res.json({
      reports,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReports: total
    });
  } catch (err) {
    next(err);
  }
};

// ✅ NEW FUNCTION TO FETCH BY MONGO _id
// Get FSR by Mongo _id (admin: any, user: own)
exports.getFSRByMongoId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ErrorHandler(400, "FSR ID is required");
    }

    const report = await FSR.findById(id).lean();
    if (!report) {
      throw new ErrorHandler(404, "FSR not found");
    }

    // Admin can view any report; user only their own
    if (
      !adminEmails.includes(req.user.email) &&
      !isOwner(report.user, req.user._id)
    ) {
      throw new ErrorHandler(401, "Not authorized to view this FSR");
    }

    // Convert image data to base64
    if (report.customerSignature) {
      report.customerSignature = {
        data: report.customerSignature.data.toString('base64'),
        contentType: report.customerSignature.contentType
      };
    }

    if (report.engineerSignature) {
      report.engineerSignature = {
        data: report.engineerSignature.data.toString('base64'),
        contentType: report.engineerSignature.contentType
      };
    }

    if (report.workPhotos && Array.isArray(report.workPhotos)) {
      report.workPhotos = report.workPhotos.map(photo => ({
        data: photo.data.toString('base64'),
        contentType: photo.contentType
      }));
    }

    res.json(report);
  } catch (err) {
    next(err);
  }
};

//improvement report
exports.submitImprovementReport = async (req, res, next) => {
  try {
    const {
      number,
      department,
      equipment_no,
      equipment_system,
      location,
      objectives,
      concept_date,
      implementation_date,
      present_condition,
      modification,
      resources,
      mandays,
      cost,
      payback,
      end_result,
      additional_info
    } = req.body;

    // Basic validation
    if (!number || !department || !equipment_no || !location) {
      throw new ErrorHandler(400, "Missing required fields");
    }

    // Image buffers and content types for signatures
const hodSign = req.files["hodSign"]?.[0]
  ? {
      data: req.files["hodSign"][0].buffer,
      contentType: req.files["hodSign"][0].mimetype,
    }
  : null;

const plantSign = req.files["plantSign"]?.[0]
  ? {
      data: req.files["plantSign"][0].buffer,
      contentType: req.files["plantSign"][0].mimetype,
    }
  : null;


    const irId = generateIRId(); // ✅ Generate a unique 4-digit IR ID

    const newReport = new ImprovementReport({
      irId, // 👈 Add the new IR ID field
      number,
      department,
      equipment_no,
      equipment_system,
      location,
      objectives,
      concept_date,
      implementation_date,
      present_condition,
      modification,
      resources,
      mandays,
      cost,
      payback,
      end_result,
      additional_info,
      hod_sign: hodSign,
      plant_incharge_sign: plantSign,
      user: req.user._id // Add user reference
    });

    await newReport.save();

    res.status(201).json({
      message: "Improvement Report submitted successfully!",
      irId: newReport.irId // 👈 Return irId in response
    });

  } catch (err) {
    next(err);
  }
};

// Function to fetch all Improvement Reports with pagination
// Get all Improvement Reports (admin: all, user: own)
exports.getAllImprovementReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (!adminEmails.includes(req.user.email)) {
      query.user = req.user._id;
    }

    const reports = await ImprovementReport.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ImprovementReport.countDocuments(query);

    res.json({
      reports,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReports: total,
    });
  } catch (err) {
    next(err);
  }
};

// Get one Improvement Report by Mongo _id (admin: any, user: own)
exports.getImprovementReportByMongoId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ErrorHandler(400, "Improvement Report ID is required");
    }

    const report = await ImprovementReport.findById(id).lean();
    if (!report) {
      throw new ErrorHandler(404, "Improvement Report not found");
    }

    // Admin can view any report; user only their own
    if (
      !adminEmails.includes(req.user.email) &&
      !isOwner(report.user, req.user._id)
    ) {
      throw new ErrorHandler(401, "Not authorized to view this Improvement Report");
    }

    // Convert Buffer data to base64 for images
    if (report.hod_sign && report.hod_sign.data) {
      report.hod_sign = {
        data: report.hod_sign.data.toString('base64'),
        contentType: report.hod_sign.contentType
      };
    }

    if (report.plant_incharge_sign && report.plant_incharge_sign.data) {
      report.plant_incharge_sign = {
        data: report.plant_incharge_sign.data.toString('base64'),
        contentType: report.plant_incharge_sign.contentType
      };
    }

    res.json(report);
  } catch (err) {
    next(err);
  }
};

//maintenance report
exports.submitMaintenanceReport = async (req, res, next) => {
  try {
    const {
      unit,
      outageDate,
      outageTime,
      defectReported,
      investigationOutcome,
      correctiveAction,
      followUp,
      repairCost,
      remarks,
      generationLoss
    } = req.body;

    // Validate required fields
    if (!unit || !outageDate || !outageTime || !defectReported || 
        !investigationOutcome || !correctiveAction || !followUp || 
        !repairCost || !remarks || !generationLoss) {
      throw new ErrorHandler(400, "Missing required fields");
    }

    // Check if both signatures are provided
    if (!req.files["hodSignature"] || !req.files["plantInchargeSignature"]) {
      throw new ErrorHandler(400, "Both HOD and Plant Incharge signatures are required");
    }
// Retrieve image buffers and content types for signatures
const hodSignature = req.files["hodSignature"]?.[0]
  ? {
      data: req.files["hodSignature"][0].buffer,
      contentType: req.files["hodSignature"][0].mimetype,
    }
  : null;

const plantInchargeSignature = req.files["plantInchargeSignature"]?.[0]
  ? {
      data: req.files["plantInchargeSignature"][0].buffer,
      contentType: req.files["plantInchargeSignature"][0].mimetype,
    }
  : null;

    // Generate a unique 4-digit mrId
    const mrId = generateMRId();

    // Create new maintenance report
    const newReport = new MaintenanceReport({
      mrId,
      unit,
      outageDate,
      outageTime,
      defectReported,
      investigationOutcome,
      correctiveAction,
      followUp,
      repairCost,
      remarks,
      generationLoss,
      hodSignature: hodSignature,
      plantInchargeSignature: plantInchargeSignature,
      user: req.user._id // Add user reference
    });

    // Save the new report to the database
    await newReport.save();
    res.status(201).json({ 
      message: "Maintenance report submitted successfully!",
      mrId: newReport.mrId,
      unit: newReport.unit,
      outageDate: newReport.outageDate,
      createdAt: newReport.createdAt
    });
  } catch (err) {
    next(err);
  }
};

// Get all Maintenance Reports (admin: all, user: own)
exports.getAllMaintenanceReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (!adminEmails.includes(req.user.email)) {
      query.user = req.user._id;
    }

    const reports = await MaintenanceReport.find(query)
      .select('-hodSignature -plantInchargeSignature')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MaintenanceReport.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReports: total
      }
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to convert buffer to base64
const bufferToBase64 = (buffer) => {
  if (!buffer || !buffer.data) return null;
  return `data:image/jpeg;base64,${Buffer.from(buffer.data).toString('base64')}`;
};

// Get one Maintenance Report by Mongo _id (admin: any, user: own)
exports.getMaintenanceReportByMongoId = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Fetching maintenance report with ID:", id);
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ID provided:", id);
      throw new ErrorHandler(400, "Invalid maintenance report ID");
    }

    const report = await MaintenanceReport.findById(id);
    console.log("Found report:", report ? "Yes" : "No");

    if (!report) {
      console.error("Report not found for ID:", id);
      throw new ErrorHandler(404, "Maintenance report not found");
    }

    // Admin can view any report; user only their own
    if (
      !adminEmails.includes(req.user.email) &&
      !isOwner(report.user, req.user._id)
    ) {
      console.error("Unauthorized access attempt for report:", id);
      throw new ErrorHandler(401, "Not authorized to view this maintenance report");
    }

    // Convert the Mongoose document to a plain object
    const reportData = report.toObject();
    console.log("Report data converted to object");

    // Keep image data in Buffer format
    if (reportData.hodSignature) {
      reportData.hodSignature = {
        data: reportData.hodSignature.data,
        contentType: reportData.hodSignature.contentType
      };
    }

    if (reportData.plantInchargeSignature) {
      reportData.plantInchargeSignature = {
        data: reportData.plantInchargeSignature.data,
        contentType: reportData.plantInchargeSignature.contentType
      };
    }

    // Format dates safely
    if (reportData.outageDate) {
      const d = new Date(reportData.outageDate);
      reportData.outageDate = isNaN(d) ? reportData.outageDate : d.toLocaleDateString();
    }
    if (reportData.createdAt) {
      const d = new Date(reportData.createdAt);
      reportData.createdAt = isNaN(d) ? reportData.createdAt : d.toLocaleDateString();
    }

    console.log("Sending response with report data");
    res.json({
      success: true,
      data: reportData
    });
  } catch (err) {
    console.error("Error in getMaintenanceReportByMongoId:", err);
    next(err);
  }
};