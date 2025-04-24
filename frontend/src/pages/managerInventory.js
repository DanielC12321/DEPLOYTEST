import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./managerInventory.css";


// LATER TODOS
// Make the tables refresh every time it is altered
// Fix the layout of the add/uodate/delete div
// Maybe make "Are you sure pop ups"
// Order the tables by id
// 

function ManagerInventory() {
  
  const navigate = useNavigate();

  const toManager = () => {
    navigate("/manager");
  }



  /////////// Declare Variables ///////////////////

  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  
  const [currproduct, setcurrProduct] = useState(null);
  const [curringredient, setcurrIngredient] = useState(null);

  const [openProduct, setopenProduct] = useState(false);
  const [openIngredient, setopenIngredient] = useState(false);

  const [prodRUsure, setprodRUsure] = useState(false);
  const [ingrRUsure, setingrRUsure] = useState(false);

  

  const APIURL = process.env.REACT_APP_API_URL; 
  console.log(APIURL);
////////////////////////////////////////////////////////////////////



////////////// Product/Ingredient Tables ////////////////////////////

const getProducts = () => {
  fetch(`${APIURL}/users/product_table`)

  .then(response => response.json())
  .then(json => {
    setProducts(json)

    console.log(json)
})
  .catch((error) => console.error("Could not fetch data"));
};

const getIngredients = () => {
  fetch(`${APIURL}/users/ingredient_table`)
  .then(response => response.json())
  .then(json => {
    setIngredients(json)
    console.log(json)
})
  .catch((error) => console.error("Could not fetch data"));
};

useEffect(() => {
  getProducts();
  getIngredients();
}, []);

const refreshTables = () => {
  getProducts();
  getIngredients();
}


const productSelect = (id, name, price, category, imgurl) => {
  setcurrProduct({id, name, price, category, imgurl});
  setopenIngredient(false);
  setopenProduct(true);

};

const noSelect = () => {
  setopenProduct(false);
  setopenIngredient(false);
}

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
            <th>Category</th>
            <th>Product</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.filter(product => product.category !== "utensils" && product.category !== "add-ons")
            .map((entry, i) => (
            <tr key={i} class={currproduct?.id === entry.product_id && openProduct ? "selected" : "rows"}>
              <td>{entry.product_id}</td>
              <td>{entry.category}</td>
              <td><button onClick={() => productSelect(entry.product_id, entry.name, entry.product_cost, entry.category, entry.imgurl)} class="select">{entry.name}</button></td>
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
            <th>Allergens</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((entry, i) => (
            <tr class={curringredient?.id === entry.ingredientid && openIngredient ? "selected" : "rows"} key={i}>
              <td>{entry.ingredientid}</td>
              <td><button onClick={() => ingredientSelect(entry.ingredientid, entry.name, entry.quantity, entry.cost)} class="select">{entry.name}</button></td>
              <td>{entry.quantity}</td>
              <td>{entry.cost}</td>
              <td>{entry.allergen}</td>
            </tr>
          ))
          }
        </tbody>
      </table>
  );
};

/////////////////////////////////////////////////////////////


//////////////////// Add Products/Ingredients ///////////////////////

const addProduct = async (prodName, price, category, imgurl) => {
  try {
    await fetch(`${APIURL}/add_product`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "name": prodName,
        "cost": price,
        "category": category,
        "imgurl": imgurl,
      }),
    });
    refreshTables();
  } catch (error) {
    console.error("Could not update product table");
  }
};

const [newprod, setnewprod] = useState("");
const [newcost, setnewcost] = useState("");
const [newcategory, setnewcategory] = useState("");
const [newimg, setnewimg] = useState("");


const handleAddProd = () => {
  const usedName = products.some(products => products.name.toLowerCase() === newprod.toLowerCase())

  if (newprod === "" || newcost === "" || newcategory === "" || usedName || isNaN(newcost)) {
    alert("Invalid Input");
    return
  } else {
    addProduct(newprod, newcost, newcategory, newimg);
  }
}


