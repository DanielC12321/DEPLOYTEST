import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./managerInventory.css";



function ManagerInventory() {
  
  const navigate = useNavigate();

  const toManager = () => {
    navigate("/manager");
  }

  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [currproduct, setcurrProduct] = useState(null);
  const [curringredient, setcurrIngredient] = useState(null);
  const [openProduct, setopenProduct] = useState(false);
  const [openIngredient, setopenIngredient] = useState(false);


  useEffect(() => {
    fetch("http://localhost:8001/users/product_table")
    .then(response => response.json())
    .then(json => {
      setProducts(json)
      console.log(json)
  })
    .catch((error) => console.error("Could not fetch data"));
  }, []);

useEffect(() => {
  fetch("http://localhost:8001/users/ingredient_table")
  .then(response => response.json())
  .then(json => {
    setIngredients(json)
    console.log(json)
})
  .catch((error) => console.error("Could not fetch data"));
}, []);

const productSelect = (id, name, price) => {
  setcurrProduct({id, name, price});
  setopenIngredient(false);
  setopenProduct(true);

};

const ingredientSelect = (id, name, quant, cost) => {
  setcurrIngredient({id, name, quant, cost});
  setopenProduct(false);
  setopenIngredient(true);
  
};





const ProductTable = () => {

  return(
      <table class="tables" id="table1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((entry, i) => (
            <tr class="rows" key={i}>
              <td>{entry.product_id}</td>
              <td><button onClick={() => productSelect(entry.product_id, entry.name, entry.product_cost)} class="select">{entry.name}</button></td>
              <td>{entry.product_cost}</td>
            </tr>
          ))
          }
        </tbody>
      </table>

  );
};

const IngredientTable = () => {

  return(
      <table class="tables" id="table2">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((entry, i) => (
            <tr class="rows" key={i}>
              <td>{entry.ingredientid}</td>
              <td><button onClick={() => ingredientSelect(entry.ingredientid, entry.name, entry.quantity, entry.cost)} class="select">{entry.name}</button></td>
              <td>{entry.quantity}</td>
              <td>{entry.cost}</td>
            </tr>
          ))
          }
        </tbody>
      </table>

  );
};

  return (
        <div id="wrapper">
        <div class="divs" id="div1"><button onClick={toManager} id="back">&lt;= Manager Home</button></div>
        <div class="divs" id="div2"><h1 id="header">Inventory</h1></div>
        <div class="divs" id="div3">Div</div>



        <div class="divs" id="div4">
          {openProduct &&
            <div class="update">
              <h2>Update Products Table</h2>
              <div id="itemName">Item: {currproduct.name}</div>
              <div class="attr">
                <div>Item ID: {currproduct.id}</div><div>Item Price: {currproduct.price}</div>
                </div>
                <div class="attr"><button>Update Price</button><button>Remove Product</button></div>
                <div>Enter New Item Price: <input></input></div>
              
              <h3>Add Product</h3>
                <div>
                <div>Enter New Item Price: <input></input></div>
                <div>Enter New Item Price: <input></input></div>
                <div>Enter New Item Price: <input></input></div>
                <div><button>Add New Item</button></div>



                </div>
              

            </div>
          }
          {openIngredient && 
            <div class="update">
              <h2>Update Ingredients</h2>
              <div id="itemName">Item: {curringredient.name}</div>
              <div class="attr">
                <div>Item ID: {curringredient.id}</div><div>Item Quantity: {curringredient.quant}</div>Item Cost: <div>{curringredient.cost}</div>

                </div>


            </div>
          }



        </div>



        <div class="divs" id="div5">
          <div class="TableDivs">
            <div>
            <h2>Products</h2>
            <div class="scrolltable">
              <ProductTable data={products}/>            
            </div>
            </div>
            <div>
            <h2>Ingredients</h2>
            <div class="scrolltable">
              <IngredientTable data={ingredients}/>
            </div>
            </div>
         </div>
        </div>
        <div class="divs" id="div6">Div</div>

        </div>
  );
}

export default ManagerInventory;