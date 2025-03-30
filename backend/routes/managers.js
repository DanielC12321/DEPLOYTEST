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
//cashier info http://localhost:8001/employee_names
router.get('/employee_names', async (req, res) => {
  try {
    const data = await Database.executeQuery('employee-names');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Employee Database query failed' });
  }
});


// Use postman For link: http://localhost:8001/fire_employee
// For body { "name": "Employee Name" }
//TODO: cashiers are linked to orders, so we need to delete the orders first before deleting the cashier
router.delete('/fire_employee', async (req, res) => {
  const { name } = req.body;
  console.log('Request body:', req.body);
  if (!name) {
    return res.status(400).json({ error: 'Missing employee name' });
  }

  try {
    const data = await Database.executeQuery('get-employee-id', [name]);
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    const cashierId = parseInt(data[0].cashierid);
    const deleteResult = await Database.executeQuery('fire-employee', [cashierId]);
    
    // Return success message with the deleted employee info
    /*res.json({ 
      message: `Employee ${name} with ID ${cashierId} has been removed`,
      deletedEmployee: { name, id: cashierId }
    });*/
    res.json(cashierId);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});
// Use postman For link: http://localhost:8001/hire_employee
// For body {
//   "name": "Employee Name",
//   "address": "Employee Address",
//   "email": "Employee Email",
//   "phone": "Employee Phone",
//   "password": "Employee Password"
// }
router.post('/hire_employee', async (req, res) => {
  const { name, address, email, phone, password } = req.body;
  if (!name || !address || !email || !phone || !password) {
    return res.status(400).json({ error: 'Missing employee details' });
  }

  try {
    const data = await Database.executeQuery('add-employee', [name, address, email, phone, password]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'hire failed' });
  }
});
//http://localhost:8001/cashier_performances
router.get('/cashier_performances', async (req, res) => {
  try {
    const data = await Database.executeQuery('cashier-performances');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'cashier performance query failed' });
  }
});
//http://localhost:8001/employee_credentials?id=1&isManager=true
router.get('/employee_credentials', async (req, res) => {
  const{id, isManager} = req.query;
  if (!id || !isManager) {
    return res.status(400).json({ error: 'Missing id or isManager' });
  } 

  try {
    if(isManager==="true"){
      const data = await Database.executeQuery('get-manager-creds', [id]);
      res.json(data);
    }else{
      const data = await Database.executeQuery('get-cashier-creds', [id]);
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});


module.exports = router;