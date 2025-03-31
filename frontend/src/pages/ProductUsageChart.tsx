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

interface UsageData {
    ingredient_name: string;
    total_used: number;
}

const ProductUsageChart: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>(new Date('2025-02-01'));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [data, setData] = useState<UsageData[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
            const response = await fetch(`${apiUrl}/product-usage-chart?start_date=${start_date}&end_date=${end_date}`);
            const jsonData: UsageData[] = await response.json();

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
    const updateChart = (usageData: UsageData[]) => {
        const labels = usageData.map(item => item.ingredient_name);
        const values = usageData.map(item => item.total_used);
        setChartData({
            labels,
            datasets: [
                {
                    label: 'Total Used',
                    data: values,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    // Sort the data based on the selected order
    const sortData = (usageData: UsageData[], order: 'asc' | 'desc') => {
        return [...usageData].sort((a, b) =>
            order === 'asc' ? a.total_used - b.total_used : b.total_used - a.total_used
        );
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const order = e.target.value as 'asc' | 'desc';
        setSortOrder(order);
        const sortedData = sortData(data, order);
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
                <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
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

                {/* Date Pickers */}
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px'}}>
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
            <div style={{marginTop: '100px', textAlign: 'center'}}>
                <h1>Product Usage Chart</h1>
            </div>

            {/* Main Content - with top margin to avoid overlap */}
            <div style={{marginTop: '20px', padding: '10px'}}>
                <div style={{display: 'flex', gap: '20px'}}>
                    {/* Data Table */}
                    <div style={{flex: 1, maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse'}} border={1}>
                            <thead style={{position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 10}}>
                            <tr>
                                <th>Ingredient Name</th>
                                <th>Total Used</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.ingredient_name}</td>
                                    <td>{row.total_used}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bar Chart */}
                    <div style={{flex: 1, height: '500px'}}>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {display: false},
                                    tooltip: {enabled: true},
                                    zoom: {
                                        pan: {
                                            enabled: true,
                                            mode: 'x',
                                        },
                                        zoom: {
                                            wheel: {enabled: true},
                                            pinch: {enabled: true},
                                            mode: 'x',
                                        },
                                    },
                                },
                                scales: {
                                    y: {beginAtZero: true},
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
                    <select value={sortOrder} onChange={handleSortChange}>
                        <option value="asc">Sort: Low to High</option>
                        <option value="desc">Sort: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ProductUsageChart;
