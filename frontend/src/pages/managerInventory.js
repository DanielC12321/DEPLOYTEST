import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./managerInventory.css";



function ManagerInventory() {
  
  const navigate = useNavigate();

  const toManager = () => {
    navigate("/ManagerInterface");
  }

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8001/users/product_table")
    .then(response => response.json())
    .then(json => {
      setProducts(json)
      console.log(json)
  })
    .catch((error) => console.error("Could not fetch data"));
  }, []);

  const data = [
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },    
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },   
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },  
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },   
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },  
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },   
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },   
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },    
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },   
    { product: 'Milk', price: 1, quantity: -1 },
    { product: 'Tea', price: 2, quantity: -2 },
    { product: 'Juice', price: 3, quantity: -3 },
];

const CreateTable = () => {

  return(
      <table class="tables">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((entry, i) => (
            <tr key={i}>
              <td>{entry.product}</td>
              <td>{entry.price}</td>
              <td>{entry.quantity}</td>
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
              <CreateTable />
            </div>
            <div class="scrolltable"><h2>Ingredients</h2>
              <CreateTable data={products}/>
            </div>
         </div>
        </div>
        <div class="divs" id="div6">Div</div>

        </div>
  );
}

export default ManagerInventory;