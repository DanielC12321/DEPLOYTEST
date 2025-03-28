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
