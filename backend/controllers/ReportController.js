const FSR = require("../models/FSRModel"); // Your mongoose model

exports.submitFSR = async (req, res) => {
  try {
    const {
      srNo,
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

    const customerSignature = req.files["customerSignature"]?.[0]?.buffer;
    const engineerSignature = req.files["engineerSignature"]?.[0]?.buffer;
    const workPhotos = req.files["workPhotos"]?.map(file => file.buffer) || [];

    const newReport = new FSR({
      ticketId,
      srNo,
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

    await newReport.save();
    res.status(201).json({ message: "FSR submitted successfully!" });
  } catch (err) {
    console.error("Error in submitFSR:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.getAllFSRs = async (req, res) => {
  try {
    const reports = await FSR.find().sort({ createdAt: -1 }); // optional sorting
    res.json(reports);
  } catch (err) {
    console.error("Error fetching FSRs:", err);
    res.status(500).json({ message: "Failed to fetch FSRs" });
  }
};

