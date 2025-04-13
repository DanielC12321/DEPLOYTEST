import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './checkout.module.css'; // Reuse your checkout styles

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, orderDetails } = location.state || { orderNumber: '0000', orderDetails: {} };

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
        <h1>Order Confirmed</h1>
      </div>

      <div className={styles.confirmation}>
        <div className={styles.confirmationMessage}>
          <h2>Thank you for your order!</h2>
          <p>Your order number is: <strong>#{orderNumber}</strong></p>
          <p>We'll start preparing your drinks right away.</p>
          
          <div className={styles.formActions}>
            <button 
              className={styles.placeOrderButton}
              onClick={() => navigate('/customer')}
            >
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;