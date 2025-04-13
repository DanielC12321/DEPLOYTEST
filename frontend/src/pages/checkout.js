import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './checkout.module.css';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, total } = location.state || { cartItems: [], total: '0.00' };
  const apiUrl = process.env.REACT_APP_API_URL;
  // State for all form fields needed for customer_order table
  const [orderDetails, setOrderDetails] = useState({
    customer_name: '',
    total_cost: total,
    payment_method: 'Credit Card',
    items: cartItems,
    service_charge: 0,
    discount: 0,
    tax_rate: 0.0825, // 8.25% tax rate for Texas
    cashierid: 1, // TODO: Replace with actual cashier ID This is hardcoded
  });

  // Calculate values
  const subtotal = parseFloat(total);
  const taxAmount = subtotal * orderDetails.tax_rate;
  const serviceCharge = parseFloat(orderDetails.service_charge || 0);
  const discount = parseFloat(orderDetails.discount || 0);
  const finalTotal = subtotal + taxAmount + serviceCharge - discount;

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({
      ...orderDetails,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      // Send order details to backend
      let productList = []
      cartItems.forEach(item => { productList.push(item.id.toString()) 
        if(item.customizations.size === 'Small'){
          productList.push("21")
        }
        else if(item.customizations.size === 'Medium'){
          productList.push("22")
        }
        else if(item.customizations.size === 'Large'){
          productList.push("23")
        }
        if(item.customizations.sugar === 'Standard'){
          productList.push("56")
        }
        else if(item.customizations.sugar === 'Extra'){
          productList.push("56")
          productList.push("56")
        }
        if(item.customizations.pearls === 'Standard'){
          productList.push("57")
        }
        else if(item.customizations.pearls === 'Extra'){
          productList.push("57")
          productList.push("57")
        }

      });
      const orderData = {
        productIDs: productList,
        totalCost: finalTotal,
        customerName: orderDetails.customer_name,
        cashierId: orderDetails.cashierid,
        paymentMethod: orderDetails.payment_method,
        taxRate: orderDetails.tax_rate,
      };
      const response = await fetch(`${apiUrl}/users/register_order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      const data = await response.json();
      console.log('Order response:', data);
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: data.orderId, // Replace with actual order number
          orderDetails 
        }
      });
    } catch (error) {
      console.error('Error submitting order:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.checkoutHeader}>
        <div className={styles.logo}>
          <img 
            src="https://franchise.sharetea.com.au/wp-content/uploads/2021/08/cropped-Favicon.png" 
            alt="Share Tea Logo" 
            onClick={() => navigate('/order')}
          />
        </div>
        <h1>Checkout</h1>
      </div>

      <div className={styles.checkoutContainer}>
        {/* Order summary section */}
        <div className={styles.orderSummarySection}>
          <h2>Order Summary</h2>
          <div className={styles.itemList}>
            {cartItems.map((item, index) => (
              <div key={index} className={styles.checkoutItem}>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{item.name}</span>
                  <div className={styles.itemCustomizations}>
                    <small>Size: {item.customizations.size}</small>
                    <small>Sugar: {item.customizations.sugar}</small>
                    <small>Pearls: {item.customizations.pearls}</small>
                  </div>
                </div>
                <div className={styles.itemPrice}>${item.totalPrice.toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className={styles.priceSummary}>
            <div className={styles.priceLine}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.priceLine}>
              <span>Tax ({(orderDetails.tax_rate * 100).toFixed(2)}%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className={styles.priceLine}>
              <span>Service Charge</span>
              <span>${serviceCharge.toFixed(2)}</span>
            </div>
            <div className={styles.priceLine}>
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className={`${styles.priceLine} ${styles.total}`}>
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information Form */}
        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
          <div className={styles.formSection}>
            <h2>Customer Information</h2>
            <div className={styles.formGroup}>
              <label htmlFor="customer_name">Name</label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={orderDetails.customer_name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Payment Method</h2>
            <div className={styles.paymentOptions}>
              <div className={styles.paymentOption}>
                <input
                  type="radio"
                  id="creditCard"
                  name="payment_method"
                  value="Credit Card"
                  checked={orderDetails.payment_method === 'Credit Card'}
                  onChange={handleInputChange}
                />
                <label htmlFor="creditCard">Credit Card</label>
              </div>
              <div className={styles.paymentOption}>
                <input
                  type="radio"
                  id="cash"
                  name="payment_method"
                  value="Cash"
                  checked={orderDetails.payment_method === 'Cash'}
                  onChange={handleInputChange}
                />
                <label htmlFor="cash">Cash</label>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              Back to Order
            </button>
            <button 
  type="submit" 
  className={styles.placeOrderButton}
  disabled={isSubmitting} 
>
  {isSubmitting ? 'Processing...' : 'Place Order'} 
</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;