// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Cashier from './pages/cashier';
import Customer from './pages/customer';
// Import the manager interface component (update the path if needed)
import ManagerInterface from './pages/ManagerInterface.tsx';

function App() {
  return (
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li>
                <Link to="/cashier">Cashier</Link>
              </li>
              <li>
                <Link to="/customer">Customer</Link>
              </li>
              <li>
                <Link to="/manager">Manager</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/cashier" element={<Cashier />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/manager" element={<ManagerInterface />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
