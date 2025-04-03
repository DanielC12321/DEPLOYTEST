import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import the external setXReportZeroed function from the X Report module
import { setXReportZeroed } from './XReport.tsx';

interface ZReportSalesData {
    sales: number;
    total_tax: number;
}

interface ZReportPaymentMethod {
    payment_method: string | null;
    total: number;
}

interface ZReportAdjustments {
    discounts: number;
    voids: number;
    service_charges: number;
}

interface EmployeeSignature {
    employee_name: string;
    signature: string; // If you have an image or signature data, otherwise empty string
}

const ZReport: React.FC = () => {
    // Set default dates (using a fixed start date and today's date for end)
    const today = new Date();
    const [startDate, setStartDate] = useState<Date>(new Date("2025-02-18"));
    const [endDate, setEndDate] = useState<Date>(today);
    const [salesData, setSalesData] = useState<ZReportSalesData>({ sales: 0, total_tax: 0 });
    const [paymentMethods, setPaymentMethods] = useState<ZReportPaymentMethod[]>([]);
    const [adjustments, setAdjustments] = useState<ZReportAdjustments>({ discounts: 0, voids: 0, service_charges: 0 });
    const [employeeSignatures, setEmployeeSignatures] = useState<EmployeeSignature[]>([]);

    const apiUrl = process.env.REACT_APP_API_URL;

    // Helper function to format a payment method name consistently.
    const formatPaymentMethod = (method: string | null): string => {
        if (!method) return "N/A";
        const lower = method.toLowerCase();
        if (lower === 'amex') return "Amex";
        if (lower === 'cash') return "Cash";
        if (lower === 'debit') return "Debit";
        if (lower === 'giftcard') return "Gift Card";
        if (lower === 'mastercard') return "Mastercard";
        if (lower === 'visa') return "Visa";
        return "N/A";
    };

    const loadZReportData = async () => {
        try {
            // Convert dates to the proper format (YYYY-MM-DD)
            const start = "2025-02-17";
            const end = endDate.toISOString().split('T')[0];

            // Sales & Tax Endpoint
            const salesResponse = await fetch(`${apiUrl}/z-report-sales-tax?start_date=${start}&end_date=${end}`);
            const salesJson = await salesResponse.json();
            if (salesJson && salesJson.length > 0) {
                const data = salesJson[0];
                setSalesData({
                    sales: parseFloat(data.sales),
                    total_tax: parseFloat(data.total_tax),
                });
            } else {
                setSalesData({ sales: 0, total_tax: 0 });
            }

            // Payment Methods Endpoint
            const paymentResponse = await fetch(`${apiUrl}/z-report-payment-methods?start_date=${start}&end_date=${end}`);
            const paymentJson = await paymentResponse.json();
            if (paymentJson && Array.isArray(paymentJson)) {
                setPaymentMethods(
                    paymentJson.map((pm: any) => ({
                        payment_method: pm.payment_method,
                        total: parseFloat(pm.amount),
                    }))
                );
            } else {
                setPaymentMethods([]);
            }

            // Adjustments Endpoint (discounts, voids, service charges)
            const adjustmentsResponse = await fetch(`${apiUrl}/z-report-adjustments?start_date=${start}&end_date=${end}`);
            const adjustmentsJson = await adjustmentsResponse.json();
            if (adjustmentsJson && adjustmentsJson.length > 0) {
                const adj = adjustmentsJson[0];
                setAdjustments({
                    discounts: parseFloat(adj.discounts),
                    voids: parseFloat(adj.voids),
                    service_charges: parseFloat(adj.service_charges),
                });
            } else {
                setAdjustments({ discounts: 0, voids: 0, service_charges: 0 });
            }

            // Cashier Names Endpoint (treated as employee signatures)
            const signaturesResponse = await fetch(`${apiUrl}/z-report-manager-names?start_date=${start}&end_date=${end}`);
            const signaturesJson = await signaturesResponse.json();
            if (signaturesJson && Array.isArray(signaturesJson)) {
                setEmployeeSignatures(
                    signaturesJson.map((emp: any) => ({
                        employee_name: emp.name,
                        signature: '', // Replace with signature data if available
                    }))
                );
            } else {
                setEmployeeSignatures([]);
            }

            // Zero out the X Report.
            setXReportZeroed(true);
        } catch (error) {
            console.error('Error loading Z Report data:', error);
            alert('Error loading Z Report data');
        }
    };

    // Automatically run the report when the component mounts.
    useEffect(() => {
        loadZReportData();
    }, []);

    // Define the fixed payment methods we want to display.
    const paymentMethodsList = ["Amex", "Cash", "Debit", "Gift Card", "Mastercard", "Visa", "N/A"];

    return (
        <div>
            {/* Fixed header with navigation and controls */}
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    zIndex: 1000,
                    padding: '10px',
                    borderBottom: '1px solid #ccc',
                }}
            >
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Link to="/manager">
                        <button>Back to Manager</button>
                    </Link>
                    <Link to="/manager/productusagechart">
                        <button>Product Usage Chart</button>
                    </Link>
                    <Link to="/manager/salesreport">
                        <button>Sales Report</button>
                    </Link>
                    <Link to="/manager/xreport">
                        <button>X Report</button>
                    </Link>
                    <Link to="/manager/zreport">
                        <button>Z Report</button>
                    </Link>
                    <Link to="/manager/inventory">
                        <button>Inventory</button>
                    </Link>
                </div>

                {/* Centered date pickers and Run button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
                    <div>
                        <label>Start Date: </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date)}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <div>
                        <label>End Date: </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date) => setEndDate(date)}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <button onClick={loadZReportData}>Run Z Report</button>
                </div>
            </header>

            <div style={{ marginTop: '100px', textAlign: 'center' }}>
                <h1>Z Report</h1>
                <p>
                    <strong>Start Date:</strong> {"2025-02-17"}
                </p>
                <p>
                    <strong>End Date:</strong> {endDate.toISOString().split('T')[0]}
                </p>
            </div>

            {/* Three-column layout */}
            <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
                {/* Left Column: Single container for Adjustments and Payment Methods */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                    {/* Adjustments Section */}
                    <section style={{ marginBottom: '10px' }}>
                        <h2>Adjustments</h2>
                        <p>
                            <strong>Discounts:</strong> ${adjustments.discounts !== undefined ? adjustments.discounts.toFixed(2) : '0.00'}
                        </p>
                        <p>
                            <strong>Voids:</strong> ${adjustments.voids !== undefined ? adjustments.voids.toFixed(2) : '0.00'}
                        </p>
                        <p>
                            <strong>Service Charges:</strong> ${adjustments.service_charges !== undefined ? adjustments.service_charges.toFixed(2) : '0.00'}
                        </p>
                    </section>
                    <hr style={{ margin: '10px 0' }} />
                    {/* Payment Methods Section */}
                    <section>
                        <h2>Payment Methods</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
                            <thead>
                            <tr>
                                <th>Method</th>
                                <th>Total ($)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paymentMethodsList.map((methodName, index) => {
                                // Find the matching payment method (using our helper for consistency)
                                const found = paymentMethods.find(pm => formatPaymentMethod(pm.payment_method) === methodName);
                                return (
                                    <tr key={index}>
                                        <td>{methodName}</td>
                                        <td>${found ? found.total.toFixed(2) : "0.00"}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </section>
                </div>

                {/* Middle Column: Sales & Tax Information */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                    <h2>Sales & Tax Information</h2>
                    <p>
                        <strong>Total Sales:</strong> ${salesData.sales !== undefined ? salesData.sales.toFixed(2) : '0.00'}
                    </p>
                    <p>
                        <strong>Total Tax:</strong> ${salesData.total_tax !== undefined ? (salesData.total_tax / 100).toFixed(2) : '0.00'}
                    </p>
                </div>

                {/* Right Column: Employee Signatures */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                    <h2>Employee Signatures</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
                        <thead>
                        <tr>
                            <th>Employee Signature</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employeeSignatures.map((emp, index) => (
                            <tr key={index}>
                                <td>{emp.employee_name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ZReport;
