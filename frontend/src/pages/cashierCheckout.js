import React from 'react';
import { useLocation } from "react-router-dom";
import "./cashier.css";

function CashierCheckout() {
  const location = useLocation();
  const orderItems = location.state?.orderItems || [];
  
  return (
    <div id="wrapper">
      <div className="checkout-order">
        <h2>Order List</h2>
        {orderItems.length === 0 ? (
          <p>No items in order</p>
        ) : (
          orderItems.map((item, index) => (
            <div key={index} className="order-item">
              <div className="order-header">
                <span>Product #{item.productNum}</span>
              </div>
              <div className="order-details">
                Size: {item.size}, Sugar: {item.sugar}, Pearls: {item.pearls}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CashierCheckout;
