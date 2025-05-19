const express = require('express');
const router = express.Router();
const multer = require('multer');
const Formats = require('../models/FormatsModel');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { protect, blockInventoryOnly } = require('../middleware/authMiddleware');

router.use(protect, blockInventoryOnly);


router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const newFormat = new Formats({
      title: req.body.title,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });
    await newFormat.save();
    res.status(201).json({ message: 'PDF uploaded successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const format = await Formats.findById(req.params.id);
    if (!format) return res.status(404).json({ error: 'PDF not found' });
    res.contentType(format.file.contentType);
    res.send(format.file.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const formats = await Formats.find({}, 'title uploadedAt');
    res.json(formats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
