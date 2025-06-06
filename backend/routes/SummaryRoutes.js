const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticketModel');
const FSR = require('../models/FSRModel');
const Consumable = require('../models/ConsumableModel');

const { protect, blockInventoryOnly} = require('../middleware/authMiddleware');

router.use(protect);

const adminEmails = ["bhaskarudit02@gmail.com", "ss@gmail.com"];

const projectEmailMap = {
  Jogini: "jogini@alliedwebapp",
  Shong: "shong@alliedwebapp",
  Solding: "solding@alliedwebapp",
  SDLLPsalun: "sdllp@alliedwebapp",
  Kuwarsi: "kuwarsi@alliedwebapp",
};

router.get('/monthly-summary', blockInventoryOnly, async (req, res) => {
  const year = parseInt(req.query.year);
  const month = parseInt(req.query.month);
  const project = req.query.project;
  const userEmail = req.user && req.user.email;
  if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });
  if (!year || !month) return res.status(400).json({ error: 'Year and month required' });

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  let ticketFilter = { createdAt: { $gte: start, $lt: end } };
  let fsrFilter = { createdAt: { $gte: start, $lt: end } };
  let consumableFilter = { date: { $gte: start, $lt: end } };

  const isAdmin = adminEmails.includes(userEmail);

  if (isAdmin) {
    if (project && projectEmailMap[project]) {
      ticketFilter.createdBy = projectEmailMap[project];
      fsrFilter.createdBy = projectEmailMap[project];
      consumableFilter.createdBy = projectEmailMap[project];
    }
  } else {
    ticketFilter.createdBy = userEmail;
    fsrFilter.createdBy = userEmail;
    consumableFilter.createdBy = userEmail;
  }

  try {
    const [openTicketsCount, closedTicketsCount, fsrCreatedCount, consumablesCount, tickets, fsrs, consumables] = await Promise.all([
      Ticket.countDocuments({ ...ticketFilter, status: 'new' }),
      Ticket.countDocuments({ ...ticketFilter, status: 'close' }),
      FSR.countDocuments(fsrFilter),
      Consumable.countDocuments(consumableFilter),
      Ticket.find(ticketFilter),
      FSR.find(fsrFilter),
      Consumable.find(consumableFilter)
    ]);
    
    res.json({ 
      openTicketsCount, 
      closedTicketsCount, 
      fsrCreatedCount, 
      consumablesCount,
      tickets, 
      fsrs,
      consumables 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
