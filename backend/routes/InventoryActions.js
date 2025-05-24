const express = require("express");
const Jogini = require("../models/jogini");
const Shong = require("../models/shong");
const Solding = require("../models/solding");
const SDLLPsalun = require("../models/SDLLPsalun");
const Kuwarsi = require("../models/kuwarsi");
const router = express.Router();

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
    "sNo",
    "spareDescription",
    "make",
    "month",
    "openingStock",
    "receivedQty",
    "monthlyConsumption",
    "closingStock",
    "msl",
    "sign",
    "spareCount",
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for Jogini" });
  }

  try {
    const jogini = await Jogini.findById(req.params.id);
    if (!jogini) {
      return res.status(404).json({ error: "Jogini not found" });
    }
    updates.forEach((field) => {
      jogini[field] = req.body[field];
    });
    await jogini.save();
    res.json(jogini);
  } catch (err) {
    console.error("Error updating Jogini:", err);
    res.status(400).json({ error: err.message });
  }
});

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
    "sNo",
    "descriptionOfMaterial",
    "make",
    "vendor",
    "code",
    "place",
    "rate",
    "qty",
    "inStock",
    "remarks",
    "types",
    "spareCount",
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for Shong" });
  }

  try {
    const shong = await Shong.findById(req.params.id);
    if (!shong) {
      return res.status(404).json({ error: "Shong not found" });
    }
    updates.forEach((field) => {
      shong[field] = req.body[field];
    });
    await shong.save();
    res.json(shong);
  } catch (err) {
    console.error("Error updating Shong:", err);
    res.status(400).json({ error: err.message });
  }
});

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
    "sNo",
    "descriptionOfMaterial",
    "make",
    "vendor",
    "code",
    "place",
    "rate",
    "qty",
    "inStock",
    "remarks",
    "types",
    "spareCount",
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for Solding" });
  }

  try {
    const soldingItem = await Solding.findById(req.params.id);
    if (!soldingItem) {
      return res.status(404).json({ error: "Solding not found" });
    }
    updates.forEach((field) => {
      soldingItem[field] = req.body[field];
    });
    await soldingItem.save();
    res.json(soldingItem);
  } catch (err) {
    console.error("Error updating Solding:", err);
    res.status(400).json({ error: err.message });
  }
});

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
    "srNo",
    "nameOfMaterials",
    "openingBalance",
    "receivedDuringMonth",
    "total",
    "issueDuringMonth",
    "issueDuringYear",
    "closingBalance",
    "specification",
    "make",
    "types",
    "spareCount",
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for SDLLPsalun" });
  }

  try {
    const item = await SDLLPsalun.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "SDLLPsalun not found" });
    }
    updates.forEach((field) => {
      item[field] = req.body[field];
    });
    await item.save();
    res.json(item);
  } catch (err) {
    console.error("Error updating SDLLPsalun:", err);
    res.status(400).json({ error: err.message });
  }
});

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
    "srNo",
    "nameOfMaterials",
    "openingBalance",
    "receivedDuringMonth",
    "total",
    "issueDuringMonth",
    "issueDuringYear",
    "closingBalance",
    "specification",
    "make",
    "remarks",
    "spareCount",
  ];
  const isValid = updates.every((u) => allowed.includes(u));
  if (!isValid) {
    return res.status(400).json({ error: "Invalid update fields for Kuwarsi" });
  }

  try {
    const item = await Kuwarsi.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Kuwarsi not found" });
    }
    updates.forEach((field) => {
      item[field] = req.body[field];
    });
    await item.save();
    res.json(item);
  } catch (err) {
    console.error("Error updating Kuwarsi:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
