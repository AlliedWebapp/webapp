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

module.exports = router;
