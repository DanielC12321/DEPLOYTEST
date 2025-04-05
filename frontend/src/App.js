// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Cashier from './pages/cashier';
import Customer from './pages/customer';
import Login from './pages/login';
import ManagerInterface from './pages/ManagerInterface.tsx';
import Order from './pages/order.js'; // Import the FruitTea component
import Checkout from './pages/checkout.js';
import OrderConfirmation from './pages/confirmation.js';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/manager" element={<ManagerInterface />} />
          <Route path="/order/:categoryType" element={<Order />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path = "/order-confirmation" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
