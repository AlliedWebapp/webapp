const express = require("express");
const router = express.Router();
const Consumable = require("../models/ConsumableModel");
const { protect } = require("../middleware/authMiddleware");

router.use(protect); // ✅ Only protect, nothing else

router.post("/", async (req, res) => {
  try {
    const userEmail = req.user?.email;
    if (!userEmail) return res.status(401).json({ error: "Unauthorized" });

    const newConsumable = new Consumable({
      ...req.body,
      createdBy: userEmail
    });

    await newConsumable.save();
    res.status(201).json(newConsumable);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const allConsumables = await Consumable.find().sort({ sr_no: 1 });
    res.json(allConsumables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Consumable.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    // Get all remaining consumables sorted by sr_no
    const remainingConsumables = await Consumable.find().sort({ sr_no: 1 });
    
    // Update sr_no for all remaining records
    for (let i = 0; i < remainingConsumables.length; i++) {
      await Consumable.findByIdAndUpdate(
        remainingConsumables[i]._id,
        { sr_no: i + 1 }
      );
    }

    res.json({ message: "Consumable deleted and serial numbers updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updated = await Consumable.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;
