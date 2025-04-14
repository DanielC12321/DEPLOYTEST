import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./cashier.css";

//Fix editOrder so it retains the order when going back to cashier
//Make sure order querey works
// add customerName and cashierId functionality



function CashierCheckout() {
  const location = useLocation();
  const orderItems = location.state?.orderItems || [];

  const [totalCost, settotalCost] = useState(0);
  const navigate = useNavigate();

  const APIURL = process.env.REACT_APP_API_URL; 
  console.log(APIURL);

  const backtoMenu = () => {
    navigate("/cashier");
  };
  

  useEffect(() => {

    let total = 0;
    for (let i = 0; i < orderItems.length; i++) {
      total += parseFloat(orderItems[i].cost.replace("$", ""));
    }
    settotalCost(total);

  }, [orderItems]);

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
  const placeOrder = async () => {
      try {
        await fetch(`${APIURL}/users/register_order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "productIDs": orderItems.map(orderItems => orderItems.id),
            "cost": totalCost,
            "customerName" : "John Doe",
            "cashierId" : 1,
            "paymentMethod": "cash",
            "taxRate": 6.25,         
          }),
        });
      } catch (error) {
        console.error("Could not update product table");
      }
      backtoMenu();
    };

  
  return (
    <div id="checkwrapper">
      <div id="checkdiv1">
      <div id="OrderTotal">Order Total: ${totalCost}</div>
      </div>
      <div className="checkout-order">
        <h2>Order List</h2><button id="editOrder" onClick={backtoMenu}>Edit Order</button>
        {orderItems.length === 0 ? (
          <p>No items in order</p>
        ) : (
          orderItems.map((item, index) => (
            <div key={index} className="order-item">
              <div className="order-header">
                <span>{item.product}</span>
              </div>
              <div className="order-details">
                Size: {item.size}   |   Sugar: {item.sugar}   |   Pearls: {item.pearls}
              </div>
            </div>
          ))
        )}
      </div>
      <div id="checkdiv2">
        <div style={{ flexGrow: 1 }}></div>
      <button id="placeOrder" onClick={placeOrder}>Place Order</button>
        </div>
    </div>
  );
}

export default CashierCheckout;
