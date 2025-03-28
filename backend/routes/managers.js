const express = require('express');
const Database = require('./Database');

const router = express.Router();

// Route: Get product usage between two dates
router.get('/product-usage-chart', async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing start_date or end_date' });
  }

  try {
    const data = await Database.executeQuery('product-usage-chart', [start_date, end_date]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/debug-tables', async (req, res) => {
  try {
    const data = await Database.executeQuery('debug-tables');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/debug-connection', async (req, res) => {
  try {
    const data = await Database.executeQuery('debug-connection');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Additional routes can be added here...

module.exports = router;