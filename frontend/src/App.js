// App.js
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
                    <Route path="/" element={<Navigate to="/order/pure-teas" />} />

                    {/* Public / pure-CSS route */}
                    <Route path="/manager/inventory" element={<ManagerInventory />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cashier" element={<Cashier />} />
                    <Route path="/customer" element={<Customer />} />
                    <Route path="/cashierCheckout" element={<CashierCheckout />} />
                    <Route path="/order/:categoryType" element={<Order />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/menuboard" element={<MenuBoard />} />
                    <Route path="/manager/employees" element={<ManagerEmployee />} />

                    {/* All other routes get Chakra's reset & theme */}
                    <Route element={<ChakraRoutes />}>
                        <Route path="/manager" element={<ManagerInterface />} />
                        <Route path="/manager/productusagechart" element={<ProductUsageChart />} />
                        <Route path="/manager/salesreport" element={<SalesReport />} />
                        <Route
                            path="/manager/xreport"
                            element={
                                <XReportProvider>
                                    <XReport />
                                </XReportProvider>
                            }
                        />
                        <Route
                            path="/manager/zreport"
                            element={
                                <XReportProvider>
                                    <ZReport />
                                </XReportProvider>
                            }
                        />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;