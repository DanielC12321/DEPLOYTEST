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
  const [subtotalCost, setsubtotalCost] = useState(0);
  const [customerName, setcustomerName] = useState("")
  const [isCard, setIsCard] = useState(false);
  const [payment, setpayment] = useState("cash")
  const [productIds, setProductIds] = useState([]);


  const navigate = useNavigate();

  const APIURL = process.env.REACT_APP_API_URL; 
  console.log(APIURL);

  const backtoMenu = () => {
    navigate("/cashier", { state: { orderItems } });
  };

  const confirmtoMenu = () => {
    navigate("/cashier", { state: { orderItems: [] } });
  };
  

  useEffect(() => {
    let subtotal = 0;
    let productList = []
    orderItems.forEach(item => { productList.push(item.id.toString()) 
      if(item.size === 'Small'){
        productList.push("21")
        subtotal += 1.00;
      }
      else if(item.size === 'Medium'){
        productList.push("22")
        subtotal += 2.00;
      }
      else if(item.size === 'Large'){
        productList.push("23")
        subtotal += 3.00;
      }
      if(item.sugar === 'Standard'){
        productList.push("56")
        subtotal += 0.99;

      }
      else if(item.sugar === 'Extra'){
        productList.push("56")
        productList.push("56")
        subtotal += 0.99;
        subtotal += 0.99;

      }
      if(item.pearls === 'Standard'){
        productList.push("57")
        subtotal += 0.77;

      }
      else if(item.pearls === 'Extra'){
        productList.push("57")
        productList.push("57")
        subtotal += 0.77;
        subtotal += 0.77;
      }
    });

    setProductIds(productList);


    for (let i = 0; i < orderItems.length; i++) {
      subtotal += parseFloat(orderItems[i].cost.replace("$", ""));
    }
    setsubtotalCost(subtotal);

    settotalCost(subtotal*(1.0825));

  }, [orderItems]);


  const togglepay = (card) => {
    if(!card) {
      setpayment('card');
      setIsCard(true);
    } else {
      setpayment('cash')
      setIsCard(false);

    }
  }



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

const orderData = {
  productIDs: productIds,
  totalCost: totalCost,
  customerName: customerName,
  paymentMethod: payment,
  taxRate: 0.0825,
  cashierId: 1,
};

console.log(orderData); 

  const placeOrder = async () => {
      try {
        await fetch(`${APIURL}/users/register_order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "productIDs": orderItems.map(orderItems => orderItems.id),
            "totalCost": totalCost,
            "customerName" : customerName,
            "paymentMethod": 'cash',
            "taxRate": 6.25,         
            "cashierId" : 1,
          }),
        });
      } catch (error) {
        console.error("Could not update product table");
      }
      confirmtoMenu();
    };

  
  return (
    <div id="checkwrapper">
      <div className="checkout-wrapper">
        <div className="checkout-order">
        <h2>Order List</h2><button id="editOrder" onClick={backtoMenu}>Edit Order</button>
        <div class="scrollorder">
        {orderItems.length === 0 ? (
          <p>No items in order</p>
        ) : (
          orderItems.map((item, index) => (
            <div key={index} className="order-item">
              <div className="order-header">
                <span>{item.product}</span>
                <span>{item.cost}</span>
              </div>
              <div className="order-details">
                Size: {item.size}   |   Sugar: {item.sugar}   |   Pearls: {item.pearls}
              </div>
            </div>
          ))
        )}
        </div>
        </div>
      </div>
      <div id="checkdiv2">
        <h3>Customer Name</h3>
        <input id="customerName" value={customerName} onChange={(e) => setcustomerName(e.target.value)}></input>
        <h3>Payment Method</h3>
        <div className="toggle-wrapper">
      <span className={!isCard ? 'active' : ''}>Cash</span>
      <label className="switch">
        <input type="checkbox" checked={isCard} onChange={() => togglepay(isCard)} />
        <span className="slider" />
      </label>
      <span className={isCard ? 'active' : ''}>Card</span>
      </div>
        
      <div id="OrderTotal">Subtotal: ${subtotalCost.toFixed(2)}</div>
      <div id="OrderTotal" >Taxes: ${(totalCost-subtotalCost).toFixed(2)}</div>
      <div id="OrderTotal">Order Total: ${totalCost.toFixed(2)}</div>
            <button id="placeOrder" onClick={placeOrder}>Place Order</button>
        </div>
    </div>
  );
}

export default CashierCheckout;
