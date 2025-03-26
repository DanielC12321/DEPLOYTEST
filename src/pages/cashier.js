import React, { useState } from 'react';
//import '../styles/Cashier.css';
function Cashier() {
  const [selectedCategory, setSelectedCategory] = useState('milk-tea');
  
 
  const categories = [
    { id: 'milk-tea', name: 'Milk Tea' },
    { id: 'fruit-tea', name: 'Fruit Tea' },
    { id: 'slush', name: 'Slush' },
    { id: 'specialty', name: 'Specialty Drinks' }
  ];
  
  const menuItems = {
    'milk-tea': [
      { id: 1, name: 'Classic Milk Tea', price: 4.99 },
      { id: 2, name: 'Thai Milk Tea', price: 5.49 },
      { id: 3, name: 'Brown Sugar Milk Tea', price: 5.99 },
      { id: 4, name: 'Taro Milk Tea', price: 5.49 }
    ],
    'fruit-tea': [
      { id: 5, name: 'Peach Green Tea', price: 4.99 },
      { id: 6, name: 'Strawberry Tea', price: 5.49 },
      { id: 7, name: 'Lychee Tea', price: 5.49 },
      { id: 8, name: 'Mango Tea', price: 5.49 }
    ],
    'slush': [
      { id: 9, name: 'Mango Slush', price: 6.49 },
      { id: 10, name: 'Strawberry Slush', price: 6.49 },
      { id: 11, name: 'Matcha Slush', price: 6.99 },
      { id: 12, name: 'Taro Slush', price: 6.99 }
    ],
    'specialty': [
      { id: 13, name: 'Brown Sugar Boba Milk', price: 6.99 },
      { id: 14, name: 'Matcha Latte', price: 5.99 },
      { id: 15, name: 'Honey Dew Milk Tea', price: 5.99 },
      { id: 16, name: 'Oreo Milk Tea', price: 6.49 }
    ],
  };

  return (
    <div className="cashier-container">
      <header className="cashier-header">
        <h1>Boba Tea Shop</h1>
        <div className="order-summary">
          <h2>Current Order</h2>
          <div className="order-items-placeholder">
            No items added
          </div>
          <div className="order-total">
            Total: $0.00
          </div>
          <button className="checkout-btn">Checkout</button>
        </div>
      </header>

      <main className="cashier-main">
        <div className="menu-categories">
          {categories.map(category => (
            <button 
              key={category.id} 
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="menu-items">
          <h2>{categories.find(cat => cat.id === selectedCategory)?.name}</h2>
          <div className="items-grid">
            {menuItems[selectedCategory].map(item => (
              <div key={item.id} className="menu-item">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
                <button className="add-item-btn">Add to Order</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cashier;