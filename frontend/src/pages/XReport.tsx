import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register Chart.js components and the zoom plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, zoomPlugin);

interface XReportData {
    hour: number;
    sales: number;
    paymentMethodBreakdown: { [key: string]: number };
}

/**
 * Converts a raw hour to a formatted time string.
 * Mapping: displayHour = rawHour + 3, then converted to 12-hour format.
 * E.g., raw hour 4 becomes "7 am", raw hour 5 becomes "8 am".
 */
const convertHour = (rawHour: number): string => {
    let newHour = rawHour + 3;
    let period = "am";
    if (newHour >= 12) {
        period = "pm";
        if (newHour > 12) {
            newHour = newHour - 12;
        }
    }
    return `${newHour} ${period}`;
};

/**
 * Formats a payment method string with proper capitalization.
 */
const formatPaymentMethod = (method: string): string => {
    switch (method.toLowerCase()) {
        case "amex":
            return "Amex";
        case "debit":
            return "Debit";
        case "giftcard":
            return "Gift Card";
        case "visa":
            return "Visa";
        case "mastercard":
            return "MasterCard";
        case "cash":
            return "Cash";
        default:
            return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
    }
};

/**
 * Exported setter function that external classes (like Z Report) can call
 * to zero out (or unzero) the X Report.
 */
export let setXReportZeroed: (zero: boolean) => void = () => {};

const XReport: React.FC = () => {
    const [currentDay, setCurrentDay] = useState<string>("02-17-2025");
    const [currentHour, setCurrentHour] = useState<number>(14);
    const [reportData, setReportData] = useState<XReportData[]>([]);
    const [adjustmentsData, setAdjustmentsData] = useState<any>({ returns: 0, voids: 0, discards: 0 });
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    // Flag to determine if the X report is zeroed out.
    const [isZeroed, setIsZeroed] = useState<boolean>(false);

    // Expose the setter so external modules can control the zero flag.
    useEffect(() => {
        setXReportZeroed = setIsZeroed;
    }, []);

    // When the report becomes unzeroed, reload data automatically.
    useEffect(() => {
        if (!isZeroed) {
            loadData();
        }
    }, [isZeroed]);

    // Fetch data from API and update the chart
    const loadData = async () => {
        // If the report is zeroed out, skip data loading.
        if (isZeroed) return;
        const apiUrl = process.env.REACT_APP_API_URL;

        try {
            // Fetch hourly sales data
            const salesResponse = await fetch(`${apiUrl}/x-report-sales?current_day=${currentDay}&current_hour=${currentHour}`);
            const salesData = await salesResponse.json();

            // Fetch adjustments data (returns, voids, discards)
            const adjustmentsResponse = await fetch(`${apiUrl}/x-report-adjustments?current_day=${currentDay}&current_hour=24`);
            const adjustments = await adjustmentsResponse.json();
            // If adjustments is an array, use the first element
            const parsedAdjustments = Array.isArray(adjustments) && adjustments.length > 0
                ? adjustments[0]
                : adjustments;
            setAdjustmentsData(parsedAdjustments);

            // Fetch payment method breakdown
            const paymentResponse = await fetch(`${apiUrl}/x-report-payment-methods?current_day=${currentDay}&current_hour=24`);
            const paymentData = await paymentResponse.json();
            setPaymentMethods(paymentData);

            // Combine data into one report
            const combinedData = salesData.map((item: any) => {
                const hourData = {
                    hour: item.hour,
                    sales: item.sales,
                    paymentMethodBreakdown: paymentData.reduce((acc: any, curr: any) => {
                        acc[curr.payment_method] = curr.total;
                        return acc;
                    }, {}),
                };
                return hourData;
            });

            setReportData(combinedData);
            updateChart(combinedData);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading data');
        }
    };

    useEffect(() => {
        loadData();
    }, []); // Run once on component mount

    // Update chart dataset based on new data (excluding adjustments data)
    const updateChart = (data: XReportData[]) => {
        // Use the helper function to format the hour labels.
        const labels = data.map(item => convertHour(item.hour));
        const salesValues = data.map(item => item.sales);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Sales ($)',
                    data: salesValues,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    // Prepare displayed data based on the zero flag.
    const displayedReportData = isZeroed ? [] : reportData;
    const displayedAdjustments = isZeroed ? { returns: 0, voids: 0, discards: 0 } : adjustmentsData;
    const displayedChartData = isZeroed ? { labels: [], datasets: [] } : chartData;
    const displayedPaymentMethods = isZeroed ? [] : paymentMethods;

    return (
        <div>
            {/* Static Navbar */}
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                zIndex: 1000,
                padding: '10px',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Button Container */}
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
                </div>

                {/* Controls: Date Picker, Load Data, and Unzero button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <div>
                        <label>Current Day: </label>
                        <DatePicker
                            selected={new Date(currentDay)}
                            onChange={(date: Date) => setCurrentDay(date!.toISOString().split('T')[0])}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <button onClick={loadData}>Load Data</button>
                    <button onClick={() => setIsZeroed(false)}>Reset X Report</button>
                </div>
            </header>

            {/* Page Title */}
            <div style={{ marginTop: '100px', textAlign: 'center' }}>
                <h1>X Report</h1>
            </div>

            {/* Main Content: Three Columns (Receipt, Table, Chart) */}
            <div style={{ display: 'flex', gap: '20px', padding: '10px' }}>
                {/* Left Column: Receipt (Adjustments & Payment Methods) */}
                <div style={{
                    flex: 1,
                    minWidth: '250px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f9f9f9',
                    padding: '10px'
                }}>
                    <h3>Adjustments</h3>
                    <p><strong>Returns:</strong> ${displayedAdjustments.returns}</p>
                    <p><strong>Voids:</strong> ${displayedAdjustments.voids}</p>
                    <p><strong>Discards:</strong> ${displayedAdjustments.discards}</p>
                    <hr style={{ margin: '20px 0' }} />
                    <h3>Payment Methods</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
                        <thead>
                        <tr>
                            <th>Method</th>
                            <th>Total ($)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayedPaymentMethods.map((method, index) => (
                            <tr key={index}>
                                <td>{formatPaymentMethod(method.payment_method)}</td>
                                <td>${method.total}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Center Column: Data Table */}
                <div style={{ flex: 1, minWidth: '250px', maxHeight: '500px', overflowY: 'auto', border: '1px solid #ccc' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
                        <thead>
                        <tr>
                            <th>Time</th>
                            <th>Sales ($)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayedReportData.map((row, index) => (
                            <tr key={index}>
                                <td>{convertHour(row.hour)}</td>
                                <td>${row.sales}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Right Column: Bar Chart */}
                <div style={{ flex: 1, minWidth: '250px', height: '500px', border: '1px solid #ccc', padding: '10px' }}>
                    <Bar
                        data={displayedChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: true },
                                tooltip: { enabled: true },
                                zoom: {
                                    pan: { enabled: true, mode: 'x' },
                                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
                                },
                            },
                            scales: {
                                y: { beginAtZero: true },
                                x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 } },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default XReport;
