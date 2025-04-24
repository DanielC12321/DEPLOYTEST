import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Flex,
    Heading,
    Text,
    Input,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useColorModeValue,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useXReport } from '../context/XReportContext.tsx';

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
    signature: string;
}

export let setXReportZeroed: (zero: boolean) => void = () => {};

const paymentMethodsList = [
    'Amex',
    'Cash',
    'Debit',
    'Gift Card',
    'Mastercard',
    'Visa',
    'N/A',
];

const formatPaymentMethod = (method: string | null): string => {
    if (!method) return 'N/A';
    const lower = method.toLowerCase();
    if (lower === 'amex') return 'Amex';
    if (lower === 'cash') return 'Cash';
    if (lower === 'debit') return 'Debit';
    if (lower === 'giftcard') return 'Gift Card';
    if (lower === 'mastercard') return 'Mastercard';
    if (lower === 'visa') return 'Visa';
    return 'N/A';
};

const ZReport: React.FC = () => {
    const today = new Date();
    const [startDate, setStartDate] = useState<Date>(new Date('2025-02-17'));
    const [endDate, setEndDate] = useState<Date>(today);
    const [salesData, setSalesData] = useState<ZReportSalesData>({ sales: 0, total_tax: 0 });
    const [paymentMethods, setPaymentMethods] = useState<ZReportPaymentMethod[]>([]);
    const [adjustments, setAdjustments] = useState<ZReportAdjustments>({
        discounts: 0,
        voids: 0,
        service_charges: 0,
    });
    const [employeeSignatures, setEmployeeSignatures] = useState<EmployeeSignature[]>([]);
    const { setIsZeroed } = useXReport();
    const apiUrl = process.env.REACT_APP_API_URL;

    // expose zeroing fn
    useEffect(() => {
        setXReportZeroed = setIsZeroed;
    }, [setIsZeroed]);

    const loadZReportData = async () => {
        try {
            const start = startDate.toISOString().split('T')[0];
            const end = endDate.toISOString().split('T')[0];

            // Sales & tax
            const salesRes = await fetch(`${apiUrl}/z-report-sales-tax?start_date=${start}&end_date=${end}`);
            const salesJson = await salesRes.json();
            if (salesJson?.length) {
                const d = salesJson[0];
                setSalesData({ sales: parseFloat(d.sales), total_tax: parseFloat(d.total_tax) });
            } else {
                setSalesData({ sales: 0, total_tax: 0 });
            }

            // Payment methods
            const pmRes = await fetch(`${apiUrl}/z-report-payment-methods?start_date=${start}&end_date=${end}`);
            const pmJson = await pmRes.json();
            setPaymentMethods(Array.isArray(pmJson)
                ? pmJson.map((pm: any) => ({
                    payment_method: pm.payment_method,
                    total: parseFloat(pm.amount),
                }))
                : []
            );

            // Adjustments
            const adjRes = await fetch(`${apiUrl}/z-report-adjustments?start_date=${start}&end_date=${end}`);
            const adjJson = await adjRes.json();
            if (Array.isArray(adjJson) && adjJson.length) {
                const a = adjJson[0];
                setAdjustments({
                    discounts: parseFloat(a.discounts),
                    voids: parseFloat(a.voids),
                    service_charges: parseFloat(a.service_charges),
                });
            } else {
                setAdjustments({ discounts: 0, voids: 0, service_charges: 0 });
            }

            // Employee signatures
            const sigRes = await fetch(`${apiUrl}/z-report-manager-names?start_date=${start}&end_date=${end}`);
            const sigJson = await sigRes.json();
            setEmployeeSignatures(Array.isArray(sigJson)
                ? sigJson.map((e: any) => ({
                    employee_name: e.name,
                    signature: '',
                }))
                : []
            );

            // zero out X report
            setIsZeroed(true);
        } catch (err) {
            console.error('Error loading Z Report data:', err);
            alert('Error loading Z Report data');
        }
    };

    // initial load on mount
    useEffect(() => {
        loadZReportData();
    }, []);

    // **NEW**: auto-reload whenever startDate or endDate change
    useEffect(() => {
        loadZReportData();
    }, [startDate, endDate]);

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
                        <Button size="sm" colorScheme="teal" variant="outline">
                            X Report
                        </Button>
                    </Link>
                    <Link to="/manager/zreport">
                        <Button size="sm" colorScheme="teal" variant="solid">
                            Z Report
                        </Button>
                    </Link>
                    <Link to="/manager/inventory">
                        <Button size="sm" colorScheme="teal" variant="outline">
                            Inventory
                        </Button>
                    </Link>
                </Flex>

                {/* Date Pickers & Run */}
                <Flex gap={4} align="center" justify="center" mt={4} flexWrap="wrap">
                    <Box>
                        <Text fontSize="sm">Start Date</Text>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date!)}
                            dateFormat="yyyy-MM-dd"
                            customInput={<Input size="sm" variant="outline" />}
                        />
                    </Box>
                    <Box>
                        <Text fontSize="sm">End Date</Text>
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date!)}
                            dateFormat="yyyy-MM-dd"
                            customInput={<Input size="sm" variant="outline" />}
                        />
                    </Box>
                </Flex>
            </Flex>

            {/* Title & Dates */}
            <Box mt="160px" textAlign="center">
                <Heading size="lg">Z Report</Heading>
                <Text>
                    <strong>Start Date:</strong> {startDate.toISOString().split('T')[0]}
                </Text>
                <Text>
                    <strong>End Date:</strong> {endDate.toISOString().split('T')[0]}
                </Text>
            </Box>

            {/* Columns */}
            <Flex direction={['column', 'row']} gap={6} mt={6}>
                {/* Adjustments & Payments */}
                <Box flex={1} borderWidth={1} borderRadius="md" p={4} bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Heading size="md" mb={2}>
                        Adjustments
                    </Heading>
                    <Text>
                        <strong>Discounts:</strong> ${adjustments.discounts.toFixed(2)}
                    </Text>
                    <Text>
                        <strong>Voids:</strong> ${adjustments.voids.toFixed(2)}
                    </Text>
                    <Text>
                        <strong>Service Charges:</strong> ${adjustments.service_charges.toFixed(2)}
                    </Text>

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
                            {paymentMethodsList.map((methodName, i) => {
                                const found = paymentMethods.find(pm => formatPaymentMethod(pm.payment_method) === methodName);
                                return (
                                    <Tr key={i}>
                                        <Td>{methodName}</Td>
                                        <Td isNumeric>{found ? found.total.toFixed(2) : '0.00'}</Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>

                {/* Sales & Tax */}
                <Box flex={1} borderWidth={1} borderRadius="md" p={4} bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Heading size="md" mb={2}>
                        Sales & Tax Information
                    </Heading>
                    <Text>
                        <strong>Total Sales:</strong> ${salesData.sales.toFixed(2)}
                    </Text>
                    <Text>
                        <strong>Total Tax:</strong> ${(salesData.total_tax / 100).toFixed(2)}
                    </Text>
                </Box>

                {/* Employee Signatures */}
                <Box flex={1} borderWidth={1} borderRadius="md" p={4} bg={useColorModeValue('gray.50', 'gray.800')}>
                    <Heading size="md" mb={2}>
                        Employee Signatures
                    </Heading>
                    <Table size="sm" variant="simple">
                        <Thead bg={useColorModeValue('gray.100', 'gray.700')} position="sticky" top={0} zIndex={1}>
                            <Tr>
                                <Th>Employee Signature</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {employeeSignatures.map((emp, i) => (
                                <Tr key={i}>
                                    <Td>{emp.employee_name}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Flex>
        </Box>
    );
};

export default ZReport;
