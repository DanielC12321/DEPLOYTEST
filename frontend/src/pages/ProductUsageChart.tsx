import React, { useState } from 'react';
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface UsageData {
    ingredient_name: string;
    total_used: number;
}

const ProductUsageChart: React.FC = () => {
    // Set initial state dates. Adjust these defaults as needed.
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
        // Format dates to yyyy-MM-dd
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        const start_date = formatDate(startDate);
        const end_date = formatDate(endDate);

        try {
            const response = await fetch(`http://localhost:8001/product-usage-chart?start_date=${start_date}&end_date=${end_date}`);
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
        <div style={{ padding: '20px' }}>
            {/* Top Panel: Navigation and Date Selection */}
            <div style={{ marginBottom: '20px' }}>
                {/* Navigation Panel Placeholder */}
                <div style={{ marginBottom: '10px' }}>
                    <strong>Trend Navigation Bar (Placeholder)</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div>
                        <label>Start Date: </label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date!)}  // Ensuring a non-null value
                            dateFormat="yyyy-MM-dd"
                            maxDate={endDate}  // Optional: ensures start date is not after end date
                        />
                    </div>
                    <div>
                        <label>End Date: </label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date) => setEndDate(date!)}  // Ensuring a non-null value
                            dateFormat="yyyy-MM-dd"
                            minDate={startDate}  // Optional: ensures end date is not before start date
                        />
                    </div>
                    <button onClick={loadData}>Load Data</button>
                </div>
            </div>

            {/* Main Content: Table and Chart Side-by-Side */}
            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Data Table */}
                <div style={{ flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
                        <thead>
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
                <div style={{ flex: 1 }}>
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: false },
                                tooltip: { enabled: true },
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
            <div style={{ marginTop: '20px' }}>
                <label>Sort By: </label>
                <select value={sortOrder} onChange={handleSortChange}>
                    <option value="asc">Sort: Low to High</option>
                    <option value="desc">Sort: High to Low</option>
                </select>
            </div>
        </div>
    );
};

export default ProductUsageChart;
