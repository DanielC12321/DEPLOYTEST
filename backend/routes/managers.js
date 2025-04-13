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

router.get('/z-report-sales-tax', async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing start_date or end_date' });
  }

  try {
    const data = await Database.executeQuery('z-report-sales-tax', [start_date, end_date]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/z-report-payment-methods', async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing start_date or end_date' });
  }

  try {
    const data = await Database.executeQuery('z-report-payment-methods', [start_date, end_date]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/z-report-adjustments', async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing start_date or end_date' });
  }

  try {
    const data = await Database.executeQuery('z-report-adjustments', [start_date, end_date]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

router.get('/z-report-manager-names', async (req, res) => {
  try {
    const data = await Database.executeQuery('z-report-manager-names');
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
//Use postman For link: http://localhost:8001/users/add_product 
/* For body {
  "name": "Product Name",
  "cost": 19.99
}
*/
//TODO: need to link ingredients to product
router.post('/add_product', async (req, res) => {
  // Logic to add a product
  try {
    const {name, cost, category, imgurl} = req.body;
      if(!name || !cost || !category || !imgurl){
          return res.status(400).send('Name, cost, categroy, and image are required!');
      }
      const result = await Database.executeQuery('add-product', [name, cost, category, imgurl]);
      res.status(201).json(result);
  }
  catch(err){
      res.status(500).send('Error adding product!');
  }
});


//http://localhost:8001/ingredient_information?ingredientname=milk
router.get('/ingredient_information', async (req, res) => {
  const { ingredientname } = req.query;

  if (!ingredientname) {
    return res.status(400).json({ error: 'Missing ingredient name' });
  }
  try{
    const data = await Database.executeQuery('get-ingredient-information', [ingredientname]);
    res.json(data);
  }
  catch(err){
    res.status(500).json({ error: 'ingredient information query failed' });
  }

});

router.put('/update_ingredient', async (req, res) => {
  const { name, value, field} = req.body;

  if (!name|| !value || !field) {
    return res.status(400).json({ error: 'Missing ingredient details' });
  }

  try {
    const data = await Database.executeCustomQuery(`UPDATE ingredients SET ${field} = $2 WHERE LOWER(name) = LOWER($1);`, [name, value]);
    res.json("Update Successful");
  } catch (err) {
    res.status(500).json({ error: 'Update ingredient query failed' });
  }
});

router.post('/add_ingredient', async (req, res) => {
  const { name, cost, quantity } = req.body;

  if (!name || !cost || !quantity) {
    return res.status(400).json({ error: 'Missing ingredient details' });
  }

  try {
    const data = await Database.executeQuery('add-ingredient', [name, cost, quantity]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Add ingredient query failed' });
  }
});

router.delete('/delete_ingredient', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing ingredient name' });
  }

  try {
    const data = await Database.executeCustomQuery('DELETE FROM ingredients WHERE LOWER(name) = LOWER($1);', [name]);
    res.json("Ingredient Deleted");
  } catch (err) {
    res.status(500).json({ error: 'Delete ingredient query failed' });
  }
});
module.exports = router;