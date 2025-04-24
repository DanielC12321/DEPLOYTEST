import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    Flex,
    Heading,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Input,
    useColorModeValue,
} from '@chakra-ui/react';
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
    const [sortBy, setSortBy] = useState<'quantity' | 'sales'>('quantity');

    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const loadData = async () => {
        const apiUrl = process.env.REACT_APP_API_URL;
        const qs = `?start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}`;

        try {
            const res = await fetch(`${apiUrl}/sales-report${qs}`);
            const jsonData: SalesData[] = await res.json();
            const sorted = sortData(jsonData, sortOrder, sortBy);
            setData(sorted);
            updateChart(sorted);
        } catch (err) {
            console.error(err);
            alert('Error loading data');
        }
    };

    useEffect(() => {
        loadData();
    }, [startDate, endDate]);

    const updateChart = (arr: SalesData[]) => {
        setChartData({
            labels: arr.map(d => d.product_name),
            datasets: [
                {
                    label: 'Total Quantity Sold',
                    data: arr.map(d => d.total_quantity_sold),
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                },
                {
                    label: 'Total Sales ($)',
                    data: arr.map(d => d.total_sales),
                    backgroundColor: 'rgba(153,102,255,0.4)',
                    borderColor: 'rgba(153,102,255,1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    const sortData = (
        arr: SalesData[],
        order: 'asc' | 'desc',
        by: 'quantity' | 'sales'
    ) => {
        return [...arr].sort((a, b) => {
            const aVal = by === 'quantity' ? a.total_quantity_sold : a.total_sales;
            const bVal = by === 'quantity' ? b.total_quantity_sold : b.total_sales;
            return order === 'asc' ? aVal - bVal : bVal - aVal;
        });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [by, order] = e.target.value.split('-') as [
                'quantity' | 'sales',
                'asc' | 'desc'
        ];
        setSortBy(by);
        setSortOrder(order);
        const sorted = sortData(data, order, by);
        setData(sorted);
        updateChart(sorted);
    };

    return (
        <Box p={4}>
            {/* Navbar */}
            <Flex
                direction="column"
                position="fixed"
                top={0}
                left={0}
                right={0}
                bg="white"
                zIndex={1000}
                p={4}
                borderBottom="1px"
                borderColor="gray.200"
            >
                <Flex gap={3} justify="center" flexWrap="wrap">
                    <Link to="/manager">
                        <Button size="sm" colorScheme="blue" variant="solid">
                            Back to Manager
                        </Button>
                    </Link>
                    <Link to="/manager/productusagechart">
                        <Button size="sm" colorScheme="teal" variant="outline">
                            Product Usage Chart
                        </Button>
                    </Link>
                    <Link to="/manager/salesreport">
                        <Button size="sm" colorScheme="teal" variant="solid">
                            Sales Report
                        </Button>
                    </Link>
                    <Link to="/manager/xreport">
                        <Button size="sm" colorScheme="teal" variant="outline">
                            X Report
                        </Button>
                    </Link>
                    <Link to="/manager/zreport">
                        <Button size="sm" colorScheme="teal" variant="outline">
                            Z Report
                        </Button>
                    </Link>
                    <Link to="/manager/inventory">
                        <Button size="sm" colorScheme="teal" variant="outline">
                            Inventory
                        </Button>
                    </Link>
                </Flex>

                {/* Date Pickers + Sort */}
                <Flex gap={4} justify="center" align="center" mt={4} flexWrap="wrap">
                    <Box>
                        <Text fontSize="sm">Start Date</Text>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date!)}
                            dateFormat="yyyy-MM-dd"
                            maxDate={endDate}
                            customInput={<Input size="sm" variant="outline" />}
                        />
                    </Box>
                    <Box>
                        <Text fontSize="sm">End Date</Text>
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date!)}
                            dateFormat="yyyy-MM-dd"
                            minDate={startDate}
                            customInput={<Input size="sm" variant="outline" />}
                        />
                    </Box>
                    <Box>
                        <Text fontSize="sm">Sort By</Text>
                        <Select
                            size="sm"
                            variant="outline"
                            value={`${sortBy}-${sortOrder}`}
                            onChange={handleSortChange}
                        >
                            <option value="quantity-asc">Qty: Low → High</option>
                            <option value="quantity-desc">Qty: High → Low</option>
                            <option value="sales-asc">Sales: Low → High</option>
                            <option value="sales-desc">Sales: High → Low</option>
                        </Select>
                    </Box>
                </Flex>
            </Flex>

            {/* Title */}
            <Box mt="160px" textAlign="center">
                <Heading size="lg">Sales Report</Heading>
            </Box>

            {/* Content */}
            <Flex direction={['column', 'row']} gap={6} mt={6}>
                {/* Data Table */}
                <Box
                    flex={1}
                    overflowY="auto"
                    maxH="400px"
                    borderWidth={1}
                    borderRadius="md"
                    p={2}
                >
                    <Table size="sm" variant="simple">
                        <Thead
                            position="sticky"
                            top={0}
                            bg={useColorModeValue('gray.100', 'gray.700')}
                            zIndex={1}
                        >
                            <Tr>
                                <Th>Product Name</Th>
                                <Th isNumeric>Total Qty</Th>
                                <Th isNumeric>Total Sales</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((row, i) => (
                                <Tr key={i}>
                                    <Td>{row.product_name}</Td>
                                    <Td isNumeric>{row.total_quantity_sold}</Td>
                                    <Td isNumeric>${row.total_sales}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {/* Chart */}
                <Box flex={1} height="500px">
                    <Bar
                        data={chartData}
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
                                x: {
                                    ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
                                },
                            },
                        }}
                    />
                </Box>
            </Flex>
        </Box>
    );
};

export default SalesReport;
