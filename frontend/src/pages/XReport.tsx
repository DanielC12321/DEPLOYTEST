import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useColorModeValue,
    Select,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import { useXReport } from '../context/XReportContext.tsx';
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

interface XReportData {
    hour: number;
    sales: number;
    paymentMethodBreakdown: { [key: string]: number };
}

export let setXReportZeroed: (zero: boolean) => void = () => {};

const convertHour = (rawHour: number): string => {
    let newHour = rawHour + 3;
    let period = 'am';
    if (newHour >= 12) {
        period = 'pm';
        if (newHour > 12) newHour -= 12;
    }
    return `${newHour} ${period}`;
};

const formatPaymentMethod = (method: string): string => {
    switch (method.toLowerCase()) {
        case 'amex':
            return 'Amex';
        case 'debit':
            return 'Debit';
        case 'giftcard':
            return 'Gift Card';
        case 'visa':
            return 'Visa';
        case 'mastercard':
            return 'MasterCard';
        case 'cash':
            return 'Cash';
        default:
            return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
    }
};

const XReport: React.FC = () => {
    const [currentDay, setCurrentDay] = useState<string>('2025-02-17');
    const [reportData, setReportData] = useState<XReportData[]>([]);
    const [adjustmentsData, setAdjustmentsData] = useState<{ returns: number; voids: number; discards: number }>({
        returns: 0,
        voids: 0,
        discards: 0,
    });
    const [paymentMethods, setPaymentMethods] = useState<{ payment_method: string; total: number }[]>([]);
    const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
    const { isZeroed, setIsZeroed } = useXReport();

    useEffect(() => {
        setXReportZeroed = setIsZeroed;
    }, [setIsZeroed]);

    useEffect(() => {
        if (!isZeroed) loadData();
    }, [isZeroed, currentDay]);

    const loadData = async () => {
        if (isZeroed) return;
        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            const salesRes = await fetch(`${apiUrl}/x-report-sales?current_day=${currentDay}&current_hour=24`);
            const sales = await salesRes.json();

            const adjRes = await fetch(`${apiUrl}/x-report-adjustments?current_day=${currentDay}&current_hour=24`);
            const adjJson = await adjRes.json();
            const adj = Array.isArray(adjJson) && adjJson.length > 0 ? adjJson[0] : adjJson;
            setAdjustmentsData(adj);

            const pmRes = await fetch(`${apiUrl}/x-report-payment-methods?current_day=${currentDay}&current_hour=24`);
            const pmJson = await pmRes.json();
            setPaymentMethods(pmJson);

            const combined: XReportData[] = sales.map((item: any) => ({
                hour: item.hour,
                sales: item.sales,
                paymentMethodBreakdown: pmJson.reduce((acc: any, curr: any) => {
                    acc[curr.payment_method] = curr.total;
                    return acc;
                }, {}),
            }));

            setReportData(combined);
            updateChart(combined);
        } catch (err) {
            console.error('Error loading X Report:', err);
            alert('Error loading X Report');
        }
    };

    const updateChart = (data: XReportData[]) => {
        setChartData({
            labels: data.map(d => convertHour(d.hour)),
            datasets: [
                {
                    label: 'Sales ($)',
                    data: data.map(d => d.sales),
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    // Determine what to display when zeroed
    const dispReport = isZeroed ? [] : reportData;
    const dispAdjust = isZeroed ? { returns: 0, voids: 0, discards: 0 } : adjustmentsData;
    const dispPM = isZeroed ? [] : paymentMethods;
    const dispChart = isZeroed ? { labels: [], datasets: [] } : chartData;

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
                        <Button size="sm" colorScheme="teal" variant="outline">
                            Sales Report
                        </Button>
                    </Link>
                    <Link to="/manager/xreport">
                        <Button size="sm" colorScheme="teal" variant="solid">
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

                {/* Controls */}
                <Flex gap={4} align="center" justify="center" mt={4} flexWrap="wrap">
                    <Box>
                        <Text fontSize="sm">Current Day</Text>
                        <DatePicker
                            selected={new Date(currentDay)}
                            onChange={date => setCurrentDay(date!.toISOString().split('T')[0])}
                            dateFormat="yyyy-MM-dd"
                            customInput={<Input size="sm" variant="outline" />}
                        />
                    </Box>
                    <Button size="sm" colorScheme="red" onClick={() => setIsZeroed(false)}>
                        Reset X Report
                    </Button>
                </Flex>
            </Flex>

            {/* Title */}
            <Box mt="160px" textAlign="center">
                <Heading size="lg">X Report</Heading>
            </Box>

            {/* Main Content */}
            <Flex direction={['column', 'row']} gap={6} mt={6}>
                {/* Adjustments & Payment Methods */}
                <Box flex={1} borderWidth={1} borderRadius="md" p={4} bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Heading size="md" mb={2}>
                        Adjustments
                    </Heading>
                    <Text><strong>Returns:</strong> ${dispAdjust.returns}</Text>
                    <Text><strong>Voids:</strong> ${dispAdjust.voids}</Text>
                    <Text><strong>Discards:</strong> ${dispAdjust.discards}</Text>

                    <Heading size="md" mt={4} mb={2}>
                        Payment Methods
                    </Heading>
                    <Table size="sm" variant="simple">
                        <Thead bg={useColorModeValue('gray.100', 'gray.700')} position="sticky" top={0} zIndex={1}>
                            <Tr>
                                <Th>Method</Th>
                                <Th isNumeric>Total ($)</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {dispPM.map((m, i) => (
                                <Tr key={i}>
                                    <Td>{formatPaymentMethod(m.payment_method)}</Td>
                                    <Td isNumeric>{m.total}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {/* Hourly Sales Table */}
                <Box flex={1} maxH="500px" overflowY="auto" borderWidth={1} borderRadius="md" p={4}>
                    <Table size="sm" variant="simple">
                        <Thead bg={useColorModeValue('gray.100', 'gray.700')} position="sticky" top={0} zIndex={1}>
                            <Tr>
                                <Th>Time</Th>
                                <Th isNumeric>Sales ($)</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {dispReport.map((row, i) => (
                                <Tr key={i}>
                                    <Td>{convertHour(row.hour)}</Td>
                                    <Td isNumeric>{row.sales}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {/* Sales Chart */}
                <Box flex={1} height="500px" borderWidth={1} borderRadius="md" p={4}>
                    <Bar
                        data={dispChart}
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
                </Box>
            </Flex>
        </Box>
    );
};

export default XReport;