const addIngredient = async (newIngr, price, quant) => {
  const usedName = ingredients.some(ingredients => ingredients.name.toLowerCase() === newIngr.toLowerCase())

  if (newIngr === "" || price === "" || quant === "" || usedName || isNaN(price)) {
    alert("Invalid Input");
    return

  } else {
    try {
      await fetch(`${APIURL}/add_ingredient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "name": newIngr,
          "cost": price,
          "quantity" : quant
        }),
      });
      refreshTables();
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

const [pupdateValue, setpupdateValue] = useState("");
const [pupdatefield, setpupdatefield] = useState("");


const updateProduct = async (updateItem, pupdatefield, pupdateValue) => {
  const validName = products.some(products => products.name.toLowerCase() === updateItem.toLowerCase())

  if (!validName) {
    alert("Invalid Input");
    return
  } else {

    try {
      await fetch(`${APIURL}/users/update_product`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "name": updateItem,
          "value": pupdateValue,
          "field" : pupdatefield,
        }),
      });
      refreshTables();
    } catch (error) {
      console.error("Could not update product table");
    }
  } 
}


const [updateValue, setupdateValue] = useState("");
const [updatefield, setupdatefield] = useState("");


const updateIngredient = async (updateItem, updatefield, updateValue) => {
  const validName = ingredients.some(ingredients => ingredients.name.toLowerCase() === updateItem.toLowerCase())
  
  if (!validName) {
    alert("Invalid Input");
    return
  } else {

    try {
      await fetch(`${APIURL}/update_ingredient`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "name": updateItem,
          "value": updateValue,
          "field": updatefield,
          
        }),
      });
      refreshTables();
    } catch (error) {
      console.error("Could not update product table");
    }
  } 
}

//////////////////////////////////////////////////////////////////



/////////////////// Delete Products/Ingredients /////////////////////


const delProduct = async (currproduct) => {

  try {
    await fetch(`${APIURL}/users/delete_product`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "name": currproduct.name,
      }),
    });
    refreshTables();
  } catch (error) {
    console.error("could not delete product");
  }
  noSelect();
  setprodRUsure(false);
}

const delIngredient = async (curringredient) => {

  try {
    await fetch(`${APIURL}/delete_ingredient`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "name": curringredient.name,
      }),
    });
    refreshTables();
  } catch (error) {
    console.error("could not delete product");
  }
  noSelect();
  setingrRUsure(false);

}

///////////////////////////////////////////////////////////////////////




////////////////// Main Body ///////////////////////////////////

  return (
        <div id="wrapper">
        <div class="divs" id="div1"><button onClick={toManager} id="back">Manager Home</button></div>
        <div class="divs" id="idiv2"><h1 id="header">Inventory</h1></div>
        <div class="divs" id="div3">Div</div>



        <div class="divs" id="div4">
          {openProduct && !prodRUsure &&
              <div class="update">
              <h2>Update Products</h2>
              <div id="itemName">{currproduct.name} <button class="delprod" onClick={() => setprodRUsure(true)}>X</button></div>
              <img class="productimg" src={currproduct.imgurl}></img>
              <div class="attr">
                <div>ID: {currproduct.id}</div><div>Category: {currproduct.category}</div><div>Price: {currproduct.price}</div>
              </div>
              <div>
                  <select class="dropdown" value={pupdatefield} onChange={(e) => setpupdatefield(e.target.value)}>
                    <option value="">Update Field</option>
                    <option value="product_cost">Product Cost</option>
                    <option value="category">Category</option>
                    <option value="imgurl">Image URL</option>
                  </select>
                  <input class="inupdate" value={pupdateValue} onChange={(e) => setpupdateValue(e.target.value)}></input><button class="dropdown" onClick={() => updateProduct(currproduct.name, pupdatefield, pupdateValue)}>Change Value</button>
                </div> 
                <button class="backbtn" onClick={noSelect}>Back</button>
            </div>
            }
            {prodRUsure &&
              <div class="RUsure">
              <div>Are you sure you want to Delete this Product?</div>
              <div><button onClick={() => delProduct(currproduct)}>Yes</button><button onClick={() => setprodRUsure(false)}>No</button></div>
              </div>
            }

          {openIngredient && !ingrRUsure &&
            <div class="update">
              <h2>Update Ingredients</h2>
              <div style={{height: "100px"}}></div>
              <div id="itemName">{curringredient.name} <button class="delprod" onClick={() => setingrRUsure(true)}>X</button></div>
              <div class="attr">
                <div>ID: {curringredient.id}</div><div>Item Quantity: {curringredient.quant}</div>Item Cost: <div>{curringredient.cost}</div>
              </div>
              <div>
                  <select class="dropdown" value={updatefield} onChange={(e) => setupdatefield(e.target.value)}>
                    <option value="">Update Field</option>
                    <option value="cost">Cost</option>
                    <option value="quantity">Quantity</option>
                    <option value="allergen">Allergens</option>
                  </select>
                  <input class="inupdate" value={updateValue} onChange={(e) => setupdateValue(e.target.value)}></input><button class="dropdown" onClick={() => updateIngredient(curringredient.name, updatefield, updateValue)}>Change Value</button>
                </div> 
                  <button class="backbtn" onClick={noSelect}>Back</button>
            </div>
          }
          {ingrRUsure &&
            <div class="RUsure">
            <div>Are you sure you want to Delete this Ingredient?</div>
            <div><button onClick={() => delIngredient(curringredient)}>Yes</button><button onClick={() => setingrRUsure(false)}>No</button></div>
            </div>
          }
          {!openIngredient && !openProduct &&
            <div class="update">
              <h3>Select a Product or Ingredient to Continue</h3>
              <div>
                <h3>Add Product</h3>
                  <div class="addprodingr">
                    <table class="additemtable">
                      <tbody>
                        <tr>
                          <td class="inputlabel">New Product Name: </td>
                          <td><input class="inputadd" type="text" value={newprod} onChange={(e) => setnewprod(e.target.value)}></input></td>
                        </tr>
                        <tr>
                          <td class="inputlabel">New Product Cost: </td>
                          <td><input class="inputadd" type="number" value={newcost} onChange={(e) => setnewcost(e.target.value)}></input></td>
                        </tr>
                        <tr>
                          <td class="inputlabel">New Product Category: </td>
                          <td><input class="inputadd" type="text" value={newcategory} onChange={(e) => setnewcategory(e.target.value)}></input></td>
                        </tr>
                        <tr>
                          <td class="inputlabel">New Product Image URL: </td>
                          <td><input class="inputadd" type="text" value={newimg} onChange={(e) => setnewimg(e.target.value)}></input></td>
                        </tr>
                      </tbody>
                    </table>
                  {newprod !== "" && newcost !== "" && newcategory !== "" && newimg !== "" &&
                    <div><button class="addbutton" onClick={handleAddProd}>Add</button></div>
                  }
                </div>
              </div>
              <h3 id="addingrtitle">Add Ingredient</h3>
              <div class="addprodingr">
              <table class="additemtable">
                  <tbody>
                    <tr>
                      <td class="inputlabel">New Item Name: </td>
                      <td><input class="inputadd" type="text" value={newIngr} onChange={(e) => setnewingr(e.target.value)}></input></td>
                    </tr>
                    <tr>
                      <td class="inputlabel">New Item Quantity: </td>
                      <td><input class="inputadd" type="number" value={newquant} onChange={(e) => setnewquant(e.target.value)}></input></td>
                    </tr>
                    <tr>
                      <td class="inputlabel">New Item Cost: </td>
                      <td><input class="inputadd" type="number" value={newprice} onChange={(e) => setnewprice(e.target.value)}></input></td>
                    </tr>
                  </tbody>
                </table>
                {newIngr !== "" && newquant !== "" && newprice !== "" &&
                  <div><button class="addbutton" onClick={() => addIngredient(newIngr, newprice, newquant)}>Add</button></div>
                }
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