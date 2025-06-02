const express = require("express");
const multer = require("multer");
const Jogini = require("../models/JoginiModel");
const Shong = require("../models/ShongModel");
const Solding = require("../models/soldingModel");
const SDLLPsalun = require("../models/SDLLPsalunModel");
const Kuwarsi = require("../models/KuwarsiModel");
const router = express.Router();

// ── Multer (memory storage) ────────────────────────────────────────────────────
// We use memoryStorage so that multer puts the file data into req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ── Jogini CRUD ────────────────────────────────────────────────────────────────
// POST /api/inventory/jogini
router.post(
  "/jogini",
  upload.single("picture"),
  async (req, res) => {
    try {
      const data = { ...req.body };

      // If a file was uploaded under the "picture" field, store its buffer + MIME type
      if (req.file) {
        data.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const jogini = new Jogini(data);
      await jogini.save();
      res.status(201).json(jogini);
    } catch (err) {
      console.error("Error creating Jogini:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

// PATCH /api/inventory/jogini/:id
router.patch(
  "/jogini/:id",
  upload.single("picture"),
  async (req, res) => {
    // Allowed fields + "picture"
    const allowed = [
      "S.No",
      "Spare Discription",
      "Make.Vendor",
      "Month",
      "OPENING STOCK ( NOS )",
      "RECEIVED QTY ( NOS )",
      "Monthly Consumption ( NOS )",
      "CLOSING STOCK ( NOS )",
      "MSL (Maximum Stock Level - To be required always at site as per urgency) ( QTY )",
      "SIGN",
      "FIELD11",
      "spareCount",
      "picture", // allow updating the picture field
    ];

    const updates = Object.keys(req.body);
    const isValid = updates.every((u) => allowed.includes(u));
    if (!isValid && !req.file) {
      // If no new file and none of the body keys are allowed, reject
      return res.status(400).json({ error: "Invalid update fields for Jogini" });
    }

    try {
      const toUpdate = { ...req.body };

      // If a new picture was uploaded, overwrite picture.data + picture.contentType
      if (req.file) {
        toUpdate.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const updated = await Jogini.findByIdAndUpdate(
        req.params.id,
        { $set: toUpdate },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Jogini not found" });
      }
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Shong CRUD ─────────────────────────────────────────────────────────────────
// POST /api/inventory/shong
router.post(
  "/shong",
  upload.single("picture"),
  async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }
      const shong = new Shong(data);
      await shong.save();
      res.status(201).json(shong);
    } catch (err) {
      console.error("Error creating Shong:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

// PATCH /api/inventory/shong/:id
router.patch(
  "/shong/:id",
  upload.single("picture"),
  async (req, res) => {
    const allowed = [
      "S.No.",
      "Description of Material",
      "Make",
      "Vendor",
      "Code.Specification",
      "Place",
      "Rate",
      "Qty",
      "In Stock",
      "Remarks",
      "Types",
      "spareCount",
      "picture",
    ];
    const updates = Object.keys(req.body);
    const isValid = updates.every((u) => allowed.includes(u));
    if (!isValid && !req.file) {
      return res.status(400).json({ error: "Invalid update fields for Shong" });
    }

    try {
      const toUpdate = { ...req.body };
      if (req.file) {
        toUpdate.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const updated = await Shong.findByIdAndUpdate(
        req.params.id,
        { $set: toUpdate },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: "Shong not found" });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Solding CRUD ───────────────────────────────────────────────────────────────
// POST /api/inventory/solding
router.post(
  "/solding",
  upload.single("picture"),
  async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }
      const soldingItem = new Solding(data);
      await soldingItem.save();
      res.status(201).json(soldingItem);
    } catch (err) {
      console.error("Error creating Solding:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

// PATCH /api/inventory/solding/:id
router.patch(
  "/solding/:id",
  upload.single("picture"),
  async (req, res) => {
    const allowed = [
      "S.No.",
      "Description of Material",
      "Make",
      "Vendor",
      "Code.Specification",
      "Place",
      "Rate",
      "Qty",
      "In Stock",
      "Remarks",
      "TYPES",
      "spareCount",
      "picture",
    ];
    const updates = Object.keys(req.body);
    const isValid = updates.every((u) => allowed.includes(u));
    if (!isValid && !req.file) {
      return res.status(400).json({ error: "Invalid update fields for Solding" });
    }

    try {
      const toUpdate = { ...req.body };
      if (req.file) {
        toUpdate.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const updated = await Solding.findByIdAndUpdate(
        req.params.id,
        { $set: toUpdate },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: "Solding not found" });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
);

// ── SDLLPsalun CRUD ────────────────────────────────────────────────────────────
// POST /api/inventory/sdllpsalun
router.post(
  "/sdllpsalun",
  upload.single("picture"),
  async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }
      const item = new SDLLPsalun(data);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      console.error("Error creating SDLLPsalun:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

// PATCH /api/inventory/sdllpsalun/:id
router.patch(
  "/sdllpsalun/:id",
  upload.single("picture"),
  async (req, res) => {
    const allowed = [
      "SR. NO.",
      "NAME OF MATERIALS",
      "OPENING BALANCE",
      "RECEIVED DURING THE MONTH",
      "TOTAL",
      "ISSUE DURING THE MONTH",
      "ISSUE DURING THE YEAR (from 1st Jan 2025)",
      "CLOSING BALANCE",
      "SPECIFICATION",
      "MAKE.MANUFACTURE",
      "vendor",
      "Types",
      "spareCount",
      "picture",
    ];
    const updates = Object.keys(req.body);
    const isValid = updates.every((u) => allowed.includes(u));
    if (!isValid && !req.file) {
      return res.status(400).json({ error: "Invalid update fields for SDLLPsalun" });
    }

    try {
      const toUpdate = { ...req.body };
      if (req.file) {
        toUpdate.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const updated = await SDLLPsalun.findByIdAndUpdate(
        req.params.id,
        { $set: toUpdate },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: "SDLLPsalun not found" });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
);

// ── Kuwarsi CRUD ────────────────────────────────────────────────────────────────
// POST /api/inventory/kuwarsi
router.post(
  "/kuwarsi",
  upload.single("picture"),
  async (req, res) => {
    try {
      const data = { ...req.body };
      if (req.file) {
        data.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }
      const item = new Kuwarsi(data);
      await item.save();
      res.status(201).json(item);
    } catch (err) {
      console.error("Error creating Kuwarsi:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

// PATCH /api/inventory/kuwarsi/:id
router.patch(
  "/kuwarsi/:id",
  upload.single("picture"),
  async (req, res) => {
    const allowed = [
      "SR. NO.",
      "NAME OF MATERIALS",
      "OPENING BALANCE",
      "RECEIVED DURING THE MONTH",
      "TOTAL",
      "ISSUE DURING THE MONTH",
      "ISSUE DURING THE YEAR ( from 1 jan 2025)",
      "CLOSING BALANCE",
      "SPECIFICATION",
      "MAKE.MANUFACTURE",
      "vendor",
      "REMARKS",
      "spareCount",
      "picture",
    ];
    const updates = Object.keys(req.body);
    const isValid = updates.every((u) => allowed.includes(u));
    if (!isValid && !req.file) {
      return res.status(400).json({ error: "Invalid update fields for Kuwarsi" });
    }

    try {
      const toUpdate = { ...req.body };
      if (req.file) {
        toUpdate.picture = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const updated = await Kuwarsi.findByIdAndUpdate(
        req.params.id,
        { $set: toUpdate },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: "Kuwarsi not found" });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;
