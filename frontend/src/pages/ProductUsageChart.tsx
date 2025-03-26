// ProductUsageChart.tsx
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

/*
  // TODO: Remove the SQL query and credentials eventually once a backend is available.
  const DB_URL = "jdbc:postgresql://csce-315-db.engr.tamu.edu/team_40_db";
  const DB_USER = "team_40";
  const DB_PASSWORD = "pearlprodigy";

  const sqlQuery = `
      WITH product_usage AS (
          SELECT
              pi.ingredientid,
              SUM(cp.quantity * pi.quantity_required) AS total_used
          FROM customer_order co
          JOIN customer_product cp ON co.order_id = cp.order_id
          JOIN product_ingredient pi ON cp.product_id = pi.product_id
          WHERE co.datetime BETWEEN ? AND ?
          GROUP BY pi.ingredientid
      )
      SELECT
          i.name AS ingredient_name,
          pu.total_used
      FROM product_usage pu
      JOIN ingredients i ON pu.ingredientid = i.ingredientid
      ORDER BY i.name;
  `;

  // Original API call code:
  // const response = await fetch(`/api/productUsage?start=${start}&end=${end}`);
  // if (!response.ok) { throw new Error('Network response was not ok'); }
  // const jsonData: UsageData[] = await response.json();
*/

const ProductUsageChart: React.FC = () => {
    // Set initial state dates. Adjust these defaults as needed.
    const [startDate, setStartDate] = useState<Date>(new Date('2024-01-01'));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [data, setData] = useState<UsageData[]>([]);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });

    // Simulated function to mimic a backend API call that returns hardcoded data.
    // This data is based on the SQL query provided.
    const simulateLoadData = (start: string, end: string): UsageData[] => {
        // For example purposes only.
        return [
            { ingredient_name: 'Flour', total_used: 120 },
            { ingredient_name: 'Sugar', total_used: 80 },
            { ingredient_name: 'Eggs', total_used: 200 },
            { ingredient_name: 'Butter', total_used: 50 },
        ];
    };

    // Fetch data (simulated) and update the chart
    const loadData = async () => {
        // Format dates to yyyy-MM-dd
        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        const start = formatDate(startDate);
        const end = formatDate(endDate);

        try {
            // Uncomment and use the following code when backend is available.
            /*
            const response = await fetch(`/api/productUsage?start=${start}&end=${end}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const jsonData: UsageData[] = await response.json();
            */

            // For now, we use simulated data:
            const jsonData: UsageData[] = simulateLoadData(start, end);

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
