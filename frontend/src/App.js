import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';
import Cashier from './pages/cashier';
import Customer from './pages/customer';
import Login from './pages/login';
import CashierCheckout from './pages/cashierCheckout';
import ManagerInterface from './pages/ManagerInterface.tsx';
import Order from './pages/order.js';
import Checkout from './pages/checkout.js';
import OrderConfirmation from './pages/confirmation.js';
import ProductUsageChart from "./pages/ProductUsageChart.tsx";
import SalesReport from "./pages/SalesReport.tsx";
import XReport from "./pages/XReport.tsx";
import ZReport from "./pages/ZReport.tsx";
import ManagerInventory from "./pages/managerInventory";
import ManagerEmployee from "./pages/managerEmployee";
import { XReportProvider } from './context/XReportContext.tsx';
import MenuBoard from "./pages/menuboard.js";
import { ChakraProvider } from '@chakra-ui/react';
import Account from './pages/account'; 
import ProtectedRoute from './pages/ProtectedRoute'; 

// Wrapper for Chakra-powered routes
function ChakraRoutes() {
    return (
        <div className="ck-reset">
            <ChakraProvider resetScope=":where(.ck-reset)">
                <Outlet />
            </ChakraProvider>
        </div>
    );
}

function App() {
  return (
      <Router>
          <div className="App">
              <Routes>
                  {/* Redirect landing */}
                  <Route path="/" element={<Navigate to="/login" />} />

                  {/* Public routes - no authentication required */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/menuboard" element={<MenuBoard />} />
                  
                  {/* Protected routes - Manager only */}
                  <Route path="/manager/inventory" element={
                      <ProtectedRoute requiredRole="manager">
                          <ManagerInventory />
                      </ProtectedRoute>
                  } />
                  <Route path="/manager/employees" element={
                      <ProtectedRoute requiredRole="manager">
                          <ManagerEmployee />
                      </ProtectedRoute>
                  } />
                  
                  {/* Protected Chakra routes - Manager only */}
                  <Route element={<ChakraRoutes />}>
                    <Route path="/manager" element={
                        <ProtectedRoute requiredRole="manager">
                            <ManagerInterface />
                        </ProtectedRoute>
                    } />
                      <Route path="/manager/productusagechart" element={
                          <ProtectedRoute requiredRole="manager">
                              <ProductUsageChart />
                          </ProtectedRoute>
                      } />
                      <Route path="/manager/salesreport" element={
                          <ProtectedRoute requiredRole="manager">
                              <SalesReport />
                          </ProtectedRoute>
                      } />
                      <Route path="/manager/xreport" element={
                          <ProtectedRoute requiredRole="manager">
                              <XReportProvider>
                                  <XReport />
                              </XReportProvider>
                          </ProtectedRoute>
                      } />
                      <Route path="/manager/zreport" element={
                          <ProtectedRoute requiredRole="manager">
                              <XReportProvider>
                                  <ZReport />
                              </XReportProvider>
                          </ProtectedRoute>
                      } />
                  </Route>
                  
                  {/* Protected routes - Cashier only */}
                  <Route path="/cashier" element={
                      <ProtectedRoute requiredRole="cashier">
                          <Cashier />
                      </ProtectedRoute>
                  } />
                  <Route path="/cashierCheckout" element={
                      <ProtectedRoute requiredRole="cashier">
                          <CashierCheckout />
                      </ProtectedRoute>
                  } />
                  
                  {/* Protected routes - Any authenticated user */}
                  <Route path="/account" element={
                      <ProtectedRoute>
                          <Account />
                      </ProtectedRoute>
                  } />
                  
                  {/* Customer routes - No specific role required */}
                  <Route path="/customer" element={<Customer />} />
                  <Route path="/order/:categoryType" element={<Order />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;