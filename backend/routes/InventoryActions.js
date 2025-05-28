const express = require("express");
const Jogini = require("../models/JoginiModel");
const Shong = require("../models/ShongModel");
const Solding = require("../models/soldingModel");
const SDLLPsalun = require("../models/SDLLPsalunModel");
const Kuwarsi = require("../models/KuwarsiModel");
const router = express.Router();

const adminEmails = ["bhaskarudit02@gmail.com", "ss@gmail.com"];



// ─── Jogini CRUD ─────────────────────────────────────────────────────────────
// POST /api/inventory/jogini
router.post("/jogini", async (req, res) => {
  try {
    const jogini = new Jogini(req.body);
    await jogini.save();
    res.status(201).json(jogini);
  } catch (err) {
    console.error("Error creating Jogini:", err);
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/inventory/jogini/:id
router.patch("/jogini/:id", async (req, res) => {
  const updates = Object.keys(req.body);
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
  ];

  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for Jogini" });
  }

  try {
    const updated = await Jogini.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },            // ← let Mongo apply dot-notation
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
});

// //GET
// router.get('/jogini', async (req, res) => {
//   try {
//     const items = await Jogini.find();
//     res.json(items);
//   } catch (err) {
//     console.error('Error fetching Jogini list:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// ─── Shong CRUD ──────────────────────────────────────────────────────────────
// POST /api/inventory/shong
router.post("/shong", async (req, res) => {
  try {
    const shong = new Shong(req.body);
    await shong.save();
    res.status(201).json(shong);
  } catch (err) {
    console.error("Error creating Shong:", err);
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/inventory/shong/:id
router.patch("/shong/:id", async (req, res) => {
  const updates = Object.keys(req.body);
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
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for Shong" });
  }

   try {
    const updated = await Shong.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Shong not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// //GET
// router.get('/shong', async (req, res) => {
//   try {
//     const items = await Shong.find();
//     res.json(items);
//   } catch (err) {
//     console.error('Error fetching Shong list:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// ─── Solding CRUD ────────────────────────────────────────────────────────────
// POST /api/inventory/solding
router.post("/solding", async (req, res) => {
  try {
    const soldingItem = new Solding(req.body);
    await soldingItem.save();
    res.status(201).json(soldingItem);
  } catch (err) {
    console.error("Error creating Solding:", err);
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/inventory/solding/:id
router.patch("/solding/:id", async (req, res) => {
  const updates = Object.keys(req.body);
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
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for Solding" });
  }

   try {
    const updated = await Solding.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Solding not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});
// //GET
// router.get('/solding', async (req, res) => {
//   try {
//     const items = await Solding.find();
//     res.json(items);
//   } catch (err) {
//     console.error('Error fetching Solding list:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// ─── SDLLPsalun CRUD ─────────────────────────────────────────────────────────
// POST /api/inventory/sdllpsalun
router.post("/sdllpsalun", async (req, res) => {
  try {
    const item = new SDLLPsalun(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating SDLLPsalun:", err);
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/inventory/sdllpsalun/:id
router.patch("/sdllpsalun/:id", async (req, res) => {
  const updates = Object.keys(req.body);
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
    "Types",
    "spareCount",
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for SDLLPsalun" });
  }

  try {
    const updated = await SDLLPsalun.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "SDLLPsalun not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});
// //GET
// router.get('/sdllpsalun', async (req, res) => {
//   try {
//     const items = await SDLLPsalun.find();
//     res.json(items);
//   } catch (err) {
//     console.error('Error fetching SDLLPsalun list:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// ─── Kuwarsi CRUD ────────────────────────────────────────────────────────────
// POST /api/inventory/kuwarsi
router.post("/kuwarsi", async (req, res) => {
  try {
    const item = new Kuwarsi(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating Kuwarsi:", err);
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/inventory/kuwarsi/:id
router.patch("/kuwarsi/:id", async (req, res) => {
  const updates = Object.keys(req.body);
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
    "REMARKS",
    "spareCount",
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for Kuwarsi" });
  }

  try {
    const updated = await Kuwarsi.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Kuwarsi not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});
// //GET
// router.get('/kuwarsi', async (req, res) => {
//   try {
//     const items = await Kuwarsi.find();
//     res.json(items);
//   } catch (err) {
//     console.error('Error fetching Kuwarsi list:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;