// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Cashier from './pages/cashier';
import Customer from './pages/customer';
import Login from './pages/login';
import ManagerInterface from './pages/ManagerInterface.tsx';
import FruitTea from './pages/fruit-teas.js'; // Import the FruitTea component
import MilkTea from './pages/milk-teas.js'; // Import the MilkTea component
import PureTea from './pages/pure-teas.js'; // Import the PureTea component
import Specialty from './pages/specialty.js'; // Import the Specialty component
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
          <Route path="/fruit-teas" element={<FruitTea />} />
          <Route path="/milk-teas" element={<MilkTea />} />
          <Route path="/pure-teas" element={<PureTea />} />
          <Route path="/specialty" element={<Specialty />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
