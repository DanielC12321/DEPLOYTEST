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
//http://localhost:8001/users/one_product?name=Milk Tea
router.get('/one_product', async (req, res) => {
  const{name} = req.query;
  if (!name) {
    return res.status(400).json({ error: 'Missing product name' });
  }
  try{
    const data = await Database.executeQuery('get-product-information', [name]);
    res.json(data);
  }
  catch(err){
    res.status(500).json({ error: 'Product information query failed' });
  }
});
//http://localhost:8001/users/update_product
/*
{
    "name":"TaroMilk Tea",
    "cost":8
}
    */
router.put('/update_product', async (req, res) => {
  const {name, cost} = req.body;
  if (!name || !cost) {
    return res.status(400).json({ error: 'Missing product name or cost' });
  }
  try{
    const data = await Database.executeCustomQuery('UPDATE product SET product_cost = $1 WHERE LOWER(name) = LOWER($2)', [cost, name]);
    res.json({message: "Update Successful"});
  }
  catch(err){
    res.status(500).json({ error: 'Update product query failed' });
  }
});
//http://localhost:8001/users/delete_product
/*
{
    "name":"Product Name"
}
    */
router.delete('/delete_product', async (req, res) => {
  const { name } = req.body;  
  if (!name) {
    return res.status(400).json({ error: 'Missing product name' });
  }
  try {
    const data = await Database.executeCustomQuery('DELETE FROM product WHERE LOWER(name) = LOWER($1)', [name]);
    res.json({message: "Delete Successful"});
  } catch (err) {
    res.status(500).json({ error: 'Delete product query failed' });
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





//Register Order http://localhost:8001/users/register_order
// For body 
/*
{
  "productIDs": ["1", "1", "2", "3"],  // Array of product IDs, repeats indicate multiple of same product
  "totalCost": 24.99,
  "customerName": "John Doe",
  "cashierId": 14,
  "paymentMethod": "cash",  // Optional, defaults to "cash"
  "taxRate": 6.25           // Optional, defaults to 6.25
}
*/
router.post('/register_order', async (req, res) => {
  const {productIDs, totalCost, customerName, paymentMethod = 'cash', taxRate = 6.25, cashierId} = req.body;
  if (!productIDs || productIDs.length === 0 || !totalCost || !customerName || !cashierId) {
    return res.status(400).json({ error: 'Missing order details. Required: productIDs array, totalCost, customerName, and cashierId' });
  }

  try
  {
    const productQuantities = {};
    for(const id of productIDs)
    {
      productQuantities[id] = (productQuantities[id] || 0) + 1;
    }
    const orderResult = await Database.executeCustomQuery(
      'INSERT INTO customer_order (customer_name, total_cost, cashierid, datetime, payment_method, tax_rate) VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING order_id',
      [customerName, totalCost, cashierId, paymentMethod, taxRate]
    );

    if (!orderResult || orderResult.length === 0) {
      throw new Error('Failed to create order');
    }

    const orderId = orderResult[0].order_id;

    for (const productId in productQuantities) {
      const quantity = productQuantities[productId];
      
      // Insert into customer_product junction table
      await Database.executeCustomQuery(
        'INSERT INTO customer_product (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [orderId, parseInt(productId), quantity]
      );

      // Step 3: Update ingredient quantities for each product ordered
      for (let i = 0; i < quantity; i++) {
        await Database.executeCustomQuery(
          'UPDATE ingredients SET quantity = quantity - pi.quantity_required FROM product_ingredient pi WHERE pi.product_id = $1 AND ingredients.ingredientid = pi.ingredientid',
          [parseInt(productId)]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order registered successfully',
      orderId: orderId
    });
  }
  catch (err) {
    console.error('Error registering order:', err);
    res.status(500).json({ error: 'Failed to register order', details: err.message });
  }
});

router.get('/last_10_orders', async (req, res) => {
  try {
    const result = await Database.executeQuery('last-10-orders');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Last 10 orders query failed' });
  }
});
module.exports = router;
