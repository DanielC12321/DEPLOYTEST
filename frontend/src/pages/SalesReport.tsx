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

interface SalesData {
    product_name: string;
    total_quantity_sold: number;
    total_sales: number;
}

const SalesReport: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(new Date('2025-02-01'));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [data, setData] = useState<SalesData[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortBy, setSortBy] = useState<'quantity' | 'sales'>('quantity'); // Sort by quantity or sales

    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });

    // Fetch data from API and update the chart
    const loadData = async () => {
        const apiUrl = process.env.REACT_APP_API_URL;

        // Format dates to yyyy-MM-dd
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        const start_date = formatDate(startDate);
        const end_date = formatDate(endDate);

        try {
            const response = await fetch(`${apiUrl}/sales-report?start_date=${start_date}&end_date=${end_date}`);
            const jsonData: SalesData[] = await response.json();

            // Optionally sort data based on current sortOrder
            const sortedData = sortData(jsonData, sortOrder);
            setData(sortedData);
            updateChart(sortedData);
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading data');
        }
    };

    useEffect(() => {
        loadData();
    }, []); // Run once on component mount

    // Update chart dataset based on new data
    const updateChart = (salesData: SalesData[]) => {
        const labels = salesData.map(item => item.product_name);
        const quantitySoldValues = salesData.map(item => item.total_quantity_sold);
        const salesValues = salesData.map(item => item.total_sales);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Total Quantity Sold',
                    data: quantitySoldValues,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                },
                {
                    label: 'Total Sales ($)',
                    data: salesValues,
                    backgroundColor: 'rgba(153,102,255,0.4)',
                    borderColor: 'rgba(153,102,255,1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    // Sort the data based on the selected order
    const sortData = (salesData: SalesData[], order: 'asc' | 'desc', by: 'quantity' | 'sales') => {
        return [...salesData].sort((a, b) => {
            const aValue = by === 'quantity' ? a.total_quantity_sold : a.total_sales;
            const bValue = by === 'quantity' ? b.total_quantity_sold : b.total_sales;

            return order === 'asc' ? aValue - bValue : bValue - aValue;
        });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [by, order] = e.target.value.split('-') as ['quantity' | 'sales', 'asc' | 'desc'];
        setSortBy(by);
        setSortOrder(order);
        const sortedData = sortData(data, order, by);
        setData(sortedData);
        updateChart(sortedData);
    };

    return (
        <div>
            {/* Static Navbar */}
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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
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
                    <Link to="/manager/inventory">
                        <button>Inventory</button>
                    </Link>
                </div>

                {/* Date Pickers */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <div>
                        <label>Start Date: </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date!)}
                            dateFormat="yyyy-MM-dd"
                            maxDate={endDate}
                        />
                    </div>
                    <div>
                        <label>End Date: </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date) => setEndDate(date!)}
                            dateFormat="yyyy-MM-dd"
                            minDate={startDate}
                        />
                    </div>
                    <button onClick={loadData}>Load Data</button>
                </div>
            </header>

            {/* Page Title */}
            <div style={{ marginTop: '100px', textAlign: 'center' }}>
                <h1>Sales Report</h1>
            </div>

            {/* Main Content - with top margin to avoid overlap */}
            <div style={{ marginTop: '20px', padding: '10px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Data Table */}
                    <div style={{ flex: 1, maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10 }}>
                            <tr>
                                <th>Product Name</th>
                                <th>Total Quantity Sold</th>
                                <th>Total Sales ($)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.product_name}</td>
                                    <td>{row.total_quantity_sold}</td>
                                    <td>${row.total_sales}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bar Chart */}
                    <div style={{ flex: 1, height: '500px' }}>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: true },
                                    tooltip: { enabled: true },
                                    zoom: {
                                        pan: {
                                            enabled: true,
                                            mode: 'x',
                                        },
                                        zoom: {
                                            wheel: { enabled: true },
                                            pinch: { enabled: true },
                                            mode: 'x',
                                        },
                                    },
                                },
                                scales: {
                                    y: { beginAtZero: true },
                                    x: {
                                        ticks: {
                                            autoSkip: false,
                                            maxRotation: 45,
                                            minRotation: 45,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Sort Panel */}
                <div style={{marginTop: '20px'}}>
                    <label>Sort By: </label>
                    <select value={`${sortBy}-${sortOrder}`} onChange={handleSortChange}>
                        <option value="quantity-asc">Sort by Quantity: Low to High</option>
                        <option value="quantity-desc">Sort by Quantity: High to Low</option>
                        <option value="sales-asc">Sort by Sales: Low to High</option>
                        <option value="sales-desc">Sort by Sales: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SalesReport;
