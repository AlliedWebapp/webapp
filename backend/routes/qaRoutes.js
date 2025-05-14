const express = require('express');
const router = express.Router();
const QA = require('../models/Qa');
const { protect, blockInventoryOnly } = require('../middleware/authMiddleware');

router.use(protect, blockInventoryOnly);

// POST /api/qa → create new Q&A
router.post('/', async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required.' });
    }

    const qa = await QA.create({ question, answer });
    res.status(201).json(qa);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create QA', details: err.message });
  }
});

// GET /api/qa → list all Q&As
router.get('/', async (req, res) => {
  try {
    const qas = await QA.find().sort({ createdAt: -1 });
    res.json(qas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch QA list', details: err.message });
  }
});

// Adds an answer to a question

router.post('/:id/answers', async (req, res) => {
    try {
      const { text, answeredBy } = req.body;
      const qa = await QA.findById(req.params.id);
  
      if (!qa) return res.status(404).json({ error: 'Question not found' });
  
      qa.answers.push({ text, answeredBy });
      await qa.save();
  
      res.status(201).json(qa);
    } catch (err) {
      res.status(500).json({ error: 'Failed to add answer', details: err.message });
    }
  });
  

module.exports = router;
