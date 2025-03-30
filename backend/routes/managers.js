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

router.get('/sales-report', async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing start_date or end_date' });
  }

  try {
    const data = await Database.executeQuery('sales-report', [start_date, end_date]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/x-report-sales', async (req, res) => {
  const { current_day, current_hour } = req.query;

  if (!current_day || !current_hour) {
    return res.status(400).json({ error: 'Missing current_day or current_hour' });
  }

  try {
    const data = await Database.executeQuery('x-report-sales', [current_day, current_hour]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/x-report-adjustments', async (req, res) => {
  const { current_day, current_hour } = req.query;

  if (!current_day || !current_hour) {
    return res.status(400).json({ error: 'Missing current_day or current_hour' });
  }

  try {
    const data = await Database.executeQuery('x-report-adjustments', [current_day, current_hour]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/x-report-payment-methods', async (req, res) => {
  const { current_day, current_hour } = req.query;

  if (!current_day || !current_hour) {
    return res.status(400).json({ error: 'Missing current_day or current_hour' });
  }

  try {
    const data = await Database.executeQuery('x-report-payment-methods', [current_day, current_hour]);
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