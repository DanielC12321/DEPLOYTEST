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
    useColorModeValue,
    Input,
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

    const loadData = async () => {
        const apiUrl = process.env.REACT_APP_API_URL;

        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        const start_date = formatDate(startDate);
        const end_date = formatDate(endDate);

        try {
            const response = await fetch(`${apiUrl}/product-usage-chart?start_date=${start_date}&end_date=${end_date}`);
            const jsonData: UsageData[] = await response.json();

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
    }, [startDate, endDate]);

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
                        <Button size="sm" colorScheme="blue" variant="solid">Back to Manager</Button>
                    </Link>
                    <Link to="/manager/productusagechart">
                        <Button size="sm" colorScheme="teal" variant="solid">Product Usage Chart</Button>
                    </Link>
                    <Link to="/manager/salesreport">
                        <Button size="sm" colorScheme="teal" variant="outline">Sales Report</Button>
                    </Link>
                    <Link to="/manager/xreport">
                        <Button size="sm" colorScheme="teal" variant="outline">X Report</Button>
                    </Link>
                    <Link to="/manager/zreport">
                        <Button size="sm" colorScheme="teal" variant="outline">Z Report</Button>
                    </Link>
                    <Link to="/manager/inventory">
                        <Button size="sm" colorScheme="teal" variant="outline">Inventory</Button>
                    </Link>
                    <Link to="/account">
                        <Button size="sm" colorScheme="teal" variant="outline">Account</Button>
                    </Link>
                </Flex>

                {/* Date Pickers */}
                <Flex gap={4} justify="center" align="center" mt={4} flexWrap="wrap">
                    <Box>
                        <Text fontSize="sm">Start Date</Text>
                        <DatePicker
                            selected={startDate}
                            onChange={(date: Date) => setStartDate(date!)}
                            dateFormat="yyyy-MM-dd"
                            maxDate={endDate}
                            customInput={<Input size="sm" variant="outline" />}
                        />
                    </Box>
                    <Box>
                        <Text fontSize="sm">End Date</Text>
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date) => setEndDate(date!)}
                            dateFormat="yyyy-MM-dd"
                            minDate={startDate}
                            customInput={<Input size="sm" variant="outline" />}
                        />
                    </Box>
                    <Box>
                        <Text fontSize="sm">Sort By</Text>
                        <Select size="sm" variant="outline" value={sortOrder} onChange={handleSortChange}>
                        <option value="asc">Low to High</option>
                        <option value="desc">High to Low</option>
                        </Select>
                    </Box>
                </Flex>
            </Flex>

            {/* Content */}
            <Box mt="160px" textAlign="center">
                <Heading size="lg">Product Usage Chart</Heading>
            </Box>

            <Flex direction={['column', 'row']} gap={6} mt={6}>
                {/* Table */}
                <Box flex={1} overflowY="auto" maxH="400px" borderWidth={1} borderRadius="md" p={2}>
                    <Table size="sm" variant="simple">
                        <Thead position="sticky" top={0} bg={useColorModeValue('gray.100', 'gray.700')} zIndex={1}>
                            <Tr>
                                <Th>Ingredient Name</Th>
                                <Th>Total Used</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((row, index) => (
                                <Tr key={index}>
                                    <Td>{row.ingredient_name}</Td>
                                    <Td>{row.total_used}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {/* Bar Chart */}
                <Box flex={1} height="500px">
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: { enabled: true },
                                zoom: {
                                    pan: { enabled: true, mode: 'x' },
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
                </Box>
            </Flex>
        </Box>
    );
};

export default ProductUsageChart;
