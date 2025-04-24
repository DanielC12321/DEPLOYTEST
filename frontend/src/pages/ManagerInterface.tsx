// ManagerInterface.tsx
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Heading,
    Stack,
    Button,
    Text,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    List,
    ListItem,
    Spinner,
    useColorModeValue,
} from '@chakra-ui/react';

interface WeatherData {
    temperature: number;
    windSpeed: number;
    description: string;
    icon?: string;
    shortForecast?: string;
}

interface AnalyticsOverview {
    totalSales: number;
    orderCount: number;
    avgOrderValue: number;
    topProducts: { name: string; units_sold: number }[];
    lowStock: { name: string; quantity: number }[];
    employeeCount: number;
}

const ManagerInterface: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const weatherBg = useColorModeValue('white', 'gray.700');
    const apiUrl = process.env.REACT_APP_API_URL;

    // fetch weather
    useEffect(() => {
        fetch(`${apiUrl}/weather`)
            .then((res) => res.json())
            .then((data: WeatherData) => setWeather(data))
            .catch(console.error);
    }, []);

    // fetch analytics
    useEffect(() => {
        fetch(`${apiUrl}/manager/analytics/overview`)
            .then((res) => res.json())
            .then((data: AnalyticsOverview) => setAnalytics(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <Box p={8} bg="gray.50" minH="100vh">
            <Heading as="h1" size="2xl" mb={6} textAlign="center">
                Manager Dashboard
            </Heading>

            {/* Quick Actions */}
            <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                justify="center"
                wrap="wrap"
                mb={10}
            >
                <Button as={RouterLink} to="/login" colorScheme="blue" size="lg">
                    Logout
                </Button>
                <Button as={RouterLink} to="/manager/productusagechart" colorScheme="teal" size="lg">
                    Product Usage Chart
                </Button>
                <Button as={RouterLink} to="/manager/salesreport" colorScheme="teal" size="lg">
                    Sales Report
                </Button>
                <Button as={RouterLink} to="/manager/xreport" colorScheme="teal" size="lg">
                    X Report
                </Button>
                <Button as={RouterLink} to="/manager/zreport" colorScheme="teal" size="lg">
                    Z Report
                </Button>
                <Button as={RouterLink} to="/manager/inventory" colorScheme="teal" size="lg">
                    Inventory
                </Button>
                <Button as={RouterLink} to="/manager/employees" colorScheme="teal" size="lg">
                    Employee Management
                </Button>
            </Stack>

            {/* Analytics */}
            {loading ? (
                <Spinner size="xl" thickness="4px" speed="0.65s" />
            ) : analytics ? (
                <Box mb={10}>
                    <Heading size="lg" mb={4} textAlign="center">
                        Today’s Key Metrics
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                        <Stat p={4} boxShadow="sm" borderRadius="md" bg="white">
                            <StatLabel>Total Sales (Today)</StatLabel>
                            <StatNumber>${analytics.totalSales.toFixed(2)}</StatNumber>
                        </Stat>
                        <Stat p={4} boxShadow="sm" borderRadius="md" bg="white">
                            <StatLabel>Orders (Today)</StatLabel>
                            <StatNumber>{analytics.orderCount}</StatNumber>
                        </Stat>
                        <Stat p={4} boxShadow="sm" borderRadius="md" bg="white">
                            <StatLabel>Avg Order Value</StatLabel>
                            <StatNumber>${analytics.avgOrderValue.toFixed(2)}</StatNumber>
                        </Stat>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box boxShadow="sm" p={4} bg="white" borderRadius="md">
                            <Heading size="md" mb={2}>
                                Top 10 Products
                            </Heading>
                            <List spacing={1}>
                                {analytics.topProducts.map((p, i) => (
                                    <ListItem key={i}>
                                        {p.name} — {p.units_sold} sold
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Box boxShadow="sm" p={4} bg="white" borderRadius="md">
                            <Heading size="md" mb={2}>
                                Low Stock Ingredients
                            </Heading>
                            <List spacing={1}>
                                {analytics.lowStock.map((i, idx) => (
                                    <ListItem key={idx}>
                                        {i.name}: {i.quantity} left
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </SimpleGrid>

                    <Box mt={6} p={4} boxShadow="sm" bg="white" borderRadius="md">
                        <Text>
                            Total Active Employees: <strong>{analytics.employeeCount}</strong>
                        </Text>
                    </Box>
                </Box>
            ) : (
                <Text color="red.500">Failed to load analytics.</Text>
            )}

            {/* Weather */}
            {weather && (
                <Box
                    borderWidth={1}
                    borderRadius="md"
                    p={4}
                    bg={weatherBg}
                    boxShadow="sm"
                    maxW="400px"
                    mx="auto"
                >
                    <Heading size="md" mb={2}>
                        Current Weather
                    </Heading>
                    {weather.icon && (
                        <Box mb={2} display="flex" justifyContent="center">
                            <img
                                src={weather.icon}
                                alt={weather.shortForecast}
                                style={{ width: 64, height: 64 }}
                            />
                        </Box>
                    )}
                    <Text>{weather.shortForecast}</Text>
                    <Text>Temperature: {weather.temperature}°</Text>
                    <Text>Wind Speed: {weather.windSpeed}</Text>
                </Box>
            )}
        </Box>
    );
};

export default ManagerInterface;
