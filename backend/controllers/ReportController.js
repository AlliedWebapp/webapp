const FSR = require("../models/FSRModel"); // Your mongoose model
const { ErrorHandler } = require("../middleware/errorMiddleware");
const ImprovementReport = require("../models/ImprovementReportModel"); // Import your model
const MaintenanceReport = require("../models/MaintenanceReportModel");
const mongoose = require("mongoose");

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
    const {
      customerName,
      installationAddress,
      siteId,
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
      engineerName,
      customerContact,
      customerEmail,
      ticketId
    } = req.body;

    // Validate required fields
    if (!customerName || !installationAddress || !siteId || !engineerName) {
      throw new ErrorHandler(400, "Missing required fields");
    }

    // Retrieve image buffers for signatures and work photos
    const customerSignature = req.files["customerSignature"]?.[0]?.buffer;
    const engineerSignature = req.files["engineerSignature"]?.[0]?.buffer;
    const workPhotos = req.files["workPhotos"]?.map(file => file.buffer) || [];

    // Generate a 4-digit fsr_id for each report
    const fsrId = generateFSRId();

    // Create new FSR report with generated fsr_id
    const newReport = new FSR({
      fsrId,  // Add the unique 4-digit fsr_id
      ticketId,
      customerName,
      installationAddress,
      siteId,
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
      engineerName,
      customerContact,
      customerEmail,
      customerSignature,
      engineerSignature,
      workPhotos
    });

    // Save the new report to the database
    await newReport.save();
    res.status(201).json({ 
      message: "FSR submitted successfully!",
      fsrId: newReport.fsrId
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllFSRs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch reports with pagination
    const reports = await FSR.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await FSR.countDocuments();

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
exports.getFSRByMongoId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new ErrorHandler(400, "FSR ID is required");
    }

    const report = await FSR.findById(id);
    if (!report) {
      throw new ErrorHandler(404, "FSR not found");
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

    // Image buffers for signatures
    const hodSign = req.files["hodSign"]?.[0]?.buffer;
    const plantSign = req.files["plantSign"]?.[0]?.buffer;

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
      hodSignature: {
        data: hodSign,
        contentType: req.files["hodSign"]?.[0]?.mimetype
      },
      plantInchargeSignature: {
        data: plantSign,
        contentType: req.files["plantSign"]?.[0]?.mimetype
      }
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

exports.getAllImprovementReports = async (req, res, next) => {
  try {
    const reports = await ImprovementReport.find().sort({ createdAt: -1 });
    res.status(200).json({ reports });
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
      generationLoss,
    } = req.body;

    if (!unit || !outageDate || !outageTime || !defectReported) {
      throw new ErrorHandler(400, "Missing required fields");
    }

    const hodSignature = req.files["hodSignature"]?.[0];
    const plantInchargeSignature = req.files["plantInchargeSignature"]?.[0];

    const mrId = generateMRId();

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
      hodSignature: {
        data: hodSignature?.buffer,
        contentType: hodSignature?.mimetype
      },
      plantInchargeSignature: {
        data: plantInchargeSignature?.buffer,
        contentType: plantInchargeSignature?.mimetype
      }
    });

    await newReport.save();

    res.status(201).json({
      message: "Maintenance Report submitted successfully!",
      mrId: newReport.mrId
    });

  } catch (err) {
    next(err);
  }
};