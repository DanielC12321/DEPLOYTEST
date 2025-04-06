import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./managerInventory.css";


//TODOS
// Fix Update Ingredient so you dont need to change both at once

// LATER TODOS
// Make the tables refresh every time it is altered
// Fix the layout of the add/uodate/delete div
// Fix the add prod/ingr API for image url
// Maybe make "Are you sure pop ups"
// 

function ManagerInventory() {
  
  const navigate = useNavigate();

  const toManager = () => {
    navigate("/ManagerInterface");
  }



  /////////// Declare Variables ///////////////////

  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  
  const [currproduct, setcurrProduct] = useState(null);
  const [curringredient, setcurrIngredient] = useState(null);

  const [openProduct, setopenProduct] = useState(false);
  const [openIngredient, setopenIngredient] = useState(false);
  
////////////////////////////////////////////////////////////////////



////////////// Product/Ingredient Tables ////////////////////////////

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
          ))}
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

/////////////////////////////////////////////////////////////


//////////////////// Add Products/Ingredients ///////////////////////

const addProduct = async (prodName, price) => {
  try {
    await fetch("http://localhost:8001/add_product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "name": prodName,
        "cost": price,
      }),
    });
  } catch (error) {
    console.error("Could not update product table");
  }
};

const [newprod, setnewprod] = useState("");
const [newcost, setnewcost] = useState("");

const handleAddProd = () => {
  const usedName = products.some(products => products.name.toLowerCase() === newprod.toLowerCase())

  if (newprod === "" || newcost === "" || usedName || isNaN(newcost)) {
    alert("Invalid Input");
    return
  } else {
    addProduct(newprod, newcost);
  }
}


const addIngredient = async (newIngr, price, quant) => {
  const usedName = ingredients.some(ingredients => ingredients.name.toLowerCase() === newIngr.toLowerCase())

  if (newIngr === "" || price === "" || quant === "" || usedName || isNaN(price)) {
    alert("Invalid Input");
    return

  } else {
    try {
      await fetch("http://localhost:8001/add_ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "name": newIngr,
          "cost": price,
          "quantity" : quant
        }),
      });
    } catch (error) {
      console.error("Could not update ingredient table");
    }
  }
};

const [newIngr, setnewingr] = useState("");
const [newprice, setnewprice] = useState("");
const [newquant, setnewquant] = useState("");


////////////////////////////////////////////////////////////////


///////////////////// Update Products/Ingredients ////////////////////

const [updatePrice, setupdatePrice] = useState("");

const updateProduct = async (updatePrice, updateName) => {

  if (updatePrice === "" || isNaN(updatePrice)) {
    alert("Invalid Input");
    return
  } else {

    try {
      await fetch("http://localhost:8001/users/update_product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "name": updateName,
          "cost": Number(updatePrice),
        }),
      });
    } catch (error) {
      console.error("Could not update product table");
    }
  } 
}


const [updatequant, setupdatequant] = useState("");

const updateIngredient = async (updatePrice, updateName, updatequant) => {

  if (updatePrice === "" || isNaN(updatePrice) || updatequant === "" || isNaN(updatequant)) {
    alert("Invalid Input");
    return
  } else {

    try {
      await fetch("http://localhost:8001/update_ingredient", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "name": updateName,
          "value": Number(updatePrice),
          "field": updatequant
          
        }),
      });
    } catch (error) {
      console.error("Could not update product table");
    }
  } 
}

//////////////////////////////////////////////////////////////////



/////////////////// Delete Products/Ingredients /////////////////////


const delProduct = async (currproduct) => {

  try {
    await fetch("http://localhost:8001/users/delete_product", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "name": currproduct.name,
      }),
    });
  } catch (error) {
    console.error("could not delete product");
  }
}

const delIngredient = async (curringredient) => {

  try {
    await fetch("http://localhost:8001/delete_ingredient", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "name": curringredient.name,
      }),
    });
  } catch (error) {
    console.error("could not delete product");
  }
}

///////////////////////////////////////////////////////////////////////




////////////////// Main Body ///////////////////////////////////

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

                <div class="attr"><button onClick={() => updateProduct(updatePrice, currproduct.name)}>Update Price</button><button onClick={() => delProduct(currproduct)}>Remove Product</button></div>
                <div>Enter New Item Price: <input type="text" value={updatePrice} onChange={(e) => setupdatePrice(e.target.value)}></input></div>
              
              <h3>Add Product</h3>
                <div>
                <div>Enter New Item Name: <input type="text" value={newprod} onChange={(e) => setnewprod(e.target.value)}></input></div>
                <div>Enter New Item Cost: <input type="number" value={newcost} onChange={(e) => setnewcost(e.target.value)}></input></div>
                <div><button onClick={handleAddProd}>Add New Item</button></div>

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
                <div class="attr"><button>Update Quantity</button><button>Update Cost</button><button onClick={() => delIngredient(curringredient)}>Remove Ingredient</button></div>
                  <div>Enter New Item Quantity: <input></input></div>
                  <div>Enter New Item Cost: <input></input></div>

                <h3>Add Ingredient</h3>
                  <div>
                  <div>Enter New Item Name: <input type="text" value={newIngr} onChange={(e) => setnewingr(e.target.value)}></input></div>
                  <div>Enter New Item Quantity: <input type="number" value={newquant} onChange={(e) => setnewquant(e.target.value)}></input></div>
                  <div>Enter New Item Cost: <input type="number" value={newprice} onChange={(e) => setnewprice(e.target.value)}></input></div>
                  <div><button onClick={() => addIngredient(newIngr, newprice, newquant)}>Add New Item</button></div>
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