const FSR = require("../models/FSRModel"); // Your mongoose model
const { ErrorHandler } = require("../middleware/errorMiddleware");

// Function to generate a 4-digit unique fsr_id
function generateFSRId() {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number between 1000 and 9999
}

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
