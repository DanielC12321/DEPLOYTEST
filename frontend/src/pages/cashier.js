import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./cashier.css";


// Removing one Item removes all

function Cashier() {
  const [Open, setOpen] = useState(false);
  const [currproduct, setcurrproduct] = useState("");
  const [sugar, setSugar] = useState('standard');
  const [size, setSize] = useState('medium');
  const [pearls, setPearls] = useState('standard');
  const [orderItems, setOrderItems] = useState([]);
  const [numItems, setnumItems] = useState(0);


  const location = useLocation();
  useEffect(() => {
    if (location.state?.orderItems) {
      setOrderItems(location.state.orderItems);
    }
  }, [location.state?.orderItems]);

  const APIURL = process.env.REACT_APP_API_URL; 
  console.log(APIURL);


  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch(`${APIURL}/users/product_table`)
    .then(response => response.json())
    .then(json => {
      setProducts(json)
      console.log(json)
  })
    .catch((error) => console.error("Could not fetch data"));
  }, []);


  const Customize = (ingredient, amount) => {
    const newItem = {
      id: currproduct.product_id,
      product: currproduct.name,
      cost: currproduct.product_cost,
      size: size,
      sugar: sugar,
      pearls: pearls,
      itemNum: numItems
    };

    if (ingredient === 'sugar') {
      setSugar(amount);
    }
    if (ingredient === 'size') {
      setSize(amount);
    }
    if (ingredient === 'pearls') {
      setPearls(amount);
    }
  };

  const ConfirmCustom = () => {
    
    //submit product to order summary
    //have object that keep track of this and sends it to checkout
    //use the productNum to link with products in database
    const newItem = {
      id: currproduct.product_id,
      product: currproduct.name,
      cost: currproduct.product_cost,
      size: size,
      sugar: sugar,
      pearls: pearls,
      itemNum: numItems
    };
    setOrderItems([...orderItems, newItem]);
    setnumItems(numItems+1);

    setOpen(false);
  };

  const removeItem = (itemid) => {
    setOrderItems(orderItems.filter(item => item.id !== itemid));
    setnumItems(numItems-1);
  };

  
  const navigate = useNavigate();

  const pickProduct = (product) => {
    setcurrproduct(product);
    setOpen(true);
  };

  const logout = () => {
    navigate("/login");
  };

  const checkout = () => {
    if (orderItems.length > 0) {
      navigate("/cashierCheckout", { 
        state: { orderItems }
      });
    } else {
      alert("Please add items to your order first.");
    }
  
  };

  return (
        <div id="cashwrapper">
        <div class="divs" id="cdiv1"><button onClick={logout} id="logout">Logout</button></div>
        <div class="divs" id="div2"><h1 id="cheader">Create Order</h1>
        </div>
        <div class="divs" id="div3"><a></a></div>
        <div class="divs" id="div4"></div>
        <div class="divs" id="div5">
        {!Open && 
        <div class="menu">
          {products
          .filter(product => product.category !== "utensils" && product.category !== "add-ons")
          .map((product, i) => (
            <button onClick={() => pickProduct(product)} key={i}>{product.name}</button>
          ))}
        </div> 
        }
        {Open && (
            <div className="cstmwindow">
              <div className="customize">
                <h2>Customize</h2>
                <h4>Size</h4>
                <div class="customButtons">
                <button class={size === 'small' ? 'selected' : ''} onClick={() => Customize('size', 'small')}>Small</button>
                <button class={size === 'medium' ? 'selected' : ''} onClick={() => Customize('size', 'medium')}>Medium</button>
                <button class={size === 'large' ? 'selected' : ''} onClick={() => Customize('size', 'large')}>Large</button>
                </div>

                <h4>Sugar</h4>
                <div class="customButtons">
                <button class={sugar === 'less' ? 'selected' : ''} onClick={() => Customize('sugar', 'less')}>Less</button>
                <button class={sugar === 'standard' ? 'selected' : ''} onClick={() => Customize('sugar', 'standard')}>Standard</button>
                <button class={sugar === 'extra' ? 'selected' : ''} onClick={() => Customize('sugar', 'extra')}>Extra</button>
                </div>

                <h4>Pearls</h4>

                <div class="customButtons">
                <button class={pearls === 'less' ? 'selected' : ''} onClick={() => Customize('pearls', 'less')}>Less</button>
                <button class={pearls === 'standard' ? 'selected' : ''} onClick={() => Customize('pearls', 'standard')}>Standard</button>
                <button class={pearls === 'extra' ? 'selected' : ''} onClick={() => Customize('pearls', 'extra')}>Extra</button>
                </div>


                <button onClick={() => ConfirmCustom()} className="order">Add Order</button>
              </div>
            </div>
          )}
        </div>
        <div class="divs" id="div6">
          <div className="order-list">
              <h3>Order List</h3>
              {orderItems.length === 0 ? (
                <p>No items in order</p>
              ) : (
                orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-header">
                      <span>{item.product}</span>
                      <spam>Id:{item.id}</spam>
                      <button onClick={() => removeItem(item.id)}>✕</button>
                    </div>
                    <div className="order-details">
                      Size: {item.size}, Sugar: {item.sugar}, Pearls: {item.pearls}
                    </div>
                  </div>
                ))
              )}
            </div>
        </div>
        <div class="divs" id="div7"><a></a></div>
        <div class="divs" id="div8">Item Selected - Name: {currproduct.name} || Item ID: {currproduct.product_id}</div>
        <div class="divs" id="div9"><button onClick={checkout} id="checkoutButton">Checkout</button></div>
        </div>
  );
}

export default Cashier;