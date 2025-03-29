var express = require('express');
var router = express.Router();
const Database = require('./Database');
/* GET users listing. */

//Product Table http://localhost:8001/users/product_table
router.get('/product_table', async (req, res) => {
    try {
      const result = await Database.executeQuery('product-table');
      res.json(result);
    }
    catch (err) {
      res.status(500).json({ error: 'Product_Table query failed' });
    }
}
  
);
//Use postman For link: http://localhost:8001/users/add_product 
/* For body {
  "name": "Product Name",
  "cost": 19.99
}
*/
router.post('/add_product', async (req, res) => {
  // Logic to add a product
  try {
      const {name, cost} = req.body;
      if(!name || !cost){
          return res.status(400).send('Name and cost are required!');
      }
      const result = await Database.executeQuery('add-product', [name, cost]);
      res.status(201).json(result);
  }
  catch(err){
      res.status(500).send('Error adding product!');
  }
});

//Product Table http://localhost:8001/users/ingredient_table
router.get('/ingredient_table', async (req, res) => {
  try {
    const result = await Database.executeQuery('ingredient-table');
    res.json(result);
  }
  catch (err) {
    res.status(500).json({ error: 'ingredient_table query failed' });
  }
}

);


module.exports = router;
