// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Cashier from './pages/cashier';
import Customer from './pages/customer';
import Login from './pages/login';
import ManagerInterface from './pages/ManagerInterface.tsx';
import ProductUsageChart from "./pages/ProductUsageChart.tsx";
import SalesReport from "./pages/SalesReport.tsx";
import XReport from "./pages/XReport.tsx";

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
          <Route path="/manager/productusagechart" element={<ProductUsageChart />} />
          <Route path="/manager/salesreport" element={<SalesReport />} />
          <Route path="/manager/xreport" element={<XReport />} />
          <Route path="/manager/zreport" element={<ProductUsageChart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
