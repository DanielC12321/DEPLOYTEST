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

  useEffect(() => {
    fetch("https://deploytest-backend-p9h3.onrender.com/users/product_table")
    .then(response => response.json())
    .then(json => {
      setProducts(json)
      console.log(json)
  })
    .catch((error) => console.error("Could not fetch data"));
  }, []);

useEffect(() => {
  fetch("https://deploytest-backend-p9h3.onrender.com/users/ingredient_table")
  .then(response => response.json())
  .then(json => {
    setIngredients(json)
    console.log(json)
})
  .catch((error) => console.error("Could not fetch data"));
}, []);


const ProductTable = () => {

  return(
      <table class="tables">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((entry, i) => (
            <tr key={i}>
              <td>{entry.product_id}</td>
              <td>{entry.name}</td>
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
      <table class="tables">
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
            <tr key={i}>
              <td>{entry.ingredientid}</td>
              <td>{entry.name}</td>
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
        <div class="divs" id="div1"><button onClick={toManager} id="back">Manager Home</button></div>
        <div class="divs" id="div2"><h1 id="header">Inventory</h1></div>
        <div class="divs" id="div3">Div</div>
        <div class="divs" id="div4">Div</div>
        <div class="divs" id="div5">
          <div class="TableDivs">
            <div class="scrolltable"><h2>Products</h2>
              <ProductTable data={products}/>
            </div>
            <div class="scrolltable"><h2>Ingredients</h2>
              <IngredientTable data={ingredients}/>
            </div>
         </div>
        </div>
        <div class="divs" id="div6">Div</div>

        </div>
  );
}

export default ManagerInventory;