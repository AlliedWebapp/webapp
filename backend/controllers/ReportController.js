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
    } = req.body;

    // Validate required fields
    if (!customerName || !installationAddress || !siteId || !engineerName) {
      console.error("Missing required fields:", { customerName, installationAddress, siteId, engineerName });
      throw new ErrorHandler(400, "Missing required fields");
    }

    // Retrieve image buffers for signatures and work photos
    const customerSignature = req.files["customerSignature"]?.[0]?.buffer;
    const engineerSignature = req.files["engineerSignature"]?.[0]?.buffer;
    const workPhotos = req.files["workPhotos"]?.map(file => file.buffer) || [];

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
      workPhotos,
      user: req.user._id
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

exports.getAllFSRs = async (req, res, next) => {
  try {
    console.log("Getting FSRs for user:", req.user._id);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch reports with pagination and user filter
    const reports = await FSR.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("Found reports:", reports);

    // Get total count for pagination
    const total = await FSR.countDocuments({ user: req.user._id });
    console.log("Total reports:", total);

    res.json({
      reports,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReports: total
    });
  } catch (err) {
    console.error("Error in getAllFSRs:", err);
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

    const report = await FSR.findOne({
      _id: id,
      $or: [
        { user: req.user._id },
        { user: { $exists: false } }
      ]
    });
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
      hod_sign: {
        data: hodSign,
        contentType: req.files["hodSign"]?.[0]?.mimetype
      },
      plant_incharge_sign: {
        data: plantSign,
        contentType: req.files["plantSign"]?.[0]?.mimetype
      },
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
exports.getAllImprovementReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch improvement reports with pagination and user filter
    const reports = await ImprovementReport.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await ImprovementReport.countDocuments({ user: req.user._id });

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

//to fetch one improvement report by id 
exports.getImprovementReportByMongoId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ErrorHandler(400, "Improvement Report ID is required");
    }

    const report = await ImprovementReport.findOne({
      _id: id,
      $or: [
        { user: req.user._id },
        { user: { $exists: false } }
      ]
    });
    if (!report) {
      throw new ErrorHandler(404, "Improvement Report not found");
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

    // Retrieve image buffers for signatures
    const hodSignature = req.files["hodSignature"]?.[0];
    const plantInchargeSignature = req.files["plantInchargeSignature"]?.[0];

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
      hodSignature: {
        data: hodSignature.buffer,
        contentType: hodSignature.mimetype
      },
      plantInchargeSignature: {
        data: plantInchargeSignature.buffer,
        contentType: plantInchargeSignature.mimetype
      },
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

exports.getAllMaintenanceReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch reports with pagination and user filter
    const reports = await MaintenanceReport.find({ user: req.user._id })
      .select('-hodSignature -plantInchargeSignature')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await MaintenanceReport.countDocuments({ user: req.user._id });

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

exports.getMaintenanceReportByMongoId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorHandler(400, "Invalid maintenance report ID");
    }

    const report = await MaintenanceReport.findOne({
      _id: id,
      $or: [
        { user: req.user._id },
        { user: { $exists: false } }
      ]
    }).lean();
    if (!report) {
      throw new ErrorHandler(404, "Maintenance report not found");
    }

    // Convert signature buffers to base64 strings
    if (report.hodSignature && report.hodSignature.data) {
      const base64String = Buffer.from(report.hodSignature.data).toString('base64');
      report.hodSignature = {
        data: `data:${report.hodSignature.contentType || 'image/jpeg'};base64,${base64String}`,
        contentType: report.hodSignature.contentType || 'image/jpeg'
      };
    }
    if (report.plantInchargeSignature && report.plantInchargeSignature.data) {
      const base64String = Buffer.from(report.plantInchargeSignature.data).toString('base64');
      report.plantInchargeSignature = {
        data: `data:${report.plantInchargeSignature.contentType || 'image/jpeg'};base64,${base64String}`,
        contentType: report.plantInchargeSignature.contentType || 'image/jpeg'
      };
    }

    // Format dates
    report.outageDate = new Date(report.outageDate).toLocaleDateString();
    report.createdAt = new Date(report.createdAt).toLocaleDateString();

    res.json({
      success: true,
      data: report
    });
  } catch (err) {
    next(err);
  }
};

